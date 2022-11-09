import * as webpack from 'webpack';
export { reshape, minCodeSize, parseTokens } from './reshape';
export { WhitespaceMarkerGenerator } from './generator';
declare type OptionsInputType = {
    imagePath: string;
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
};
export declare function makeJsArt(code: string, options: OptionsInputType): Promise<string>;
export declare class MakeJsArtWebpackPlugin {
    private options;
    constructor(options: OptionsInputType);
    apply(compiler: webpack.Compiler): void;
}
