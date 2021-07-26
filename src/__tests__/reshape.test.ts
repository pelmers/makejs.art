import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';
import { parseTokens, reshape } from '../reshape';
import { TEST_CASES } from './testCases';

describe('reshape tests', () => {
    const expectCodeEval = async (code: string) => {
        let expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        const genCode = gen.generate().code;
        const genTokens = parseTokens(genCode);
        // target width of 0 forces as many line breaks as possible
        const resultCode1 = reshape(genTokens, () => 0);
        const result1 = eval(resultCode1);
        expect(await result1).toEqual(await expected);
        // target width of infinite forces everything to one line
        const resultCode2 = reshape(genTokens, () => Number.MAX_SAFE_INTEGER);
        const result2 = eval(resultCode2);
        expect(await result2).toEqual(await expected);
    };

    for (const test of TEST_CASES) {
        it(test.name, async () => {
            await expectCodeEval(test.code);
        });
    }
});
