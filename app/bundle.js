/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


app = angular.module('inventory', ['ngRoute']);

//call page styles
__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(10);

//call angularjs controllers, services
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);

app.config(function($locationProvider, $routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/pages/home/homeView.html',
      controller: 'homeCtrl'
    })
    .when('/bullet-hell', {
      templateUrl: 'app/pages/bulletHell/bulletHellView.html',
      controller: 'bulletHellCtrl'
    })
    .when('/connect-4', {
      templateUrl: 'app/pages/connect4/connect4View.html',
      controller: 'connect4Ctrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./headerStyle.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./headerStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body{\r\n\tbackground-color: #D3DBB2;\r\n}\r\n\r\n/* header */\r\n#header-title{\r\n\tfont-family: \"Arial Black\", Gadget, sans-serif;\r\n\tfont-size: 40px;\r\n\ttext-align: center;\r\n}\r\n\r\n/* menubar */\r\n#header-menu{\r\n\tbackground-color: #ffffff;\r\n\tfont-family: Verdana, Geneva, sans-serif;\r\n\tfont-size: 20px;\r\n\tborder-radius: 10px;\r\n\tpadding-left: 0px;\r\n\r\n\theight: 50px;\r\n\tmargin-bottom: 10px;\r\n}\r\n#header-menu a{\r\n\tcolor: #000000;\r\n}\r\n#header-menu a li{\r\n\tdisplay: inline-block;\r\n\tpadding: 11px 15px 11px 15px;\r\n\ttransition: 0.3s;\r\n}\r\n#header-menu a:hover li{\r\n\tbackground-color: #eeeeee;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./homeStyle.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./homeStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./bulletHellStyle.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./bulletHellStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#bh-screen{\r\n\tbackground-color: #CCC;\r\n\tborder: 1px solid black;\r\n}\r\n\r\n#canvas-container{\r\n\tposition: relative;\r\n\tleft: 0;\r\n\tright: 0;\r\n\tmargin-left: auto;\r\n \tmargin-right: auto;\r\n\tmax-width: 800px;\r\n}\r\n#bh-screen, #bh-player, #bh-enemy{\r\n\tposition: absolute;\r\n}\r\n#bh-start{\r\n\ttext-align: center;\r\n}\r\n#bh-start > input{\r\n\tposition: absolute;\r\n\tmargin-left: -30px;\r\n\tmargin-top: 150px;\r\n\tbackground-color: #AFF;\r\n\tborder: 2px solid #000;\r\n\tborder-radius: 10px;\r\n\tfont-size: 25px;\r\n\r\n\tz-index: 1;\r\n}\r\n#bh-start > input:hover{\r\n\tborder-color: #666;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./connect4Style.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./connect4Style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* rack */\r\n#c4-rack{\r\n  margin: 0 auto;\r\n  width: 580px;\r\n  border: 10px solid #555555;\r\n  font-size: 0;\r\n}\r\n\r\n/* rack columns */\r\n#c4-rack > div{\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n#c4-rack > div:hover{\r\n  opacity: 0.6;\r\n}\r\n\r\n/* gray out columns */\r\n.gray-out{\r\n  opacity: 0.6;\r\n}\r\n\r\n/* rack spaces */\r\n.c4-space{\r\n  display: inline-block;\r\n  background-color: rgb(245,245,0);\r\n  width: 80px;\r\n  height: 80px;\r\n}\r\n.c4-space > div{\r\n  position: relative;\r\n  left: 5px;\r\n  top: 5px;\r\n  width: 70px;\r\n  height: 70px;\r\n  border-radius: 50%;\r\n  z-index: 1;\r\n}\r\n.open > div{\r\n  background-color: #fefefe;\r\n}\r\n\r\n/* token */\r\n.filled-red > div{\r\n  background-color: red;\r\n}\r\n.filled-black > div{\r\n  background-color: #000000;\r\n}\r\n\r\n/* text */\r\n#dialog-box{\r\n  display: inline-block;\r\n  width: 580px;\r\n  padding-bottom: 10px;\r\n  border-left: 10px solid #555555;\r\n  border-bottom: 10px solid #555555;\r\n  border-right: 10px solid #555555;\r\n  background-color: #eeeeee;\r\n}\r\n#dialog-box > div{\r\n  display: none;\r\n}\r\n#token-red{\r\n  background-color: red; color: #ffffff;\r\n  border-radius: 50%;\r\n}\r\n#token-black{\r\n  background-color: black; color: #ffffff;\r\n  border-radius: 50%;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

app.controller('homeCtrl', function($scope, $http){
	$scope.test = "This is the home page";
	$scope.test2 = "dsadasd";
})

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet, BH_enemy, BH_enemyBullet, BH_points){
		let c_BG = $("#bh-screen")[0];
		let c_PL = $("#bh-player")[0];
		let c_EN = $("#bh-enemy")[0];
		let ctx_BG = c_BG.getContext("2d");
		let ctx_PL = c_PL.getContext("2d");
		let ctx_EN = c_EN.getContext("2d");
		let updater;

		// Screen Parameters
		const gameWidth = c_BG.getAttribute('width');
		const gameHeight = c_BG.getAttribute('height');

		// bullets & points
		let plBulletCount = [], enBulletCount = [];
		let enBulletImages = [];
		let points;

		// player/enemy
		let pl, pl_ship, en;

		// player sprite
		function shipAnimate(path,frameT, framesPR, frameW, frameH){
			let image = new Image();
			image.src = path;

			let totalFrames = frameT, framesPerRow = framesPR;
			let currentFrame = 0;
			let frameWidth = frameW;
			let frameHeight = frameH;

			this.draw = function(w, h, x, y){
				currentFrame = (currentFrame + 1) % totalFrames;

				let row = Math.floor(currentFrame / framesPerRow);
				let col = Math.floor(currentFrame % framesPerRow);
				ctx_PL.drawImage(image, col * frameWidth, row * frameHeight, frameWidth, frameHeight, x, y, w, h);
			}
		}
		// player ship image (animated)
		pl_ship = new shipAnimate("assets/images/bullethell/ship_sprites.png", 2, 2, 212, 240);

		// enemy bullet images (more to come)
		enBulletImages.push([new Image(),"assets/images/bullethell/shot1.png"]);
		enBulletImages = enBulletImages.map(function(curr,i){
			curr[0].src = curr[1];
			return curr[0];
		});

		// Init
		$scope.init = function(){
			drawTitleScreen();
		}

		// Game Start
		$scope.startGame = function(){
			$("#bh-start").hide();

			// Create player
			pl = new BH_player.spawnPlayer({
				position: [50, 400],
				speed: [1, 1],
				health: 100,
				radius: 5,
				shotDelay: 10
			});

			// Create Enemy
			en = new BH_enemy.spawnEnemy({
				position: [(gameWidth-300)/2 - 10, -5],
				speed: [0.0, 1.0],
				health: 500,
				radius: 20,
				shotDelay: 0
			});

			// set points
			points = new BH_points.initialPoints();

			// Animate game
			updater = setInterval(updateGame, 1);
		}

		// Keys/Controls
		let keyState = {};
		$scope.keyDown = function(e){
			keyState[e.keyCode || e.which] = true;
		}
		$scope.keyUp = function(e){
			if(e.which === 75)
				pl.shotDelay = 10;
			keyState[e.keyCode || e.which] = false;
		}
		function keyChecker(){
			// Up
			if(keyState[87]){
      	if(pl.yPos - pl.radius - pl.ySpd < 0)
      		pl.yPos = pl.radius;
      	else
      		pl.yPos -= pl.ySpd;
      }
			// Right
	    if(keyState[68]){
	    	if(pl.xPos + pl.radius + pl.xSpd > gameWidth - 300)
        		pl.xPos = gameWidth - 300 - pl.radius;
      	else
      		pl.xPos += pl.xSpd;
	    }
			// Down
      if(keyState[83]){
      	if(pl.yPos + pl.radius + pl.ySpd > gameHeight)
      		pl.yPos = gameHeight - pl.radius;
      	else
      		pl.yPos += pl.ySpd;
      }
			// Left
      if(keyState[65]){
      	if(pl.xPos - pl.radius - pl.xSpd < 0)
      		pl.xPos = pl.radius;
      	else
      		pl.xPos -= pl.xSpd;
      }
			// shoot bullets every 8 milliseconds
	    if(keyState[75]){
	    	pl.shotDelay++;
	    	if(pl.shotDelay > 10){
					pl.shotDelay = 0;

					let data = new BH_playerBullet.spawnBullet({
						position: [pl.xPos - 7.5, pl.yPos - pl.radius],
						speed: [0, 12],
						size: [15, 30],
						power: 5
					})
	    		plBulletCount.push(data);
	    	}
	    }
    }

		// ==================COLLISIONS
		function checkPlayerCollision(){
			enBulletCount = enBulletCount.filter(function(bullet){
				let dx = Math.abs(pl.xPos - bullet.xPos);
				let dy = Math.abs(pl.yPos - bullet.yPos);

				// Graze collisions
				if(dx*dx + dy*dy <= Math.pow((pl.radius*5+bullet.radius),2)) {
					points.AddPoints(5);
				}
				// Hitbox collisions
				if(dx*dx + dy*dy <= Math.pow((pl.radius*0.4+bullet.radius),2)) {
					pl.takeDmg(5);
					return false;
				}
				return true;
			})
		}
		function checkEnemyHitCollision(){
			plBulletCount = plBulletCount.filter(function(bullet){
				// Get vertical/horizontal distance between the centers of enemy (circle) and player bullet (rectangle)
				let dx = Math.abs(en.xPos - (bullet.xPos + (bullet.width/2)));
				let dy = Math.abs(en.yPos - (bullet.yPos + (bullet.height/2)));

				// No collision if distance > 50% width of enemy + player bullet
				if (dx > (bullet.width/2 + en.radius) || dy > (bullet.height/2 + en.radius)){
					return true;
				}

				// Collision detected if distance < 50% player bullet
		    if (dx <= (bullet.width/2) || dy <= (bullet.height/2)) {
					// No points if enemy transitioning to next phase
					if(!en.deadFlag){
						en.takeDmg(bullet.power);
						points.AddPoints(50);
					}
					return false;
				}

				// Check corners of bullet for collision
				dx -= bullet.width/2;
  			dy -= bullet.height/2;

  			if(dx*dx + dy*dy <= (en.radius*en.radius)){
					// No points if enemy transitioning to next phase
					if(!en.deadFlag){
						en.takeDmg(bullet.power);
						points.AddPoints(50);
					}
					return false;
				}
				else
					return true;
			})

			// Check if enemy health depleted
			if(en.health <= 0 && !en.deadFlag){
				en.deadFlag = true;
				points.AddPoints(500000);

				//transition to next attack phase
				switch(en.phase){
					case 1:
						setTimeout(function(){
							en.deadFlag = false;
							en.health = en.getMaxHealth();
							en.phase++;
						},1000)
						break;
					case 2:
						break;
				}
			}
		}

		function drawTitleScreen(){
			ctx_BG.clearRect(0,0,gameWidth,gameHeight);

			// border
			ctx_BG.beginPath();
			ctx_BG.rect(0,0,gameWidth,gameHeight);
			ctx_BG.lineWidth = 1;
			ctx_BG.stroke();
			ctx_BG.closePath();

			// title
			ctx_BG.beginPath();
			ctx_BG.font = "40px Comic Sans MS";
			ctx_BG.fillText("Bullet Hell", 300, 100);
			ctx_BG.closePath();
		}

	  // Animate game
		function updateGame(){
			ctx_BG.clearRect(0,0,gameWidth,gameHeight);
			ctx_PL.clearRect(0,0,gameWidth,gameHeight);
			ctx_EN.clearRect(0,0,gameWidth,gameHeight);

			// user interface
			drawGUI();

			// bullets
			drawBullets();

			// player
			keyChecker();
			drawPlayer();
			checkPlayerCollision();

			// enemy
			drawEnemy();
			checkEnemyHitCollision();
		}
		function drawGUI(){
			//==Left Side
			ctx_BG.beginPath();
			ctx_BG.rect(0,0,gameWidth-300,gameHeight);
			ctx_BG.lineWidth=1;
			ctx_BG.stroke();
			ctx_BG.closePath();

			//==Right Side
			ctx_BG.beginPath();
			ctx_BG.rect(gameWidth-300,0,300,gameHeight);
			ctx_BG.lineWidth=1;
			ctx_BG.stroke();
			ctx_BG.closePath();

			//Text
			ctx_BG.beginPath();
			ctx_BG.font = "20px sans-serif";
			ctx_BG.fillStyle = "#000";
			ctx_BG.fillText("Points",gameWidth-290, 25);
			ctx_BG.textAlign = "right";
			ctx_BG.fillText(""+points.getPointsPadded(),gameWidth-175, 45);
			ctx_BG.textAlign = "left";
			ctx_BG.fillText("Health",gameWidth-290, 65);
			ctx_BG.closePath();

			//health bar
			ctx_BG.beginPath();
			ctx_BG.fillStyle = "lime";
			ctx_BG.strokeStyle = "#000000";
			ctx_BG.rect(gameWidth-270, 80, (pl.health/pl.getMaxHealth())*100, 20);
			ctx_BG.fill();
			ctx_BG.rect(gameWidth-270, 80, 100, 20);
			ctx_BG.stroke();
			ctx_BG.closePath();
		}
		function drawPlayer(){
			//sprite/graze area
			ctx_PL.beginPath();
			pl_ship.draw((pl.radius*5)*2, (pl.radius*5)*2, pl.xPos - (pl.radius*5), pl.yPos - (pl.radius*5));
			// ctx_PL.fillStyle = "lime";
			// ctx_PL.arc(pl.xPos, pl.yPos, pl.radius*3, 0, 2 * Math.PI);
			// ctx_PL.fill();
			ctx_PL.closePath();

			//hitbox
			ctx_PL.beginPath();
			ctx_PL.fillStyle = "white";
			ctx_PL.strokeStyle = "red";
			ctx_PL.arc(pl.xPos, pl.yPos, pl.radius, 0, 2 * Math.PI);
			ctx_PL.fill();
			ctx_PL.stroke();
			ctx_PL.closePath();
		}
		function drawEnemy(){
			if(!en.deadFlag){
				switch(en.phase){
					//Phase 0
					case 0:
						//Enemy Enters
						en.yPos += en.ySpd;
						en.ySpd *= 0.985;
						if(en.ySpd <= 0.05)
							en.phase++;
						break;
					//Phase 1
					case 1:
						en.shotDelay++;
						if(en.shotDelay % 10 === 0){
							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((en.angle+45) * (Math.PI / 180))*2, Math.sin((en.angle+45 ) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.1, 0.1],
								acceleration: 1.01,
								radius: 5,
								behavior: 2
							})
			    		enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(((90-en.angle)+45) * (Math.PI/180))*2 , Math.sin(((90-en.angle)+45) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.1, 0.1],
								acceleration: 1.01,
								radius: 5,
								behavior: 2
							})
							enBulletCount.push(data);
						}
						if(en.shotDelay % 200 == 0){
							en.shotDelay = 0;

							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [pl.xPos - en.xPos, pl.yPos - en.yPos],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.5, 0.5],
								acceleration: 1.0,
							 	radius: 10,
							 	behavior: 1
							})
							enBulletCount.push(data);
						}

						en.angle += Math.random()*5;
						if(en.angle >= 90)
							en.angle -= 90;
						break;
					// Phase 2
					case 2:
						en.shotDelay++;
						if(en.shotDelay % 5 === 0){
							let pivotDir = (Math.random() * 31) - 15;

							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((50+pivotDir) * (Math.PI / 180))*2, Math.sin(50 * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 1
							});
							enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((130+pivotDir) * (Math.PI / 180))*2, Math.sin(130 * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 1
							});
							enBulletCount.push(data);
						}
						if(en.shotDelay % 10 === 0 && en.shotDelay < 500){
							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(en.angle * (Math.PI / 180))*2, Math.sin(en.angle * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [1.5, 1.5],
								acceleration: 1.05,
								radius: 7,
								behavior: 3
							})
							enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((360-en.angle) * (Math.PI/180))*2 , Math.sin((360-en.angle) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 3
							})
							enBulletCount.push(data);

							en.angle += 45;
							if(en.angle >= 360)
								en.angle = 0;
						}
						else if(en.shotDelay > 600){
							en.shotDelay = 0;
							en.angle = 0;
						}
						break;
					default:
						break;
				}
			}

			ctx_EN.beginPath();
			ctx_EN.fillStyle = "gray";
			ctx_EN.arc(en.xPos, en.yPos, en.radius, 0, 2 * Math.PI);
			ctx_EN.fill();
			ctx_EN.closePath();
		}

		function drawBullets(){
			// Player bullets
			plBulletCount = plBulletCount.filter(function(bullet){
				if(bullet.yPos + bullet.height > 0){
					bullet.yPos -= bullet.ySpd;

					ctx_PL.beginPath();
					ctx_PL.fillStyle = "blue";
					ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.width, bullet.height);
					ctx_PL.closePath();
					return true;
				}
				return false;
			});

			// Enemy bullets
			enBulletCount = enBulletCount.filter(function(bullet){
				if(!bullet.outOfBounds(gameWidth, gameHeight)){
					// Depending on bullet behavior, determine next movements
					switch(bullet.behavior){
						case 1: // No Acceleration
							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;
							break;
						case 2: // Straight Accelerating
							bullet.xSpd * bullet.accel < bullet.getMaxSpd() ? bullet.xSpd *= bullet.accel : bullet.xSpd = bullet.getMaxSpd();
							bullet.ySpd * bullet.accel < bullet.getMaxSpd() ? bullet.ySpd *= bullet.accel : bullet.ySpd = bullet.getMaxSpd();

							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;
							break;
						case 3: // Stop for a bit, then Accelerate to player
							bullet.xSpd / bullet.accel > bullet.getMinSpd() ? bullet.xSpd /= bullet.accel : bullet.xSpd = bullet.getMinSpd();
							bullet.ySpd / bullet.accel > bullet.getMinSpd() ? bullet.ySpd /= bullet.accel : bullet.ySpd = bullet.getMinSpd();

							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;

							if(bullet.xSpd === bullet.getMinSpd() || bullet.ySpd === bullet.getMinSpd()){
								bullet.newTargetCoords([pl.xPos - bullet.xPos, pl.yPos - bullet.yPos]);
								bullet.behavior = 2;
							}
							break;
					}

					ctx_EN.beginPath();
					ctx_EN.drawImage(enBulletImages[0], bullet.xPos - bullet.radius, bullet.yPos - bullet.radius, bullet.radius*2, bullet.radius*2);
					ctx_EN.closePath();
					return true;
				}
				return false;
			});
		}

		// clear objects, variables, service events on page navigation
		$scope.$on('$locationChangeStart', function( event ) {
			clearInterval(updater);
			plBulletCount = [];
			enBulletCount = [];
    	points = null;
			pl = null;
			en = null;
		});

	/* simple spiral pattern formula for later
	enemy.xPos = 250 + (enemy.xScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.xPos = 250 + (enemy.xScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.angle + 3 <= 360 ? enemy.angle += 3 : enemy.angle = 0;
	enemy.xScale += enemy.xSpd;
	enemy.yScale += enemy.ySpd;
	*/
})


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('connect4Ctrl', function($scope, $timeout){
  $scope.playerWait = true;
  let rack;
  let cpuTurn;
  let playerColor, cpuColor;

  $scope.init = function(){
    rack = [];
    cpuTurn = false;

    $("#c4-rack").children("div").addClass("gray-out");
    $("#select-token").css("display","block");

    for(let r=0; r<6; r++){
      rack.push([]);
      for(let c=0; c<7; c++){
        $("#c4-col-"+c).append("<div class='c4-space open'><div></div></div>");
        rack[r][c] = 0;
      }
    }
  }

  // reset game: remove colors and set rack values to 0
  $scope.restart = function(){
    for(let c=0; c<7; c++){
      let rows = $("#c4-col-"+c).children();

      for(let r=0; r<rows.length; r++){
        rows[r].classList.remove("filled-red");
        rows[r].classList.remove("filled-black");
        rows[r].classList.add("open");

        rack[r][c] = 0;
      }
    }

    $("#play-again").css("display","none");
    $("#select-token").css("display","block");
  }

  // Insert token into rack
  $scope.insertToken = function(e){
    let c = parseInt(e.currentTarget.id.substr(-1)); //id,index of selected column
    let rows = e.currentTarget.children; //rows in selected column
    let winFlag = false;

    for(let r=rows.length-1; r>=0; r--){
      if(rows[r].classList.contains("open")){
        rows[r].classList.remove("open");

        if(!cpuTurn){
          rows[r].classList.add("filled-"+playerColor);
          rack[r][c] = 1;
          winFlag = checkWinPatterns(1);
        }
        else{
          rows[r].classList.add("filled-"+cpuColor);
          rack[r][c] = 2;
          winFlag = checkWinPatterns(2);
        }

        // if no one has won yet, continue to next turn
        if(!winFlag)
          cpuTurn = !cpuTurn;

        break;
      }
    }

    if(winFlag){
      $scope.playerWait = true;
      $scope.winner = !cpuTurn ? "Player 1 (you)" : "Player 2 (CPU)";

      $("#c4-rack").children("div").addClass("gray-out");
      $("#game-in-progress").css("display","none");
      $("#play-again").css("display","block");
    }
    else if(rack[0].indexOf(0) === -1){
      $scope.playerWait = true;
      $scope.winner = "tie";

      $("#c4-rack").children("div").addClass("gray-out");
      $("#game-in-progress").css("display","none");
      $("#play-again").css("display","block");
    }
    else if(cpuTurn){
      $scope.playerWait = true;
      cpuDecision();
    }
  }

  $scope.playerColorSelected = function(selected, other){
    playerColor = selected;
    cpuColor = other;

    $scope.playerWait = false;
    $("#c4-rack").children("div").removeClass("gray-out");
    $("#select-token").css("display","none");
    $("#game-in-progress").css("display","block");
  }

  function cpuDecision(){
    let openColumns = [];
    for(let c=0; c<rack[0].length; c++){
      if(rack[0][c] === 0)
        openColumns.push(c);
    }

    $timeout(function() {
      $scope.playerWait = false;
      angular.element("#c4-col-"+openColumns[Math.floor(Math.random() * openColumns.length)]).trigger("click");
    },1000);
  }

  // check all possible win conditions
  function checkWinPatterns(token){
    let count = 0;

    // (-) horizontal
    for(let r=0; r<6; r++){
      for(let c=0; c<7; c++){
        if(rack[r][c] === token)
          count++;
        else
          count = 0;

        if(count === 4)
          return true;
      }
      count = 0;
    }

    // (|) vertical
    for(let c=0; c<7; c++){
      for(let r=0; r<6; r++){
        if(rack[r][c] === token)
          count++;
        else
          count = 0;

        if(count === 4)
          return true;
      }
      count = 0;
    }

    // (\) diagonal
    for(let r=0; r<3; r++){
      for(let c=0; c<4; c++){
        if(rack[r][c] === token &&
          rack[r+1][c+1] === token &&
          rack[r+2][c+2] === token &&
          rack[r+3][c+3] === token){
          return true;
        }
      }
    }
    // (/) diagonal
    for(let r=0; r<3; r++){
      for(let c=3; c<7; c++){
        if(rack[r][c] === token &&
          rack[r+1][c-1] === token &&
          rack[r+2][c-2] === token &&
          rack[r+3][c-3] === token){
          return true;
        }
      }
    }
    return false;
  }
})


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// BULLET HELL POINT SERVICE
app.service("BH_points", function(){
	function initialPoints(){
		let current = 0;

		this.AddPoints = function(points){
			current += points;
		},
		this.getPoints = function(){
			return current;
		},
		this.getPointsPadded = function(){
			let str = String(current);

			while(str.length < 9){
				str = "0"+str;
			}
			return str;
		}
	};
	return {
		initialPoints: initialPoints
	};
})
// PLAYER SERVICE
.service("BH_player", function(){
	function spawnPlayer(data){
		// Player stats
		const	maxHealth = data.health;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.health = data.health,
		this.shotDelay = data.shotDelay,
		this.radius = data.radius,

		// Get max health
		this.getMaxHealth = function(){
			return maxHealth;
		}
		// take damage
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}
	};

	return {
		spawnPlayer: spawnPlayer
	};
})
// ENEMY SERVICE
.service("BH_enemy", function(){
	function spawnEnemy(data){
		// enemy stats
		const	maxHealth = data.health;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.health = data.health,
		this.shotDelay = data.shotDelay,
		this.radius = data.radius,
		this.phase = 0,
		this.angle = 0,
		this.deadFlag = false;

		// take damage
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}
		// Get Lives
		this.getMaxHealth = function(){
			return maxHealth;
		}
		this.outOfBounds = function(gameWidth, gameHeight){
			if(this.yPos - this.radius > gameHeight - 0 + 10)
				return true;
			else if(this.yPos + this.radius < -10)
				return true;
			else if(this.xPos - this.radius > gameWidth - 300 + 10)
				return true;
			else if(this.xPos + this.radius < -10)
				return true;
			else
				return false;
		}
	};

	return {
		spawnEnemy: spawnEnemy
	};
})

