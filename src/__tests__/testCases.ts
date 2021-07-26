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
];

describe('test cases', () => {
    it('has an empty test', () => {
        expect(TEST_CASES).toHaveLength(TEST_CASES.length);
    });
});
