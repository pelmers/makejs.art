import {
    OPTIONAL_SPACE_MARKER,
    SPACE_MARKER,
    UNBREAKABLE_SPACE_MARKER,
} from './constants';

// note a typical font's width:height is about 1:2

// Compute the minimum length of the code by replacing all spaces
// with a single space and optional spaces with no space.
function minCodeSize(code: string): number {
    const spaces = new RegExp(SPACE_MARKER, 'g');
    const optSpaces = new RegExp(OPTIONAL_SPACE_MARKER, 'g');
    const nSpaces = (code.match(spaces) || []).length;
    const nOptSpaces = (code.match(optSpaces) || []).length;
    return (
        code.length -
        nOptSpaces * OPTIONAL_SPACE_MARKER.length -
        nSpaces * (SPACE_MARKER.length - 1)
    );
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
        return 1;
    }
    return 0;
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

// TODO obvious bug, can't put new line after 'return' because of implicit semicolons

function parseTokens(code: string) {
    const tokens: TokenType[] = [];
    // TODO this shit's broken
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
    console.log(JSON.stringify(tokens));
    return tokens;
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
    console.log(JSON.stringify(reducedTokens));
    return reducedTokens;
}

export function reshape(code: string, shapeFunction: (row: number) => number): string {
    // First split the code into tokens that we can join together
    const tokens = collapseTokens(parseTokens(code));
    const lines: TokenType[][] = [[]];
    let currentLineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const currentLineIndex = lines.length - 1;
        const targetWidth = shapeFunction(currentLineIndex);
        // If the space is unbreakable or it's a token, we must continue this line
        if (currentLineWidth === 0 || isUbn(t) || 'text' in t) {
            lines[currentLineIndex].push(t);
            currentLineWidth += minWidth(t);
        } else {
            // Otherwise, we're on a space and could break now
            // to decide, we will look ahead to see if the next potential breakpoint
            // would exceed our line's target width
            let nextBreakpoint = 0;
            for (let j = i + 1; j < tokens.length; j++) {
                if ('space' in tokens[j]) {
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
    return lines.map((line) => line.map(toStr).join('')).join('\n');
}
