/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SPACE_MARKER": () => (/* binding */ SPACE_MARKER),
/* harmony export */   "OPTIONAL_SPACE_MARKER": () => (/* binding */ OPTIONAL_SPACE_MARKER),
/* harmony export */   "UNBREAKABLE_SPACE_MARKER": () => (/* binding */ UNBREAKABLE_SPACE_MARKER),
/* harmony export */   "DEFAULT_HEIGHT_WIDTH_RATIO": () => (/* binding */ DEFAULT_HEIGHT_WIDTH_RATIO),
/* harmony export */   "DEFAULT_CUTOFF_THRESHOLD": () => (/* binding */ DEFAULT_CUTOFF_THRESHOLD),
/* harmony export */   "INTENSITY_RANGE": () => (/* binding */ INTENSITY_RANGE),
/* harmony export */   "SIZE_BUFFER_RATIO": () => (/* binding */ SIZE_BUFFER_RATIO),
/* harmony export */   "SALIENCY_BUCKETS": () => (/* binding */ SALIENCY_BUCKETS),
/* harmony export */   "MODES": () => (/* binding */ MODES)
/* harmony export */ });
// just some random UUID
const ID = '871dacbf-674c';
const SPACE_MARKER = ` /*${ID}*/ `;
const OPTIONAL_SPACE_MARKER = ` /*opt-${ID}*/ `;
const UNBREAKABLE_SPACE_MARKER = ` /*ubn-${ID}*/ `;
// This constant is a guess at a typical font's ratio of height:width
const DEFAULT_HEIGHT_WIDTH_RATIO = 1.7;
const DEFAULT_CUTOFF_THRESHOLD = 0.3;
// Intensity values are sum of r, g, b at each pixel
const INTENSITY_RANGE = 1 + 255 * 3;
// Resize images to accomodate imperfect fill
const SIZE_BUFFER_RATIO = 0.95;
// 12 is value referenced in Cheng '11
const SALIENCY_BUCKETS = 12;
const MODES = ['intensity', 'saliency'];


/***/ }),

/***/ "./generator.ts":
/*!**********************!*\
  !*** ./generator.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WhitespaceMarkerGenerator": () => (/* binding */ WhitespaceMarkerGenerator)
/* harmony export */ });
/* harmony import */ var _babel_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/generator */ "@babel/generator");
/* harmony import */ var _babel_generator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_generator__WEBPACK_IMPORTED_MODULE_0__);
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


/***/ }),

/***/ "@babel/generator":
/*!***********************************!*\
  !*** external "@babel/generator" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@babel/generator");;

/***/ }),

/***/ "@babel/parser":
/*!********************************!*\
  !*** external "@babel/parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@babel/parser");;

/***/ }),

/***/ "lru-cache":
/*!****************************!*\
  !*** external "lru-cache" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("lru-cache");;

/***/ }),

/***/ "node-canvas":
/*!******************************!*\
  !*** external "node-canvas" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node-canvas");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"index": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reshape": () => (/* reexport safe */ _reshape__WEBPACK_IMPORTED_MODULE_1__.reshape),
/* harmony export */   "minCodeSize": () => (/* reexport safe */ _reshape__WEBPACK_IMPORTED_MODULE_1__.minCodeSize),
/* harmony export */   "parseTokens": () => (/* reexport safe */ _reshape__WEBPACK_IMPORTED_MODULE_1__.parseTokens),
/* harmony export */   "WhitespaceMarkerGenerator": () => (/* reexport safe */ _generator__WEBPACK_IMPORTED_MODULE_2__.WhitespaceMarkerGenerator),
/* harmony export */   "makeJsArt": () => (/* binding */ makeJsArt),
/* harmony export */   "MakeJsArtWebpackPlugin": () => (/* binding */ MakeJsArtWebpackPlugin)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./constants.ts");
/* harmony import */ var _reshape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reshape */ "./reshape.ts");
/* harmony import */ var _generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./generator */ "./generator.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function makeJsArt(code, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cutoff, mode, invert, imagePath } = Object.assign({ cutoff: options.cutoff || _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CUTOFF_THRESHOLD, mode: options.mode || 'intensity', invert: options.invert || false }, options);
        const { drawCode } = yield __webpack_require__.e(/*! import() */ "algos_entry-node_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./algos/entry-node */ "./algos/entry-node.ts"));
        return drawCode(code, imagePath, mode, cutoff, invert);
    });
}
class MakeJsArtWebpackPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.assetEmitted.tapAsync('MakeJsArtWebpackPlugin', (file, info, callback) => __awaiter(this, void 0, void 0, function* () {
            const { content, source, outputPath } = info;
            console.log(file, source, outputPath);
            if (this.options.imagePath) {
                const code = yield makeJsArt(content.toString(), this.options);
                console.log(code);
            }
            callback();
        }));
    }
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map