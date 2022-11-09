import * as webpack from 'webpack';
import { DEFAULT_CUTOFF_THRESHOLD } from './constants';

export { reshape, minCodeSize, parseTokens } from './reshape';
export { WhitespaceMarkerGenerator } from './generator';

type OptionsInputType = {
    imagePath: string;
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
};

type OptionsType = {
    imagePath: string;
    cutoff: number;
    mode: 'intensity' | 'saliency';
    invert: boolean;
};

export async function makeJsArt(
    code: string,
    options: OptionsInputType
): Promise<string> {
    const { cutoff, mode, invert, imagePath } = {
        cutoff: options.cutoff || DEFAULT_CUTOFF_THRESHOLD,
        mode: options.mode || 'intensity',
        invert: options.invert || false,
        ...options,
    };
    const { drawCode } = await import('./algos/entry-node');
    return drawCode(code, imagePath, mode, cutoff, invert);
}

export class MakeJsArtWebpackPlugin {
    constructor(private options: OptionsInputType) {}
    // ISSUE: the reshape uses canvas

    apply(compiler: webpack.Compiler) {
        compiler.hooks.assetEmitted.tapAsync(
            'MakeJsArtWebpackPlugin',
            async (file, info, callback) => {
                const { content, source, outputPath } = info;
                console.log(file, source, outputPath);
                if (this.options.imagePath) {
                    const code = await makeJsArt(content.toString(), this.options);
                    console.log(code);
                }
                callback();
            }
        );
    }
}
