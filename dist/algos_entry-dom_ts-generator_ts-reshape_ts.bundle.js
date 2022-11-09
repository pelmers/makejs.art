(self["webpackChunk"] = self["webpackChunk"] || []).push([["algos_entry-dom_ts-generator_ts-reshape_ts"],{

/***/ "./algos/entry-dom.ts":
/*!****************************!*\
  !*** ./algos/entry-dom.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "drawCode": () => (/* binding */ drawCode)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./constants.ts");
/* harmony import */ var _drawCode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drawCode */ "./algos/drawCode.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const pica = __webpack_require__.e(/*! import() */ "vendors-node_modules_pica_dist_pica_js").then(__webpack_require__.t.bind(__webpack_require__, /*! pica */ "../node_modules/pica/dist/pica.js", 23));
// Load the given image uri to an invisible canvas and return the canvas and its 2d context
// Also resize the picture to make its pixel count as close to targetSize as possible
function loadImageToCanvas(imageFileUri, targetSize) {
    return __awaiter(this, void 0, void 0, function* () {
        // First load the image onto an invisible canvas
        const source = document.createElement('canvas');
        const ctx = source.getContext('2d');
        yield new Promise((resolve, reject) => {
            const handler = () => {
                source.width = Math.floor(image.width);
                source.height = Math.floor(image.height);
                ctx.drawImage(image, 0, 0, source.width, source.height);
                resolve();
            };
            const image = new Image();
            image.onload = handler;
            image.onerror = reject;
            image.src = imageFileUri;
        });
        const target = document.createElement('canvas');
        // Find the ratio to get from source dimensions to target size
        // math check: e.g. target = 16, s.w = s.h = 2, then ratio = 2 as expected
        const ratio = Math.sqrt(targetSize / (source.width * source.height));
        target.width = Math.round(source.width * ratio * Math.sqrt(_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HEIGHT_WIDTH_RATIO));
        target.height = Math.round((source.height * ratio) / Math.sqrt(_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HEIGHT_WIDTH_RATIO));
        const resizer = (yield pica).default();
        yield resizer.resize(source, target);
        return { canvas: target, ctx: target.getContext('2d') };
    });
}
function drawCode(code, imageFileUri, mode, cutoff, invert) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0,_drawCode__WEBPACK_IMPORTED_MODULE_1__.drawCodeCommon)(code, imageFileUri, mode, cutoff, invert, loadImageToCanvas);
    });
}
// improvement idea: https://dahtah.github.io/imager/foreground_background.html#k-nearest-neighbour-approach


/***/ }),

/***/ "./generator.ts":
/*!**********************!*\
  !*** ./generator.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WhitespaceMarkerGenerator": () => (/* binding */ WhitespaceMarkerGenerator)
/* harmony export */ });
/* harmony import */ var _babel_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/generator */ "../node_modules/@babel/generator/lib/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./constants.ts");


/**
 * This class generates runnable JS code where replaceable whitespace is
 * annotated with special comments
 */
class WhitespaceMarkerGenerator extends _babel_generator__WEBPACK_IMPORTED_MODULE_0__.CodeGenerator {
    constructor(ast) {
        // Concise replace newlines with spaces, which will let us insert more whitespace markers.
        super(ast, { compact: true, comments: false });
    }
    generate() {
        // @ts-ignore directly accessing the library's code, see https://git.io/J8Xf9
        const g = this._generator;
        const oldWord = g.word.bind(g);
        g.word = (w) => {
            oldWord(w);
            if ([
                'return',
                'break',
                'continue',
                'async',
                'throw',
                'yield',
                'await',
            ].includes(w)) {
                g._unbreakableSpace();
            }
        };
        const oldUnaryExpression = g.UnaryExpression.bind(g);
        g.UnaryExpression = (node) => {
            if ('operator' in node &&
                (node.operator === '+' || node.operator === '-')) {
                // Require a space before unary exp because the last symbol could have been a postfix op
                g._space();
            }
            oldUnaryExpression(node);
        };
        const oldUpdateExpression = g.UpdateExpression.bind(g);
        g.UpdateExpression = (node) => {
            let isPostfix = false;
            if ('prefix' in node && node.prefix) {
                g._space();
            }
            else {
                isPostfix = true;
            }
            oldUpdateExpression(node);
            if (isPostfix) {
                g._space();
            }
        };
        g.space = (force = false) => {
            if ((g._buf.hasContent() && !g.endsWith(' ') && !g.endsWith('\n')) ||
                force) {
                g._space();
            }
            else {
                g._optionalSpace();
            }
        };
        g._space = () => {
            // This marks a location we can have 1 or more spaces or newline
            g._append(_constants__WEBPACK_IMPORTED_MODULE_1__.SPACE_MARKER, true /* queue */);
        };
        g._optionalSpace = () => {
            // This marks a location that can have 0 or more spaces or newline
            g._append(_constants__WEBPACK_IMPORTED_MODULE_1__.OPTIONAL_SPACE_MARKER, true /* queue */);
        };
        g._unbreakableSpace = () => {
            // This marks a location that must have a space and NOT a newline
            g._append(_constants__WEBPACK_IMPORTED_MODULE_1__.UNBREAKABLE_SPACE_MARKER, true /* queue */);
        };
        const oldToken = g.token.bind(g);
        g.token = (str) => {
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


/***/ }),

/***/ "./reshape.ts":
/*!********************!*\
  !*** ./reshape.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "minCodeSize": () => (/* binding */ minCodeSize),
