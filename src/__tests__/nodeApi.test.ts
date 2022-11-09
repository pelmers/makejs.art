import { makeJsArt } from '..';
import { TEST_CASES } from './testCases';

import path from 'path';

const r = (relative: string) =>
    path.resolve(path.resolve(__filename, '../../../'), relative);

describe('node api test', () => {
    const expectCodeEval = async (code: string) => {
        let expected = eval(code);
        const transformedCode = await makeJsArt(code, {
            imagePath: r('src/__tests__/testlogo.png'),
            cutoff: 0.4,
            invert: true,
            mode: 'intensity',
        });
        const result = eval(transformedCode);
        expect(await result).toEqual(await expected);
    };

    for (const test of TEST_CASES) {
        it(test.name, async () => {
            await expectCodeEval(test.code);
        });
    }
});
