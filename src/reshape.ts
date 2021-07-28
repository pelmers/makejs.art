import {
    OPTIONAL_SPACE_MARKER,
    SPACE_MARKER,
    UNBREAKABLE_SPACE_MARKER,
} from './constants';

const MAX_LINE_WIDTH = Number.MAX_SAFE_INTEGER;

// Compute the minimum length of the code by replacing all spaces
// with a single space and optional spaces with no space.
export function minCodeSize(tokens: TokenType[]): number {
    return tokens.map(toStr).reduce((prev, cur) => prev + cur.length, 0);
}

type SpaceType = 'opt' | 'req' | 'ubn';
type TokenType =
    | {
          space: SpaceType;
      }
    | {
          text: string;
      };

function minWidth(t: TokenType): number {
    if ('text' in t) {
        return t.text.length;
    } else if (t.space === 'opt') {
        return 0;
    }
    return 1;
}

function toStr(t: TokenType): string {
    if ('text' in t) {
        return t.text;
    } else if (t.space === 'opt') {
        return '';
    }
    return ' ';
}

function isUbn(t: TokenType): boolean {
    return 'space' in t && t.space === 'ubn';
}

export function parseTokens(code: string) {
    const tokens: TokenType[] = [];
    for (const betweenBreaks of code.split(UNBREAKABLE_SPACE_MARKER)) {
        const betweenSpaces = betweenBreaks.split(SPACE_MARKER);
        for (const sp of betweenSpaces) {
            const texts = sp.split(OPTIONAL_SPACE_MARKER);
            for (const text of texts) {
                tokens.push({ text });
                tokens.push({ space: 'opt' });
            }
            tokens.push({ space: 'req' });
        }
        tokens.push({ space: 'ubn' });
    }
    return collapseTokens(tokens);
}

// Fold consecutive spaces to the strongest version
// i.e. if I have opt - unbreakable - req - opt, then reduce them to one unbreakable
// Also remove 'text' tokens with empty content and joins together consecutive 'text' nodes
// At the end of this, the whole program should consist of alternating text-space tokens
function collapseTokens(tokens: TokenType[]) {
    const stronger = (a: TokenType, b: TokenType): SpaceType => {
        if ('space' in a && 'space' in b) {
            if (a.space === 'ubn' || b.space === 'ubn') {
                return 'ubn';
            } else if (a.space === 'req' || b.space === 'req') {
                return 'req';
            } else {
                return 'opt';
            }
        }
        throw new Error('unreachable statement');
    };
    const reducedTokens: TokenType[] = [];
    for (let i = 0; i < tokens.length; i++) {
        const lastToken = reducedTokens[reducedTokens.length - 1];
        const curToken = tokens[i];
        if ('text' in curToken && curToken.text === '') {
            continue;
        }
        if (lastToken == null) {
            reducedTokens.push(curToken);
        } else if ('space' in lastToken && 'space' in curToken) {
            lastToken.space = stronger(lastToken, curToken);
        } else {
            reducedTokens.push(curToken);
        }
    }
    return reducedTokens;
}

export function reshape(
    tokens: TokenType[],
    shapeFunction: (row: number) => number
): string[] {
    // Enforce a maximum on the line width, even if we get infinity or something from the fn
    const shapeFn = (row: number) => Math.min(MAX_LINE_WIDTH, shapeFunction(row));
    // First split the code into tokens that we can join together
    const lines: TokenType[][] = [[]];
    let currentLineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const currentLineIndex = lines.length - 1;
        const targetWidth = shapeFn(currentLineIndex);
        // If the space is unbreakable or it's a token, we must continue this line
        if (currentLineWidth === 0 || isUbn(t) || 'text' in t) {
            lines[currentLineIndex].push(t);
            currentLineWidth += minWidth(t);
        } else {
            // Otherwise, we're on a (required or optional) space and could break now
            // to decide, we will look ahead to see if the next potential breakpoint
            // would exceed our line's target width
            let nextBreakpoint = 0;
            for (let j = i + 1; j < tokens.length; j++) {
                if ('space' in tokens[j] && !isUbn(tokens[j])) {
                    break;
                }
                nextBreakpoint += minWidth(tokens[j]);
            }
            if (currentLineWidth + nextBreakpoint <= targetWidth) {
                // 明天的烦恼交给明天 (https://youtu.be/8Q5HWGgT1M0)
                lines[currentLineIndex].push(t);
                currentLineWidth += minWidth(t);
            } else {
                // start a new line since the next break point would exceed the target
                // Note: if this token is a required space, it becomes optional now
                lines.push([{ space: 'opt' }]);
                currentLineWidth = 0;
            }
        }
    }
    // This portion inserts whitespaces to justify each line to its target width
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (shapeFn(i) === MAX_LINE_WIDTH) {
            // in this case we're putting everything on this line anyway,
            // don't need to justify 2^53 times (probly not a good idea)
            continue;
        }
        // target value - current size, i.e. number of spaces we want to add
        let difference = Math.round(shapeFn(i) - minCodeSize(line));
        // find indices in the line that are spaces
        const spaceIndices = line
            // (except last position because spaces at the end of a line aren't visible)
            .slice(0, line.length - 1)
            .map((t, idx) => ({ t, idx }))
            .filter(({ t }) => 'space' in t)
            .map(({ idx }) => idx);
        // of course we can't enter the loop unless there are spaces on this line
        while (spaceIndices.length > 0 && difference > 0) {
            const idx = spaceIndices[Math.floor(spaceIndices.length * Math.random())];
            // We've found the index to add space to, we can convert it to text because
            // we no longer need to know that it was a space
            line[idx] = { text: `${toStr(line[idx])} ` };
            difference--;
        }
    }
    return lines.map((line) => line.map(toStr).join(''));
}
