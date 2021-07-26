import { minCodeSize, parseTokens, reshape } from '../reshape';

const heightWidthRatio = 1.7;

export function square(code: string): string {
    const tokens = parseTokens(code);
    const codeSize = minCodeSize(tokens);
    const sideLength = heightWidthRatio * Math.sqrt(codeSize);
    return reshape(tokens, () =>sideLength);
}