/* harmony export */   "parseTokens": () => (/* binding */ parseTokens),
/* harmony export */   "reshape": () => (/* binding */ reshape)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./constants.ts");

const MAX_LINE_WIDTH = Number.MAX_SAFE_INTEGER;
// Compute the minimum length of the code by replacing all spaces
// with a single space and optional spaces with no space.
function minCodeSize(tokens) {
    return tokens.map(toStr).reduce((prev, cur) => prev + cur.length, 0);
}
function minWidth(t) {
    if ('text' in t) {
        return t.text.length;
    }
    else if (t.space === 'opt') {
        return 0;
    }
    return 1;
}
function toStr(t) {
    if ('text' in t) {
        return t.text;
    }
    else if (t.space === 'opt') {
        return '';
    }
    return ' ';
}
function isUbn(t) {
    return 'space' in t && t.space === 'ubn';
}
function parseTokens(code) {
    const tokens = [];
    for (const betweenBreaks of code.split(_constants__WEBPACK_IMPORTED_MODULE_0__.UNBREAKABLE_SPACE_MARKER)) {
        const betweenSpaces = betweenBreaks.split(_constants__WEBPACK_IMPORTED_MODULE_0__.SPACE_MARKER);
        for (const sp of betweenSpaces) {
            const texts = sp.split(_constants__WEBPACK_IMPORTED_MODULE_0__.OPTIONAL_SPACE_MARKER);
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
function collapseTokens(tokens) {
    const stronger = (a, b) => {
        if ('space' in a && 'space' in b) {
            if (a.space === 'ubn' || b.space === 'ubn') {
                return 'ubn';
            }
            else if (a.space === 'req' || b.space === 'req') {
                return 'req';
            }
            else {
                return 'opt';
            }
        }
        throw new Error('unreachable statement');
    };
    const reducedTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        const lastToken = reducedTokens[reducedTokens.length - 1];
        const curToken = tokens[i];
        if ('text' in curToken && curToken.text === '') {
            continue;
        }
        if (lastToken == null) {
            reducedTokens.push(curToken);
        }
        else if ('space' in lastToken && 'space' in curToken) {
            lastToken.space = stronger(lastToken, curToken);
        }
        else {
            reducedTokens.push(curToken);
        }
    }
    return reducedTokens;
}
function reshape(tokens, shapeFunction) {
    // Enforce a maximum on the line width, even if we get infinity or something from the fn
    const shapeFn = (row) => Math.min(MAX_LINE_WIDTH, shapeFunction(row));
    // First split the code into tokens that we can join together
    const lines = [[]];
    let currentLineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const currentLineIndex = lines.length - 1;
        const targetWidth = shapeFn(currentLineIndex);
        // If the space is unbreakable or it's a token, we must continue this line
        if (currentLineWidth === 0 || isUbn(t) || 'text' in t) {
            lines[currentLineIndex].push(t);
            currentLineWidth += minWidth(t);
        }
        else {
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
            }
            else {
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


/***/ })

}]);
//# sourceMappingURL=algos_entry-dom_ts-generator_ts-reshape_ts.bundle.js.map