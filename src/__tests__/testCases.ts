import fs from 'fs';
import path from 'path';

export const TEST_CASES = [
    {
        name: 'parses hello',
        code: `
function hello() {
    return 1 + 1; // a comment
}
hello();
    `,
    },
    {
        name: 'parses regex',
        code: `'123'.replace(/123/gi, '456');`,
    },
    {
        name: 'parses async await',
        code: `
async function hello() {
    return await (1 + 1).toString();
}
hello();
`,
    },
    {
        name: 'parses anonymous fn',
        code: `
const h = async () => {
    await (async (n) => n + 1)(2)
}
h();
        `,
    },
    {
        name: 'parses string concat',
        code: `
    // wheel of fortune
    let x, y, z, t, n, r, e;
    [t, n, r, e] = [1, 2, 3, 4];
    x = {};
    x+="Q"+ +t+","+ +n+","+(y=+e)+","+(z=+r)
    `,
    },
    {
        name: 'parses binary and prefix postfix operators',
        code: `
        let h = (i) => {
            let x = 3;
            return i + ++x;
        }
        let m = 5;
        h(- --m) + ++m;
        m++ + +null;
        `,
    },
    {
        name: 'parses longer code',
        code:
            'let testfn;' +
            `
testfn = () => {
    return [1, 2, 3, 4, 5, 6];
};
`.repeat(25) +
            'testfn();',
    },
];

const fixturesPath = path.resolve(__dirname, 'fixtures');
const fixtures = fs.readdirSync(fixturesPath);
TEST_CASES.push(
    ...fixtures.map((f) => {
        return {
            name: `parses ${f}`,
            code: fs.readFileSync(path.resolve(fixturesPath, f)).toString(),
        };
    })
);

describe('test cases', () => {
    it('has an empty test', () => {
        expect(TEST_CASES).toHaveLength(TEST_CASES.length);
    });
});