// PLAYER BULLET SERVICE
.service("BH_playerBullet", function(){
	function spawnBullet(data){
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.width = data.size[0], this.height = data.size[1],
		this.power = data.power
	};

	return {
		spawnBullet: spawnBullet
	};
})
// ENEMY BULLET SERVICE
.service("BH_enemyBullet", function(){
	function spawnBullet(data){
		//stats
		const maxSpd = 1.0;
		const minSpd = 0.01;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.accel = data.acceleration,
		this.radius = data.radius,
		this.behavior = data.behavior,

		// fix direction for proper movement
		this.newTargetCoords = function(target){
			this.magnitude = Math.sqrt(target[0]*target[0] + target[1]*target[1])
			this.xDir = target[0]/this.magnitude, this.yDir = target[1]/this.magnitude
		},
		this.newTargetCoords(data.target),

		// get speed limits
		this.getMaxSpd = function(){
			return maxSpd;
		},
		this.getMinSpd = function(){
			return minSpd;
		},
		this.outOfBounds = function(gameWidth, gameHeight){
			if(this.yPos - this.radius > gameHeight - 0 + this.radius)
				return true;
			else if(this.yPos + this.radius < this.radius)
				return true;
			else if(this.xPos - this.radius > gameWidth - 300 + this.radius)
				return true;
			else if(this.xPos + this.radius < -this.radius)
				return true;
			else
				return false;
		}
	};
	return {
		spawnBullet: spawnBullet
	};
})


/***/ })
/******/ ]);