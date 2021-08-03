import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../../generator';
import { minCodeSize, parseTokens, reshape } from '../../reshape';
import { DEFAULT_HEIGHT_WIDTH_RATIO } from '../../constants';
import { findRegionsBySaliency } from './saliency';
import { findRegionsByIntensity } from './intensity';
import { ModeType, SIZE_BUFFER_RATIO, DEFAULT_CUTOFF_THRESHOLD } from './common';

const pica = import('pica');

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

export async function drawCode(
    code: string,
    imageFileUri: string,
    mode: ModeType,
    cutoff: number,
    invert: boolean
): Promise<string> {
    const genCode = new WhitespaceMarkerGenerator(parse(code)).generate().code;
    const tokens = parseTokens(genCode);
    if (invert) {
        cutoff = 1 - cutoff;
    }
    // maybe have user click which areas to fill in?
    const targetSize = (minCodeSize(tokens) * SIZE_BUFFER_RATIO) / cutoff;
    const { canvas, ctx } = await loadImageToCanvas(imageFileUri, targetSize);
    console.time('draw');
    // TODO make these a web worker to avoid blocking
    const runs =
        mode === 'saliency'
            ? findRegionsBySaliency(canvas, ctx, cutoff, invert)
            : findRegionsByIntensity(canvas, ctx, cutoff, invert);
    console.timeEnd('draw');
    // TODO remove this line
    document.body.appendChild(canvas);
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
