// TODO
// what i really want to have is a way to make code in the shape of any picture
// like picture to asciiart, but with your code
// does that exist already?
// if not, i could perhaps do a edge detect and then write code in every other location
// or maybe some background detection? and then just fill in everything that's not background
// apparently a keyword is "stippling"
// https://github.com/IonicaBizau/image-to-ascii promising but has native deps (graphicsmagick)
// okay it seems like most of them are pretty simple using the pixel intensity values...
// for image resizing... https://github.com/nodeca/pica

import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';
import { minCodeSize, parseTokens, reshape } from '../reshape';
import { DEFAULT_HEIGHT_WIDTH_RATIO } from '../constants';
import { cheng11 } from './saliency';
import {
    extractRunsByCutoff,
    INTENSITY_CUTOFF,
    INTENSITY_RANGE,
    SIZE_BUFFER_RATIO,
} from './common';

const pica = import('pica');

// so an idea is, given an image:
// first convert to ascii by looking at intensities (filter out e.g. bottom half by median?)
// fyi intensity is just r + g + b
// number of set pixels = number of chars, scale up/down to the code's actual length
// send to reshaper, except don't join with newlines instead line up each
// segment with what's in the original

// https://coderwall.com/p/jzdmdq/loading-image-from-local-file-into-javascript-and-getting-pixel-data

// site design example? https://ascii-generator.site/

// Load the given image uri to an invisible canvas and return the canvas and its 2d context
// Also resize the picture to make its pixel count as close to targetSize as possible
async function loadImageToCanvas(imageFileUri: string, targetSize: number) {
    // First load the image onto an invisible canvas
    const source = document.createElement('canvas');
    const ctx = source.getContext('2d')!;
    await new Promise<void>((resolve, reject) => {
        const handler = () => {
            source.width = Math.floor(image.width);
            source.height = Math.floor(image.height);
            ctx.drawImage(image, 0, 0, source.width, source.height);
            resolve();
        };
        const image = new Image();
        image.onload = handler;
        image.onerror = reject;
        image.src = imageFileUri;
    });
    const target = document.createElement('canvas');
    // Find the ratio to get from source dimensions to target size
    // math check: e.g. target = 16, s.w = s.h = 2, then ratio = 2 as expected
    const ratio = Math.sqrt(targetSize / (source.width * source.height));
    target.width = Math.round(
        source.width * ratio * Math.sqrt(DEFAULT_HEIGHT_WIDTH_RATIO)
    );
    target.height = Math.round(
        (source.height * ratio) / Math.sqrt(DEFAULT_HEIGHT_WIDTH_RATIO)
    );
    const resizer = (await pica).default();
    await resizer.resize(source, target);
    return { canvas: target, ctx: target.getContext('2d')! };
}

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
function findCodeRegions(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
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
    const cutoff = data.width * data.height * INTENSITY_CUTOFF;
    let accum = 0;
    let cutoffValue = histogram.length - 1;
    while (accum < cutoff && cutoffValue > 0) {
        accum += histogram[cutoffValue];
        cutoffValue--;
    }
    console.log(cutoffValue, cutoff);
    return extractRunsByCutoff(data.width, data.height, (row, col) => {
        const i = row * data.width + col;
        const [r, g, b, a] = data.data.slice(i * 4, (i + 1) * 4);
        const intensity = Math.round((a / 255) * (r + g + b));
        return intensity >= cutoffValue;
    });
}

export async function drawCode(code: string, imageFileUri: string): Promise<string> {
    const genCode = new WhitespaceMarkerGenerator(parse(code)).generate().code;
    const tokens = parseTokens(genCode);
    // maybe have user click which areas to fill in?
    const targetSize = (minCodeSize(tokens) * SIZE_BUFFER_RATIO) / INTENSITY_CUTOFF;
    const { canvas, ctx } = await loadImageToCanvas(imageFileUri, targetSize);
    console.time('thing');
    const runs = cheng11(canvas, ctx);
    console.timeEnd('thing');
    document.body.appendChild(canvas);
    // const runs = findCodeRegions(canvas, ctx);
    // Run reshape according to those runs of pixels
    const shapeFn = (i: number) =>
        i < runs.length ? runs[i].length : Number.MAX_SAFE_INTEGER;
    const codeSegments = reshape(tokens, shapeFn);
    if (codeSegments.length > runs.length + 1) {
        // should never be reached!
        throw new Error(
            `Unexpected segment length of ${codeSegments.length} from ${runs.length} runs`
        );
    }
    // If there are more runs than segments, populate remainder with empty spaces
    while (codeSegments.length < runs.length) {
        const nextRunLength = runs[codeSegments.length].length;
        if (nextRunLength > 5) {
            // longer runs can be filled in to more closely match appearance
            codeSegments.push(`/*${'o'.repeat(nextRunLength - 4)}*/`);
        } else {
            codeSegments.push(' '.repeat(nextRunLength));
        }
    }
    let result = '';
    let runIndex = 0;
    for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {
            const i = row * canvas.width + col;
            if (runIndex < runs.length && i >= runs[runIndex][0]) {
                result += codeSegments[runIndex] + ' ';
                col += codeSegments[runIndex].length;
                runIndex++;
            } else {
                // for multiple runs in the same line, put spaces between them
                result += ' ';
            }
        }
        result += '\n';
    }
    for (let i = runIndex; i < codeSegments.length; i++) {
        result += `\n${codeSegments[i]}`;
    }
    return result;
}

// improvement idea: https://dahtah.github.io/imager/foreground_background.html#k-nearest-neighbour-approach
