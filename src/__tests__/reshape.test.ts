import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';
import { reshape } from '../reshape';

describe('reshape tests', () => {
    const expectCodeEval = async (code: string) => {
        let expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        const genCode = gen.generate().code;
        // target width of 0 forces as many line breaks as possible
        const resultCode1 = reshape(genCode, () => 0);
        console.log(resultCode1);
        const result1 = eval(resultCode1);
        expect(await result1).toEqual(await expected);
        // target width of infinite forces everything to one line
        const resultCode2 = reshape(genCode, () => Number.MAX_SAFE_INTEGER);
        console.log(resultCode2);
        const result2 = eval(resultCode2);
        expect(await result2).toEqual(await expected);
    };

    it('parses hello', async () => {
        await expectCodeEval(
            `
function hello() {
    return 1 + 1; // a comment
}
hello();
`
        );
    });

    it('parses regex', async () => {
        await expectCodeEval(` '123'.replace(/123/gi, '456'); `);
    });

    it('parses async await', async () => {
        await expectCodeEval(`
async function hello() {
    return await (1 + 1).toString();
}
hello();
        `);
    });

    it('parses anonymous fn', async () => {
        await expectCodeEval(`
h = async () => await (async n => n + 1)(2)
h();
        `);
    });
});
