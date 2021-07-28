import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../../generator';
import { TEST_CASES } from '../../__tests__/testCases';
import { square } from '../square';

describe('square reshape tests', () => {
    const expectCodeEval = async (code: string) => {
        let expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        const genCode = gen.generate().code;
        const resultCode1 = square(genCode);
        const result1 = eval(resultCode1);
        expect(await result1).toEqual(await expected);
    };

    for (const test of TEST_CASES) {
        it(test.name, async () => {
            await expectCodeEval(test.code);
        });
    }
});
