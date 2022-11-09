import { SALIENCY_BUCKETS, CanvasType } from '../constants';
import { extractRunsByCutoff } from './common';

// @ts-ignore no types provided
import { Colour } from '../vendor/IsThisColourSimilar/Colour';
import LRUCache from 'lru-cache';

// Retain the top-n histogram buckets to reach THRESHOLD coverage of the picture.
// Fold anything that doesn't reach the threshold to the nearest bucket, by manhattan distance.
const HISTOGRAM_THRESHOLD = 0.95;

const bucketSize = 256 / SALIENCY_BUCKETS;
const toBucket = (value: number) => Math.floor(value / bucketSize);
const colorToIndex = (r: number, g: number, b: number) =>
    toBucket(r) * SALIENCY_BUCKETS * SALIENCY_BUCKETS +
    toBucket(g) * SALIENCY_BUCKETS +
    toBucket(b);

const indexToColor: [number, number, number][] = new Array(
    Math.pow(SALIENCY_BUCKETS, 3)
)
    .fill(0)
    .map((_, idx) => {
        const rIndex = Math.floor(idx / (SALIENCY_BUCKETS * SALIENCY_BUCKETS));
        const gIndex = Math.floor((idx - rIndex) / SALIENCY_BUCKETS);
        const bIndex = idx - rIndex - gIndex;
        return [
            (rIndex + 0.5) * bucketSize,
            (gIndex + 0.5) * bucketSize,
            (bIndex + 0.5) * bucketSize,
        ];
    });

const rgbCache = new LRUCache({ max: 2 * Math.pow(SALIENCY_BUCKETS, 3) });

function rgb2lab(r: number, g: number, b: number) {
    const key = [r, g, b].join(' ');
    const res = rgbCache.get(key);
    if (res != null) {
        return res;
    } else {
        const lab = Colour.rgba2lab(r, g, b);
        rgbCache.set(key, lab);
        return lab;
    }
}

const diff = (
    r1: number,
    g1: number,
    blu1: number,
    r2: number,
    g2: number,
    blu2: number
) => {
    const [l1, a1, b1] = rgb2lab(r1, g1, blu1);
    const [l2, a2, b2] = rgb2lab(r2, g2, blu2);
    return Colour.deltaE00(l1, a1, b1, l2, a2, b2);
};

class CompressedHistogram {
    compressed: { originalIndex: number; count: number }[] = [];
    // maps original index to compressed index (many-to-one mapping)
    originalToCompressedMap: Map<number, number> = new Map();

    constructor(histogram: number[]) {
        const total = histogram.reduce((prev, cur) => prev + cur, 0);
        const target = Math.round(total * HISTOGRAM_THRESHOLD);
        const sorted = histogram
            .map((v, idx) => ({ v, idx }))
            .sort((a, b) => b.v - a.v);
        let i, accum;
        for (i = 0, accum = 0; i < sorted.length && accum < target; i++) {
            const { v, idx } = sorted[i];
            accum += v;
            this.compressed.push({ originalIndex: idx, count: v });
            this.originalToCompressedMap.set(idx, this.compressed.length - 1);
        }
        for (; i < sorted.length; i++) {
            const { v, idx } = sorted[i];
            // add the remaining values to their closest neighbors in the histogram
            const [r1, g1, blu1] = indexToColor[idx];
            const [l1, a1, b1] = rgb2lab(r1, g1, blu1);
            let smallestDelta = Number.MAX_SAFE_INTEGER;
            let smallestDeltaIdx = 0;
            // find the closest color by perceptual difference
            for (const { delta, idx } of this.compressed.map(
                ({ originalIndex }, idx) => {
                    const [r2, g2, blu2] = indexToColor[originalIndex];
                    const [l2, a2, b2] = rgb2lab(r2, g2, blu2);
                    return { delta: Colour.deltaE00(l1, a1, b1, l2, a2, b2), idx };
                }
            )) {
                if (delta < smallestDelta) {
                    smallestDelta = delta;
                    smallestDeltaIdx = idx;
                }
            }
            this.compressed[smallestDeltaIdx].count += v;
            this.originalToCompressedMap.set(idx, smallestDeltaIdx);
        }
    }

    /**
     * Given color r, g, b, compute its saliency from the histogram.
     * Saliency of a pixel is sum of its color distance with all other pixels
     * instead of comparing every pair of pixels, we take distance against each histogram bucket,
     * weighted by the size of its set
     */
    saliency(r: number, g: number, b: number) {
        const pixelIndex = colorToIndex(r, g, b);
        const compressedPixelIndex = this.originalToCompressedMap.get(pixelIndex)!;
        return this.compressed.reduce((prev, cur, idx) => {
            if (idx === compressedPixelIndex) {
                return prev;
            } else {
                const [rh, gh, bh] = indexToColor[cur.originalIndex];
                return prev + cur.count * diff(r, g, b, rh, gh, bh);
            }
        }, 0);
    }
}

// Uses global perceptual contrast to detect salient regions,
// implementation of the algorithm in the below paper:
// M.-M. Cheng et al., "Global Contrast based Salient Region Detection", in IEEE CVPR, 2011
// https://mmcheng.net/mftp/Papers/SaliencyTPAMI.pdf
export function findRegionsBySaliency(
    canvas: CanvasType,
    ctx: CanvasRenderingContext2D,
    cutoffRatio: number,
    invert: boolean
) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // cheng method quantizes 0, 255 range into 12 buckets for each of r,g,b
    const colorHistogram: number[] = new Array(Math.pow(SALIENCY_BUCKETS, 3)).fill(0);
    // group each pixel into histogram based by rgb value
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b] = data.data.slice(i, i + 3);
        colorHistogram[colorToIndex(r, g, b)]++;
    }
    const histogram = new CompressedHistogram(colorHistogram);
    const perPixelSaliency: number[] = new Array(canvas.width * canvas.height);
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b] = data.data.slice(i, i + 3);
        perPixelSaliency[i / 4] = histogram.saliency(r, g, b);
    }
    const sortedPixels = perPixelSaliency
        .concat()
        .sort((a, b) => (invert ? a - b : b - a));
    const cutoffValue = sortedPixels[Math.round(cutoffRatio * sortedPixels.length)];

    return extractRunsByCutoff(data.width, data.height, (row, col) => {
        const i = row * data.width + col;
        return invert
            ? perPixelSaliency[i] <= cutoffValue
            : perPixelSaliency[i] >= cutoffValue;
    });
}
