/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _big = __webpack_require__(3);

var _big2 = _interopRequireDefault(_big);

var _small = __webpack_require__(4);

var _small2 = _interopRequireDefault(_small);

__webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smallImage = document.createElement('img');
smallImage.src = _small2.default;
document.body.appendChild(smallImage);

var bigImage = document.createElement('img');
bigImage.src = _big2.default;
document.body.appendChild(bigImage);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var sum = function sum(a, b) {
  return a + b;
};

exports.default = sum;

/***/ },
/* 2 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "af139cfa010e6ec24b9606c31e699cd9.jpg";

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _sum = __webpack_require__(1);

var _sum2 = _interopRequireDefault(_sum);

__webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var total = (0, _sum2.default)(10, 5);
console.log(total);

/***/ }
/******/ ]);