import { extractRunsByCutoff, SALIENCY_BUCKETS } from './common';

// @ts-ignore no types provided
import { Colour } from '../vendor/IsThisColourSimilar/Colour';

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

const diff = (
    r1: number,
    g1: number,
    blu1: number,
    r2: number,
    g2: number,
    blu2: number
) => {
    // TODO
    // literally 90% of the time in these functions... LOL
    // well i can cache the histogram's lab values since those don't change
    // that would save about 25% time
    // and we can compress the histogram to save about 10x more time...
    const [l1, a1, b1] = Colour.rgba2lab(r1, g1, blu1);
    const [l2, a2, b2] = Colour.rgba2lab(r2, g2, blu2);
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
            const [l1, a1, b1] = Colour.rgba2lab(r1, g1, blu1);
            let smallestDelta = Number.MAX_SAFE_INTEGER;
            let smallestDeltaIdx = 0;
            // find the closest color by perceptual difference
            for (const { delta, idx } of this.compressed.map(
                ({ originalIndex }, idx) => {
                    const [r2, g2, blu2] = indexToColor[originalIndex];
                    const [l2, a2, b2] = Colour.rgba2lab(r2, g2, blu2);
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
        // TODO also add the smoothing factor
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
    canvas: HTMLCanvasElement,
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
    // TODO threshold the color histogram by keeping 95% of the pixels
    const histogram = new CompressedHistogram(colorHistogram);
    const perPixelSaliency: number[] = new Array(canvas.width * canvas.height);
    let maxSaliency = 1;
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b] = data.data.slice(i, i + 3);
        perPixelSaliency[i / 4] = histogram.saliency(r,g,b);
        maxSaliency = Math.max(maxSaliency, perPixelSaliency[i / 4]);
    }
    // TODO implement quantization smoothingg
    const sortedPixels = perPixelSaliency
        .concat()
        .sort((a, b) => (invert ? a - b : b - a));
    const cutoffValue = sortedPixels[Math.round(cutoffRatio * sortedPixels.length)];

    // TODO remove these lines
    const newData = new ImageData(
        new Uint8ClampedArray(canvas.width * canvas.height * 4),
        canvas.width,
        canvas.height
    );
    for (let i = 0; i < data.data.length; i += 4) {
        if (perPixelSaliency[i / 4] >= cutoffValue) {
            newData.data[i] = Math.floor((perPixelSaliency[i / 4] / maxSaliency) * 256);
            newData.data[i + 1] = Math.floor(
                (perPixelSaliency[i / 4] / maxSaliency) * 256
            );
            newData.data[i + 2] = Math.floor(
                (perPixelSaliency[i / 4] / maxSaliency) * 256
            );
            newData.data[i + 3] = 255;
        } else {
            newData.data[i] = 0;
            newData.data[i + 1] = 0;
            newData.data[i + 2] = 0;
            newData.data[i + 3] = 255;
        }
    }

    ctx.putImageData(newData, 0, 0);
    return extractRunsByCutoff(data.width, data.height, (row, col) => {
        const i = row * data.width + col;
        return invert
            ? perPixelSaliency[i] <= cutoffValue
            : perPixelSaliency[i] >= cutoffValue;
    });
}

function deltaE(rgbA: number[], rgbB: number[]) {
    let labA = rgb2lab(rgbA);
    let labB = rgb2lab(rgbB);
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / 1.0;
    let deltaCkcsc = deltaC / sc;
    let deltaHkhsh = deltaH / sh;
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb: number[]) {
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        x,
        y,
        z;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
