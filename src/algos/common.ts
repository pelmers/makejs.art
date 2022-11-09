import { parse } from '@babel/parser';
import { Canvas } from 'node-canvas';
import { WhitespaceMarkerGenerator } from '../generator';
import { parseTokens, minCodeSize, reshape } from '../reshape';
import { findRegionsByIntensity } from './intensity';
import { findRegionsBySaliency } from './saliency';

export const DEFAULT_CUTOFF_THRESHOLD = 0.3;
// Intensity values are sum of r, g, b at each pixel
export const INTENSITY_RANGE = 1 + 255 * 3;
// Resize images to accomodate imperfect fill
export const SIZE_BUFFER_RATIO = 0.95;
// 12 is value referenced in Cheng '11
export const SALIENCY_BUCKETS = 12;

export const MODES = ['intensity', 'saliency'] as const;
export type ModeType = typeof MODES[number];
export type CanvasType = Canvas | HTMLCanvasElement;

export function modeDescription(mode: ModeType): string {
    return {
        intensity: 'Intensity (faster)',
        saliency: 'Saliency (slower)',
    }[mode];
}

export function extractRunsByCutoff(
    width: number,
    height: number,
    passesCutoff: (row: number, column: number) => boolean
) {
    // compute 'runs' of pixels > cutoff in the image rows to use as line widths
    const runs: number[][] = [];
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const i = row * width + col;
            if (passesCutoff(row, col)) {
                // Decide whether we're still on the last run, or make a new one
                if (
                    runs.length > 0 &&
                    col > 0 &&
                    runs[runs.length - 1][runs[runs.length - 1].length - 1] === i - 1
                ) {
                    runs[runs.length - 1].push(i);
                } else {
                    runs.push([i]);
                }
            }
        }
    }
    return runs;
}

export async function drawCodeCommon(
    code: string,
    imageFileUri: string,
    mode: ModeType,
    cutoff: number,
    invert: boolean,
    loadImageToCanvas: (
        imageFileUri: string,
        targetSize: number
    ) => Promise<{ canvas: CanvasType; ctx: CanvasRenderingContext2D }>
): Promise<string> {
    const genCode = new WhitespaceMarkerGenerator(parse(code)).generate().code;
    const tokens = parseTokens(genCode);
    if (invert) {
        cutoff = 1 - cutoff;
    }
    // maybe have user click which areas to fill in?
    const targetSize = (minCodeSize(tokens) * SIZE_BUFFER_RATIO) / cutoff;
    const { canvas, ctx } = await loadImageToCanvas(imageFileUri, targetSize);
    console.time('code shaping');
    // TODO make these a web worker to avoid blocking
    const runs =
        mode === 'saliency'
            ? findRegionsBySaliency(canvas, ctx, cutoff, invert)
            : findRegionsByIntensity(canvas, ctx, cutoff, invert);
    console.timeEnd('code shaping');
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
