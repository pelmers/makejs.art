import * as webpack from 'webpack';
import { DEFAULT_CUTOFF_THRESHOLD } from './algos/common';

export { reshape, minCodeSize, parseTokens } from './reshape';
export { WhitespaceMarkerGenerator } from './generator';

type OptionsType = {
    imagePath?: string;
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
};

export class MakeJsArtWebpackPlugin {
    constructor(private options: OptionsType = {}) {
        this.options.cutoff = options.cutoff || DEFAULT_CUTOFF_THRESHOLD;
        this.options.mode = options.mode || 'intensity';
        this.options.invert = options.invert || false;

        const algoModule = import('./algos/entry-node');
    }
    // ISSUE: the reshape uses canvas

    apply(compiler: webpack.Compiler) {
        compiler.hooks.emit.tapAsync(
            'MakeJsArtWebpackPlugin',
            (compilation, callback) => {
                const { assets } = compilation;
                callback();
            }
        );
    }
}
