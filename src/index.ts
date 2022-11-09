import * as webpack from 'webpack';
import { DEFAULT_CUTOFF_THRESHOLD } from './constants';

export { reshape, minCodeSize, parseTokens } from './reshape';
export { WhitespaceMarkerGenerator } from './generator';

type OptionsInputType = {
    imagePath: string;
    ignorePatterns?: string[];
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
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

    apply(compiler: webpack.Compiler) {
        const ignorePatterns = this.options.ignorePatterns || [];

        compiler.hooks.thisCompilation.tap('Replace', (compilation) => {
            compilation.hooks.processAssets.tapAsync(
                {
                    name: 'MakeJsArtWebpackPlugin',
                    stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
                },
                async (assets, callback) => {
                    // example: https://stackoverflow.com/a/65535329
                    for (const ass in assets) {
                        const file = compilation.getAsset(ass)!;
                        const contents = file.source.source();
                        const isIgnored = ignorePatterns.some((pattern) =>
                            file.name.match(pattern)
                        );
                        if (!file.name.endsWith('.js') || isIgnored) {
                            continue;
                        }
                        const transformedCode = await makeJsArt(
                            contents.toString(),
                            this.options
                        );
                        compilation.updateAsset(
                            ass,
                            new webpack.sources.RawSource(transformedCode)
                        );
                    }
                    callback();
                }
            );
        });
    }
}
