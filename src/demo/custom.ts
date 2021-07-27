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

import { parse } from "@babel/parser";
import { WhitespaceMarkerGenerator } from "../generator";
import { minCodeSize, parseTokens } from "../reshape";

// so an idea is, given an image:
// first convert to ascii by looking at intensities (filter out e.g. bottom half by median?)
// fyi intensity is just r + g + b
// number of set pixels = number of chars, scale up/down to the code's actual length
// send to reshaper, except don't join with newlines instead line up each
// segment with what's in the original

// https://coderwall.com/p/jzdmdq/loading-image-from-local-file-into-javascript-and-getting-pixel-data

// site design example? https://ascii-generator.site/

// TODO add as input to the fn
const INTENSITY_CUTOFF = 0.5;
// Intensity values are sum of r, g, b at each pixel
const INTENSITY_RANGE = 255 * 3;

const SIZE_BUFFER_RATIO = 2;

// Load the given image uri to an invisible canvas and return the canvas and its 2d context
async function loadImageToCanvas(imageFileUri: string) {
    // First load the image onto an invisible canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    await new Promise<void>((resolve, reject) => {
        const handler = () => {
            canvas.width = Math.floor(image.width);
            canvas.height = Math.floor(image.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve();
        };
        const image = new Image();
        image.onload = handler;
        image.onerror = reject;
        image.src = imageFileUri;
    });
    return { canvas, ctx };
}

export async function drawCode(code: string, imageFileUri: string) {
    const genCode = new WhitespaceMarkerGenerator(parse(code)).generate().code;
    const tokens = parseTokens(genCode);
    const targetSize = minCodeSize(tokens) * SIZE_BUFFER_RATIO;
    // TODO first resize the image to target size
    const { canvas, ctx } = await loadImageToCanvas(imageFileUri);
    // TODO now find the cutoff intensity point by iterating over pxls and making a histogram
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const histogram = new Array(INTENSITY_RANGE).fill(0);
    console.log(data.data.slice(4));
    let tot = 0;
    for (let i = 0; i < data.data.length; i += 4) {
        const [r, g, b, a] = data.data.slice(i, i + 4);
        const intensity = Math.round((a / 255) * (r + g + b));
        histogram[intensity]++;
        tot++;
    }
    console.log(histogram, tot, data.height * data.width);
}
