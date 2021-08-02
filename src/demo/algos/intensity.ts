import {
    extractRunsByCutoff,
    INTENSITY_RANGE,
} from './common';

// so an idea is, given an image:
// first convert to ascii by looking at intensities (filter out e.g. bottom half by median?)
// fyi intensity is just r + g + b
// number of set pixels = number of chars, scale up/down to the code's actual length
// send to reshaper, except don't join with newlines instead line up each
// segment with what's in the original

// https://coderwall.com/p/jzdmdq/loading-image-from-local-file-into-javascript-and-getting-pixel-data

// site design example? https://ascii-generator.site/
// TODO actually this is crap, i should find the best pixels in the image first, then resize?
// methods include:
// semi-interactive: https://dahtah.github.io/imager/foreground_background.html
// automated visual attention based: https://mmcheng.net/mftp/Papers/SaliencyTPAMI.pdf
// opencvjs has grabcut and findcontours, perhaps can use findcontours to replace the region finding
// https://docs.opencv.org/4.5.2/d2/dbd/tutorial_distance_transform.html
// actually if i just do the HC method, i think i can do it all in JS since it's just pixel-based
// for color difference, https://github.com/hamada147/IsThisColourSimilar
// Saliency of a pixel is sum of its color distance with all other pixels

// Return consecutive indices (row * width + col) where code should be placed
// How does it work?
// First I convert every pixel to an intensity (for now just r + g + b)
// Then I make a histogram and find the cutoff value above which there are image size * INTENSITY_CUTOFF pixels
// Finally go through the image again and mark consecutive runs of such pixels
export function findRegionsByIntensity(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    cutoffRatio: number,
    invert: boolean,
): number[][] {
    // Build an intensity histogram so we can find the value that hits cutoff
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const histogram: number[] = new Array(INTENSITY_RANGE).fill(0);
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b, a] = data.data.slice(i, i + 4);
        const intensity = Math.round((a / 255) * (r + g + b));
        histogram[intensity]++;
    }

    // Find the cutoff value by looking at histogram
    const cutoff = data.width * data.height * cutoffRatio;
    let accum = 0;
    let cutoffValue = histogram.length - 1;
    if (invert) {
        histogram.reverse();
    }
    while (accum < cutoff && cutoffValue > 0) {
        accum += histogram[cutoffValue];
        cutoffValue--;
    }
    if (invert) {
        cutoffValue = (histogram.length - 1) - cutoffValue;
    }
    console.log(cutoffValue, cutoff);
    return extractRunsByCutoff(data.width, data.height, (row, col) => {
        const i = row * data.width + col;
        const [r, g, b, a] = data.data.slice(i * 4, (i + 1) * 4);
        const intensity = Math.round((a / 255) * (r + g + b));
        return invert? intensity <= cutoffValue: intensity >= cutoffValue;
    });
}
