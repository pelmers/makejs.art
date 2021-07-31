import { SALIENCY_BUCKETS } from './custom';

// @ts-ignore no types provided
import { Colour } from './vendor/IsThisColourSimilar/Colour';

export function cheng11(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // cheng method quantizes 0, 255 range into 12 buckets for each of r,g,b
    const colorHistogram = new Array(Math.pow(SALIENCY_BUCKETS, 3)).fill(0);
    const bucketSize = 256 / SALIENCY_BUCKETS;
    const toBucket = (value: number) => Math.floor(value / bucketSize);
    const colorToIndex = (r: number, g: number, b: number) =>
        toBucket(r) * SALIENCY_BUCKETS * SALIENCY_BUCKETS +
        toBucket(g) * SALIENCY_BUCKETS +
        toBucket(b);
    const indexToColor = new Array(Math.pow(SALIENCY_BUCKETS, 3))
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
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b] = data.data.slice(i, i + 3);
        colorHistogram[colorToIndex(r, g, b)]++;
    }
    console.log(colorHistogram, indexToColor);
    // TODO threshold the color histogram by keeping 95% of the pixels
    const perPixelSaliency = new Array(canvas.width * canvas.height);
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
    let maxSaliency = 1;
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b] = data.data.slice(i, i + 3);
        const pixelIndex = colorToIndex(r, g, b);
        // Saliency of a pixel is sum of its color distance with all other pixels
        perPixelSaliency[i / 4] = colorHistogram.reduce((prev, cur, idx) => {
            if (idx === pixelIndex) {
                return prev;
            } else {
                const [rh, gh, bh] = indexToColor[idx];
                return prev + cur * diff(r, g, b, rh, gh, bh);
            }
        }, 0);
        maxSaliency = Math.max(maxSaliency, perPixelSaliency[i / 4]);
    }
    // TODO implement quantization smoothinggg
    const newData = new ImageData(
        new Uint8ClampedArray(canvas.width * canvas.height * 4),
        canvas.width,
        canvas.height
    );
    for (let i = 0; i < data.data.length; i += 4) {
        // TODO remove these lines
        newData.data[i] = Math.floor((perPixelSaliency[i / 4] / maxSaliency) * 256);
        newData.data[i + 1] = Math.floor((perPixelSaliency[i / 4] / maxSaliency) * 256);
        newData.data[i + 2] = Math.floor((perPixelSaliency[i / 4] / maxSaliency) * 256);
        newData.data[i + 3] = 255;
    }

    ctx.putImageData(newData, 0, 0);
    console.log(perPixelSaliency);
    console.log(newData);
}
