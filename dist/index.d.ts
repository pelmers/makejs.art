import * as webpack from 'webpack';
export { reshape, minCodeSize, parseTokens } from './reshape';
export { WhitespaceMarkerGenerator } from './generator';
declare type OptionsType = {
    imagePath?: string;
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
};
export declare class MakeJsArtWebpackPlugin {
    private options;
    constructor(options?: OptionsType);
    apply(compiler: webpack.Compiler): void;
}
