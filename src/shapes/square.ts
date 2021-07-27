import { DEFAULT_HEIGHT_WIDTH_RATIO } from '../constants';
import { minCodeSize, parseTokens, reshape } from '../reshape';

// TODO: probably makes sense to have ratio as an optional input param
export function square(code: string): string {
    const tokens = parseTokens(code);
    const codeSize = minCodeSize(tokens);
    const sideLength = DEFAULT_HEIGHT_WIDTH_RATIO * Math.sqrt(codeSize);
    return reshape(tokens, () =>sideLength);
}
