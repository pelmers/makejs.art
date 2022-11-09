import { createCanvas, loadImage } from 'node-canvas';
import { DEFAULT_HEIGHT_WIDTH_RATIO, ModeType } from '../constants';
import { drawCodeCommon } from './drawCode';

async function loadImageToCanvas(imageFilePath: string, targetSize: number) {
    const image = await loadImage(imageFilePath);
    // Find the ratio to get from source dimensions to target size
    // math check: e.g. target = 16, s.w = s.h = 2, then ratio = 2 as expected
    const ratio = Math.sqrt(targetSize / (image.width * image.height));
    const targetWidth = Math.round(
        image.width * ratio * Math.sqrt(DEFAULT_HEIGHT_WIDTH_RATIO)
    );
    const targetHeight = Math.round(
        (image.height * ratio) / Math.sqrt(DEFAULT_HEIGHT_WIDTH_RATIO)
    );

    const target = createCanvas(targetWidth, targetHeight);
    const ctx = target.getContext('2d')!;
    ctx.drawImage(image, 0, 0, target.width, target.height);
    return { canvas: target, ctx: ctx as CanvasRenderingContext2D };
}

export async function drawCode(
    code: string,
    imageFileUri: string,
    mode: ModeType,
    cutoff: number,
    invert: boolean
): Promise<string> {
    return drawCodeCommon(code, imageFileUri, mode, cutoff, invert, loadImageToCanvas);
}
