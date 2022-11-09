(self["webpackChunk"] = self["webpackChunk"] || []).push([["algos_common_ts-algos_entry-node_ts"],{

/***/ "../node_modules/node-canvas/browser.js":
/*!**********************************************!*\
  !*** ../node_modules/node-canvas/browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* globals document, ImageData */

const parseFont = __webpack_require__(/*! ./lib/parse-font */ "../node_modules/node-canvas/lib/parse-font.js")

exports.parseFont = parseFont

exports.createCanvas = function (width, height) {
  return Object.assign(document.createElement('canvas'), { width: width, height: height })
}

exports.createImageData = function (array, width, height) {
  // Browser implementation of ImageData looks at the number of arguments passed
  switch (arguments.length) {
    case 0: return new ImageData()
    case 1: return new ImageData(array)
    case 2: return new ImageData(array, width)
    default: return new ImageData(array, width, height)
  }
}

exports.loadImage = function (src, options) {
  return new Promise(function (resolve, reject) {
    const image = Object.assign(document.createElement('img'), options)

    function cleanup () {
      image.onload = null
      image.onerror = null
    }

    image.onload = function () { cleanup(); resolve(image) }
    image.onerror = function () { cleanup(); reject(new Error('Failed to load the image "' + src + '"')) }

    image.src = src
  })
}


/***/ }),

/***/ "../node_modules/node-canvas/lib/parse-font.js":
/*!*****************************************************!*\
  !*** ../node_modules/node-canvas/lib/parse-font.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Font RegExp helpers.
 */

const weights = 'bold|bolder|lighter|[1-9]00'
const styles = 'italic|oblique'
const variants = 'small-caps'
const stretches = 'ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded'
const units = 'px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q'
const string = '\'([^\']+)\'|"([^"]+)"|[\\w\\s-]+'

// [ [ <‘font-style’> || <font-variant-css21> || <‘font-weight’> || <‘font-stretch’> ]?
//    <‘font-size’> [ / <‘line-height’> ]? <‘font-family’> ]
// https://drafts.csswg.org/css-fonts-3/#font-prop
const weightRe = new RegExp(`(${weights}) +`, 'i')
const styleRe = new RegExp(`(${styles}) +`, 'i')
const variantRe = new RegExp(`(${variants}) +`, 'i')
const stretchRe = new RegExp(`(${stretches}) +`, 'i')
const sizeFamilyRe = new RegExp(
  `([\\d\\.]+)(${units}) *((?:${string})( *, *(?:${string}))*)`)

/**
 * Cache font parsing.
 */

const cache = {}

const defaultHeight = 16 // pt, common browser default

/**
 * Parse font `str`.
 *
 * @param {String} str
 * @return {Object} Parsed font. `size` is in device units. `unit` is the unit
 *   appearing in the input string.
 * @api private
 */

module.exports = str => {
  // Cached
  if (cache[str]) return cache[str]

  // Try for required properties first.
  const sizeFamily = sizeFamilyRe.exec(str)
  if (!sizeFamily) return // invalid

  // Default values and required properties
  const font = {
    weight: 'normal',
    style: 'normal',
    stretch: 'normal',
    variant: 'normal',
    size: parseFloat(sizeFamily[1]),
    unit: sizeFamily[2],
    family: sizeFamily[3].replace(/["']/g, '').replace(/ *, */g, ',')
  }

  // Optional, unordered properties.
  let weight, style, variant, stretch
  // Stop search at `sizeFamily.index`
  const substr = str.substring(0, sizeFamily.index)
  if ((weight = weightRe.exec(substr))) font.weight = weight[1]
  if ((style = styleRe.exec(substr))) font.style = style[1]
  if ((variant = variantRe.exec(substr))) font.variant = variant[1]
  if ((stretch = stretchRe.exec(substr))) font.stretch = stretch[1]

  // Convert to device units. (`font.unit` is the original unit)
  // TODO: ch, ex
  switch (font.unit) {
    case 'pt':
      font.size /= 0.75
      break
    case 'pc':
      font.size *= 16
      break
    case 'in':
      font.size *= 96
      break
    case 'cm':
      font.size *= 96.0 / 2.54
      break
    case 'mm':
      font.size *= 96.0 / 25.4
      break
    case '%':
      // TODO disabled because existing unit tests assume 100
      // font.size *= defaultHeight / 100 / 0.75
      break
    case 'em':
    case 'rem':
      font.size *= defaultHeight / 0.75
      break
    case 'q':
      font.size *= 96 / 25.4 / 4
      break
  }

  return (cache[str] = font)
}


/***/ }),

/***/ "./algos/common.ts":
/*!*************************!*\
  !*** ./algos/common.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "modeDescription": () => (/* binding */ modeDescription),
/* harmony export */   "extractRunsByCutoff": () => (/* binding */ extractRunsByCutoff)
/* harmony export */ });
function modeDescription(mode) {
    return {
        intensity: 'Intensity (faster)',
        saliency: 'Saliency (slower)',
    }[mode];
}
function extractRunsByCutoff(width, height, passesCutoff) {
    // compute 'runs' of pixels > cutoff in the image rows to use as line widths
    const runs = [];
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const i = row * width + col;
            if (passesCutoff(row, col)) {
                // Decide whether we're still on the last run, or make a new one
                if (runs.length > 0 &&
                    col > 0 &&
                    runs[runs.length - 1][runs[runs.length - 1].length - 1] === i - 1) {
                    runs[runs.length - 1].push(i);
                }
                else {
                    runs.push([i]);
                }
            }
        }
    }
    return runs;
}


/***/ }),

/***/ "./algos/entry-node.ts":
/*!*****************************!*\
  !*** ./algos/entry-node.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "drawCode": () => (/* binding */ drawCode)
/* harmony export */ });
/* harmony import */ var node_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-canvas */ "../node_modules/node-canvas/browser.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./constants.ts");
/* harmony import */ var _drawCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drawCode */ "./algos/drawCode.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function loadImageToCanvas(imageFilePath, targetSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0,node_canvas__WEBPACK_IMPORTED_MODULE_0__.loadImage)(imageFilePath);
        // Find the ratio to get from source dimensions to target size
        // math check: e.g. target = 16, s.w = s.h = 2, then ratio = 2 as expected
        const ratio = Math.sqrt(targetSize / (image.width * image.height));
        const targetWidth = Math.round(image.width * ratio * Math.sqrt(_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_HEIGHT_WIDTH_RATIO));
        const targetHeight = Math.round((image.height * ratio) / Math.sqrt(_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_HEIGHT_WIDTH_RATIO));
        const target = (0,node_canvas__WEBPACK_IMPORTED_MODULE_0__.createCanvas)(targetWidth, targetHeight);
        const ctx = target.getContext('2d');
        ctx.drawImage(image, 0, 0, target.width, target.height);
        return { canvas: target, ctx: ctx };
    });
}
function drawCode(code, imageFileUri, mode, cutoff, invert) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0,_drawCode__WEBPACK_IMPORTED_MODULE_2__.drawCodeCommon)(code, imageFileUri, mode, cutoff, invert, loadImageToCanvas);
    });
}


/***/ })

}]);
//# sourceMappingURL=algos_common_ts-algos_entry-node_ts.bundle.js.map