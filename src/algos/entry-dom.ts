import { DEFAULT_HEIGHT_WIDTH_RATIO, ModeType } from '../constants';
import { drawCodeCommon } from './drawCode';

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
    console.time('code shaping');
    const result = await drawCodeCommon(
        code,
        imageFileUri,
        mode,
        cutoff,
        invert,
        loadImageToCanvas
    );
    console.timeEnd('code shaping');
    return result;
}

// improvement idea: https://dahtah.github.io/imager/foreground_background.html#k-nearest-neighbour-approach
