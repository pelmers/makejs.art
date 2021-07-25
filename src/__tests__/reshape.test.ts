import { parse } from '@babel/parser';
import { WhitespaceMarkerGenerator } from '../generator';
import { reshape } from '../reshape';

describe('reshape tests', () => {
    const expectCodeEval = (code: string) => {
        const expected = eval(code);
        const gen = new WhitespaceMarkerGenerator(parse(code));
        // target width of 0 forces as many line breaks as possible
        const resultCode = reshape(gen.generate().code, () => 0);
        const result = eval(resultCode);
        expect(result).toEqual(expected);
    };

    it('parses hello', () => {
        expectCodeEval(
            `
function hello() {
    return 1 + 1; // a comment
}
hello(); `
        );
    });

    it('parses regex', () => {
        expectCodeEval(` '123'.replace(/123/gi, '456'); `);
    });

    it('parses async await', () => {
        expectCodeEval(`
async function hello() {
    return await (1 + 1).toString();
}
hello();
        `);
    });
});
