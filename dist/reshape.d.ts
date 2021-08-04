export declare function minCodeSize(tokens: TokenType[]): number;
declare type SpaceType = 'opt' | 'req' | 'ubn';
declare type TokenType = {
    space: SpaceType;
} | {
    text: string;
};
export declare function parseTokens(code: string): TokenType[];
export declare function reshape(tokens: TokenType[], shapeFunction: (row: number) => number): string[];
export {};
