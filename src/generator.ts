import { CodeGenerator } from '@babel/generator';
import { Node } from '@babel/types';
import {
    SPACE_MARKER,
    OPTIONAL_SPACE_MARKER,
    UNBREAKABLE_SPACE_MARKER,
} from './constants';

/**
 * This class generates runnable JS code where replaceable whitespace is
 * annotated with special comments
 */
export class WhitespaceMarkerGenerator extends CodeGenerator {
    constructor(ast: Node) {
        // Concise replace newlines with spaces, which will let us insert more whitespace markers.
        super(ast, { compact: true, comments: false });
        // TODO not sure whether compact or concise is better
    }

    generate() {
        // @ts-ignore directly accessing the library's code, see https://git.io/J8Xf9
        const g = this._generator;
        const oldWord = g.word.bind(g);
        g.word = (w: string) => {
            oldWord(w);
            if (
                [
                    'return',
                    'break',
                    'continue',
                    'async',
                    'throw',
                    'yield',
                    'await',
                ].includes(w)
            ) {
                g._unbreakableSpace();
            }
        };
        const oldUnaryExpression = g.UnaryExpression.bind(g);
        g.UnaryExpression = (node: Node) => {
            if (
                'operator' in node &&
                (node.operator === '+' || node.operator === '-')
            ) {
                // Require a space before unary exp because the last symbol could have been a postfix op
                g._space();
            }
            oldUnaryExpression(node);
        };
        const oldUpdateExpression = g.UpdateExpression.bind(g);
        g.UpdateExpression = (node: Node) => {
            let isPostfix = false;
            if ('prefix' in node && node.prefix) {
                g._space();
            } else {
                isPostfix = true;
            }
            oldUpdateExpression(node);
            if (isPostfix) {
                g._space();
            }
        };
        g.space = (force: boolean = false) => {
            if (
                (g._buf.hasContent() && !g.endsWith(' ') && !g.endsWith('\n')) ||
                force
            ) {
                g._space();
            } else {
                g._optionalSpace();
            }
        };
        g._space = () => {
            // This marks a location we can have 1 or more spaces or newline
            g._append(SPACE_MARKER, true /* queue */);
        };
        g._optionalSpace = () => {
            // This marks a location that can have 0 or more spaces or newline
            g._append(OPTIONAL_SPACE_MARKER, true /* queue */);
        };
        g._unbreakableSpace = () => {
            // This marks a location that must have a space and NOT a newline
            g._append(UNBREAKABLE_SPACE_MARKER, true /* queue */);
        };
        const oldToken = g.token.bind(g);
        g.token = (str: string) => {
            if (str === '=>') {
                g._unbreakableSpace();
            }
            oldToken(str);
            // instead of smushing tokens together, mark the in-between as allowing spaces
            g._optionalSpace();
        };
        return super.generate();
    }
}
// TODO also deal with typescript(?)
