import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';
import { TEST_CASES } from './testCases';

describe('generator tests', () => {
    const expectCodeEval = async (code: string) => {
        const expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        const resultCode = gen.generate().code;
        const result = eval(resultCode);
        expect(await result).toEqual(await expected);
    };

    for (const test of TEST_CASES) {
        it(test.name, async () => {
            await expectCodeEval(test.code);
        });
    }
});
