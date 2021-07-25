import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';

describe('generator tests', () => {
    const expectCodeEval = async (code: string) => {
        const expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        const resultCode = gen.generate().code;
        const result = eval(resultCode);
        expect(await result).toEqual(await expected);
    };

    it('parses hello', async () => {
        await expectCodeEval(
            `
function hello() {
    return 1 + 1; // a comment
}
hello(); `
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

    it('parses multi line string', async () => {
        await expectCodeEval(`
function hello() {
    return \`
    x
    y
    z
    \`
}
hello();
        `);
    });

    it('parses anonymous fn', async () => {
        await expectCodeEval(`
const h = async () => {
    await (async (n) => n + 1)(2)
}
h();
        `);
    });
});
