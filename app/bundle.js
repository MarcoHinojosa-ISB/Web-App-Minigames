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

// Main.js is the entry point for webpack. All JS and CSS created for this application will be
// called here and bundled together

app = angular.module('inventory', ['ngRoute']);

//call page styles
__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(14);

//call angularjs controllers, services
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
__webpack_require__(20);
__webpack_require__(21);
__webpack_require__(22);

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
    .when('/tetris', {
      templateUrl: 'app/pages/tetris/tetrisView.html',
      controller: 'tetrisCtrl'
    })
    .when('/breakout', {
      templateUrl: 'app/pages/breakout/breakoutView.html',
      controller: 'breakoutCtrl'
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
exports.push([module.i, "/* header */\r\n#header-title{\r\n\tfont-family: \"Arial Black\", Gadget, sans-serif;\r\n\tfont-size: 40px;\r\n\ttext-align: center;\r\n}\r\n\r\n/* menubar */\r\n#header-menu{\r\n\tbackground-color: #ffffff;\r\n\tfont-family: Verdana, Geneva, sans-serif;\r\n\tfont-size: 20px;\r\n\tborder-radius: 10px;\r\n\tpadding-left: 5px;\r\n\theight: 50px;\r\n\tmargin-bottom: 10px;\r\n}\r\n#header-menu a{\r\n\tcolor: #000000;\r\n\ttext-decoration: none;\r\n\tdisplay: block;\r\n\tline-height: 50px;\r\n}\r\n#header-menu li{\r\n\tlist-style-type: none;\r\n\tfloat: left;\r\n\tpadding-left: 10px;\r\n\tpadding-right: 10px;\r\n\ttransition: 0.3s;\r\n}\r\n#header-menu li:hover{\r\n\tbackground-color: #eeeeee;\r\n}\r\n", ""]);

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
exports.push([module.i, "h4, h2{\r\n  text-align: center;\r\n}\r\n", ""]);

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
exports.push([module.i, "#bh-screen{\r\n\tbackground-color: #CCC;\r\n\tborder: 1px solid black;\r\n}\r\n\r\n#bh-canvas-container{\r\n\tposition: relative;\r\n\tleft: 0;\r\n\tright: 0;\r\n\tmargin-left: auto;\r\n \tmargin-right: auto;\r\n\tmax-width: 800px;\r\n}\r\n#bh-screen, #bh-player, #bh-enemy{\r\n\toutline: 0;\r\n\tposition: absolute;\r\n\tleft: 0;\r\n}\r\n#bh-screen:focus, #bh-player:focus, #bh-enemy:focus{\r\n\r\n}\r\n#bh-start{\r\n\tposition: absolute;\r\n\ttop: 150px;\r\n\tmargin-left: -40px;\r\n\tbackground-color: #AFF;\r\n\tborder: 2px solid #000;\r\n\tborder-radius: 10px;\r\n\tfont-size: 25px;\r\n\r\n\tz-index: 1;\r\n}\r\n#bh-start:hover{\r\n\tborder-color: #666;\r\n}\r\n", ""]);

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
exports.push([module.i, "/* rack */\r\n#c4-rack{\r\n  margin: 0 auto;\r\n  width: 580px;\r\n  border: 10px solid #555555;\r\n  font-size: 0;\r\n}\r\n\r\n/* rack columns */\r\n#c4-rack > div{\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n#c4-rack > div:hover{\r\n  opacity: 0.6;\r\n}\r\n\r\n/* gray out columns */\r\n.c4-gray-out{\r\n  opacity: 0.6;\r\n}\r\n\r\n/* rack spaces */\r\n.c4-space{\r\n  display: inline-block;\r\n  background-color: rgb(245,245,0);\r\n  width: 80px;\r\n  height: 80px;\r\n}\r\n.c4-space > div{\r\n  position: relative;\r\n  left: 5px;\r\n  top: 5px;\r\n  width: 70px;\r\n  height: 70px;\r\n  border-radius: 50%;\r\n  z-index: 1;\r\n}\r\n.open > div{\r\n  background-color: #fefefe;\r\n}\r\n\r\n/* token */\r\n.filled-red > div{\r\n  background-color: red;\r\n}\r\n.filled-black > div{\r\n  background-color: #000000;\r\n}\r\n\r\n/* text */\r\n#c4-dialog-box{\r\n  display: inline-block;\r\n  width: 580px;\r\n  padding-bottom: 10px;\r\n  border-left: 10px solid #555555;\r\n  border-bottom: 10px solid #555555;\r\n  border-right: 10px solid #555555;\r\n  background-color: #eeeeee;\r\n}\r\n#c4-dialog-box > div{\r\n  display: none;\r\n}\r\n#c4-token-red{\r\n  background-color: red; color: #ffffff;\r\n  border-radius: 50%;\r\n}\r\n#c4-token-black{\r\n  background-color: black; color: #ffffff;\r\n  border-radius: 50%;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
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
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./tetrisStyle.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./tetrisStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#tetris-screen{\r\n  position: relative;\r\n  width: 400px;\r\n  height: 402px;\r\n  border: 1px solid black;\r\n  margin: 0 auto;\r\n}\r\n#tetris-screen:focus{\r\n  outline: 0;\r\n}\r\n\r\n#tetris-start, #tetris-gameover{\r\n  position: absolute;\r\n  top: 90px;\r\n  width: 202px;\r\n  margin: 0 auto;\r\n\r\n  z-index: 1;\r\n}\r\n#tetris-gameover{\r\n  color: white;\r\n  display: none;\r\n}\r\n#tetris-start button, #tetris-gameover button{\r\n  background-color: #ccccee;\r\n  color: black;\r\n  border: 3px solid #7777bb;\r\n  padding: 7px;\r\n  transition: 0.1s;\r\n}\r\n#tetris-start button:hover, #tetris-gameover button:hover{\r\n  padding: 8px;\r\n}\r\n\r\n#tetris-grid{\r\n  position: absolute;\r\n  width: 202px;\r\n  background-color: #222222;\r\n\r\n  /* to fix inline-block space */\r\n  font-size: 0px;\r\n}\r\n#tetris-next-grid{\r\n  width: 70%;\r\n  margin: 0 auto;\r\n  border: 3px solid #888888;\r\n  background-color: #222222;\r\n  border-radius: 5px;\r\n}\r\n#tetris-next-grid > div{\r\n  width: 82px;\r\n  height: 82px;\r\n  margin: 0 auto;\r\n  border-radius: 5px;\r\n\r\n  /* to fix inline-block space */\r\n  font-size: 0px;\r\n}\r\n#tetris-status{\r\n  position: absolute;\r\n  width: 196px;\r\n  height: 100%;\r\n  background-color: #555555;\r\n  left: 202px;\r\n}\r\n#tetris-status > h4{\r\n  color: white;\r\n}\r\n#points, #lines-cleared{\r\n  position: relative;\r\n  width: 80%;\r\n  margin: 0 auto;\r\n  border: 3px solid #888888;\r\n  background-color: #cccccc;\r\n}\r\n\r\n.tetris-blk{\r\n  display: inline-block;\r\n  border: 1px solid #222222;\r\n  width: 20px;\r\n  height: 20px;\r\n  border-radius: 3px;\r\n}\r\n\r\n.tetris-blkColor-1{\r\n  background-color: red;\r\n}\r\n.tetris-blkColor-2{\r\n  background-color: blue;\r\n}\r\n.tetris-blkColor-3{\r\n  background-color: violet;\r\n}\r\n.tetris-blkColor-4{\r\n  background-color: green;\r\n}\r\n.tetris-blkColor-5{\r\n  background-color: orange;\r\n}\r\n.tetris-blkColor-6{\r\n  background-color: cyan;\r\n}\r\n.tetris-blkColor-7{\r\n  background-color: yellow;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
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
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./breakoutStyle.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./breakoutStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#bo-screen{\r\n  background-color: #CCC;\r\n}\r\n\r\n#bo-canvas-container{\r\n  position: relative;\r\n\tmargin: 0 auto;\r\n  max-width: 800px;\r\n}\r\n#bo-canvas-container > canvas{\r\n  border: 1px solid black;\r\n  position: absolute;\r\n  left: 0;\r\n  outline: 0;\r\n}\r\n#bo-start, #bo-restart{\r\n  position: absolute;\r\n  top: 150px;\r\n\tmargin-left: -40px;\r\n  background-color: #eeeeee;\r\n  border: 2px solid #444444;\r\n  border-radius: 10px;\r\n  font-size: 25px;\r\n\r\n  z-index: 1;\r\n}\r\n#bo-restart{\r\n  display: none;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports) {

app.controller('homeCtrl', function($scope, $http){
	$scope.welcome = "Welcome, this is the home page";
	$scope.controls = "For all games, move with WASD";
})


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('bulletHellCtrl', function($scope, BH_player, BH_playerBullet, BH_enemy, BH_enemyBullet, BH_points){
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
		function shipAnimate(path, frameT, framesPR, frameW, frameH){
			let image = new Image();
			image.src = path;

			let totalFrames = frameT, framesPerRow = framesPR;
			let currentFrame = 0;
			let frameWidth = frameW;
			let frameHeight = frameH;

			this.draw = function(x, y, w, h){
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
		enBulletImages = enBulletImages.map(function(curr){
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
				pl.moveUp();
      }
			// Right
	    if(keyState[68]){
				pl.moveRight(gameWidth);
	    }
			// Down
      if(keyState[83]){
				pl.moveDown(gameHeight);
      }
			// Left
      if(keyState[65]){
				pl.moveLeft();
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

				// No collision if distance > 50% width/height of player bullet + enemy radius
				if (dx > (bullet.width/2 + en.radius) || dy > (bullet.height/2 + en.radius)){
					return true;
				}

				// Collision detected if distance < 50% width/height of player bullet
		    if (dx <= (bullet.width/2) || dy <= (bullet.height/2)) {
					// No points if enemy transitioning to next phase
					if(!en.deadFlag){
						en.takeDmg(bullet.power);
						points.AddPoints(50);
					}
					return false;
				}

				// Check corners of bullet for collision
				let dx2 = dx - bullet.width/2;
  			let dy2 = dy - bullet.height/2;

  			if((dx2*dx2) + (dy2*dy2) <= (en.radius*en.radius)){
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

			//explain controls
			ctx_BG.beginPath();
			ctx_BG.font = "18px sans-serif";
			ctx_BG.fillStyle = "#000";
			ctx_BG.fillText("Shoot with 'K'",gameWidth-290, 290);
			ctx_BG.closePath();
		}
		function drawPlayer(){
			//sprite/graze area
			ctx_PL.beginPath();
			pl_ship.draw(pl.xPos - (pl.radius*5), pl.yPos - (pl.radius*5), (pl.radius*5)*2, (pl.radius*5)*2);
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
/* 18 */
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

    $("#c4-rack").children("div").addClass("c4-gray-out");
    $("#c4-select-token").css("display","block");

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

    $("#c4-play-again").css("display","none");
    $("#c4-select-token").css("display","block");
  }

  // Insert token into rack
  $scope.insertToken = function(e){
    let c = parseInt(e.currentTarget.id.substr(-1)); //id, index of selected column
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

      $("#c4-rack").children("div").addClass("c4-gray-out");
      $("#c4-game-in-progress").css("display","none");
      $("#c4-play-again").css("display","block");
    }
    else if(rack[0].indexOf(0) === -1){
      $scope.playerWait = true;
      $scope.winner = "tie";

      $("#c4-rack").children("div").addClass("c4-gray-out");
      $("#c4-game-in-progress").css("display","none");
      $("#c4-play-again").css("display","block");
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
    $("#c4-rack").children("div").removeClass("c4-gray-out");
    $("#c4-select-token").css("display","none");
    $("#c4-game-in-progress").css("display","block");
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller("tetrisCtrl", function($scope){
  let gameStart = false;
  $scope.points = 0;
  $scope.linesCleared = 0;

  $scope.grid = []; $scope.nextGrid = [];
  const rowSize = 20;
  const colSize = 10;

  /* block initial coords
  ID: shape/color
  ===============
  0: "EMPTY"/black;
  1: Z/red;
  2: S/blue;
  3: T/purple;
  4: L/green;
  5: J/orange;
  6: I/light-blue;
  7: O/yellow;
  ===============*/
  const blk_structure = {
    1: [[0,3],[0,4],[1,4],[1,5]],
    2: [[0,5],[0,4],[1,3],[1,4]],
    3: [[0,4],[1,4],[1,3],[1,5]],
    4: [[1,3],[1,4],[1,5],[0,5]],
    5: [[1,3],[1,4],[1,5],[0,3]],
    6: [[0,3],[0,4],[0,5],[0,6]],
    7: [[0,4],[0,5],[1,4],[1,5]]
  }
  const next_blk_structure = {
    1: [[1,1],[1,2],[2,2],[2,3]],
    2: [[1,2],[1,1],[2,0],[2,1]],
    3: [[1,1],[2,1],[2,0],[2,2]],
    4: [[2,0],[2,1],[2,2],[1,2]],
    5: [[1,1],[2,1],[2,2],[2,3]],
    6: [[1,0],[1,1],[1,2],[1,3]],
    7: [[1,1],[1,2],[2,1],[2,2]]
  }

  let blk, blkColor;
  let nextBlk, nextBlkColor;
  let blockFallInterval, blockFallSpeed = 500;

  $scope.init = function(){
    // create empty grid
    for(let r=0; r<rowSize; r++){
      $scope.grid.push([]);
      if(r<4){
        $scope.nextGrid.push([]);
      }
      for(let c=0; c<colSize; c++){
        $scope.grid[r].push(0);
        if(r<4 && c<4){
          $scope.nextGrid[r].push(0);
        }
      }
    }
  }

  $scope.startGame = function(){
    $("#tetris-screen").focus();

    // hide start button
    $("#tetris-start").css("display", "none");

    // start game variables
    gameStart = true;
    $scope.points = 0;
    $scope.linesCleared = 0;

    // begin dropping blocks
    nextBlkColor = Math.ceil(Math.random()*7);
    getNewBlock();
    blockFallInterval = setInterval(blockFall, blockFallSpeed);
  }

  $scope.resetGame = function(){
    $("#tetris-grid").css("opacity","1");
    $("#tetris-gameover").css("display", "none");

    for(let r=0; r<rowSize; r++){
      for(let c=0; c<colSize; c++){
        $scope.grid[r][c] = 0;
      }
    }

    $scope.startGame();
  }

  function blockFall(){
    //if block reached bottom collision, get new block
    if(floorCollision()){
      checkLineClear();
      getNewBlock();
    }
    $scope.$apply();
  }

  function checkLineClear(){
    let miss;

    for(let r=0; r<rowSize; r++){
      miss = false;

      for(let c=0; c<colSize; c++){
        if($scope.grid[r][c] === 0){
          miss = true;
          break;
        }
      }
      if(!miss){
        $scope.grid.splice(r,1);
        $scope.grid.unshift([]);

        for(let c=0; c<colSize; c++){
          $scope.grid[0].push(0);
        }
        $scope.points += 40;
        $scope.linesCleared++;
      }
    }
  }

  // get a new block at random
  function getNewBlock(){
    blk = [];
    nextBlk = [];

    blkColor = nextBlkColor;
    nextBlkColor = Math.ceil(Math.random()*7);

    // get tile coordinates of next blocks
    for(let i=0; i<4; i++){
      blk.push(blk_structure[ blkColor ][i].slice(0));
      nextBlk.push(next_blk_structure[ nextBlkColor ][i].slice(0));
    }

    // clear grid on status area
    for(let r=0; r<4; r++){
      for(let c=0; c<4; c++){
        $scope.nextGrid[r][c] = 0;
      }
    }

    // draw blocks on grids
    for(let i=0; i<4; i++){
      // end game if no open space for current block
      if($scope.grid[ blk[i][0] ][ blk[i][1] ] !== 0){
        clearInterval(blockFallInterval);
        gameStart = false;
        $("#tetris-grid").css("opacity","0.7");
        $("#tetris-gameover").css("display", "block");
      }

      $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      $scope.nextGrid[ nextBlk[i][0] ][ nextBlk[i][1] ] = nextBlkColor;
    }
  }

  function blockRotation(){
    let pivot = blk[1];
    let rotateMatrix = [[0,1],[-1,0]];
    let tmp1 = [1,1], tmp2 = [1,1], tmp3 = [];
    let canRotate = true;

    // rotate tiles
    for(let i=0; i<blk.length; i++){
      tmp1[0] = blk[i][0] - pivot[0];
      tmp1[1] = blk[i][1] - pivot[1];

      tmp2[0] = (rotateMatrix[0][0] * tmp1[0]) + (rotateMatrix[0][1] * tmp1[1]);
      tmp2[1] = (rotateMatrix[1][0] * tmp1[0]) + (rotateMatrix[1][1] * tmp1[1]);

      tmp3.push([tmp2[0] + pivot[0], tmp2[1] + pivot[1]]);
    }

    // check if rotation is valid
    for(let i=0; i<tmp3.length; i++){
      if(tmp3[i][0] < 0 || tmp3[i][0] > rowSize-1 || tmp3[i][1] < 0 || tmp3[i][1] > colSize-1){
        canRotate = false;
        break;
      }
      if($scope.grid[ tmp3[i][0] ][ tmp3[i][1] ] !== 0 && $scope.grid[ tmp3[i][0] ][ tmp3[i][1] ] !== $scope.grid[ blk[i][0] ][ blk[i][1] ]){
        canRotate = false;
        break;
      }
    }

    // update grid if rotation is valid
    if(canRotate){
      for(let i=0; i<blk.length; i++){
        $scope.grid[blk[i][0]][blk[i][1]] = 0;
      }
      blk = tmp3.slice(0);
      for(let i=0; i<blk.length; i++){
        $scope.grid[blk[i][0]][blk[i][1]] = blkColor;
      }
    }
  }

  // controls
  // ========
  // W/Up: rotate
  // A/left: move left
  // S/Down: move down
  // D/Right: move right
  $scope.controls = function(e){
    if(gameStart){
      switch(e.keyCode){
        case 87:
        case 38:
          blockRotation();
          break;
        case 37:
        case 65:
          leftWallCollision();
          break;
        case 39:
        case 68:
          rightWallCollision();
          break;
        case 40:
        case 83:
          // if no floor collision, reset block fall timer
          if(!floorCollision()){
            $scope.points++;
            clearInterval(blockFallInterval);
            blockFallInterval = setInterval(blockFall, blockFallSpeed);
          };
          break;
      }
    }

  }

  function leftWallCollision(){
    let wallReached = false;

    for(let i=0; i<blk.length; i++){
      if(blk[i][1] === 0){
        wallReached = true;
        break;
      }
      if($scope.grid[ blk[i][0] ][ blk[i][1] - 1 ] !== 0){
        if(!checkTileExists([ blk[i][0], blk[i][1] - 1 ])){
          wallReached = true;
          break;
        }
      }
    }

    if(!wallReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]--;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function rightWallCollision(){
    let wallReached = false;

    for(let i=0; i<blk.length; i++){
      if(blk[i][1] === colSize-1){
        wallReached = true;
        break;
      }
      if($scope.grid[ blk[i][0] ][ blk[i][1] + 1 ] !== 0){
        if(!checkTileExists([ blk[i][0], blk[i][1] + 1 ])){
          wallReached = true;
          break;
        }
      }
    }

    if(!wallReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]++;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function floorCollision(){
    let bottomReached = false;

    for(let i=0; i<blk.length; i++){
      // check if the tile coords of the falling block reached the bottom
      if(blk[i][0] === rowSize-1){
        bottomReached = true;
        break;
      }
      // check if the tile coords of the falling block reached other blocks
      if($scope.grid[ blk[i][0] + 1 ][ blk[i][1] ] !== 0){
        if(!checkTileExists([ blk[i][0] + 1, blk[i][1] ])){
          bottomReached = true;
          break;
        }
      }
    }

    // move block if floor not reached
    if(!bottomReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][0]++;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }

    return bottomReached;
  }

  // check if a tile is part of falling block
  function checkTileExists(tile){
    for(let i=0; i<blk.length; i++){
      if(blk[i][0] === tile[0] && blk[i][1] === tile[1])
        return true;
    }
    return false;
  }
})


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller("breakoutCtrl", function($scope, BO_paddle, BO_brick, BO_ball, BO_mapData){
  let c_BG = $("#bo-screen")[0];
  let c_PL = $("#bo-player")[0];
  let c_BR = $("#bo-bricks")[0];
  let c_BLL = $("#bo-ball")[0];
  let ctx_BG = c_BG.getContext("2d");
  let ctx_PL = c_PL.getContext("2d");
  let ctx_BR = c_BR.getContext("2d");
  let ctx_BLL = c_BLL.getContext("2d");

  const gameWidth = c_BG.getAttribute("width");
  const gameHeight = c_BG.getAttribute("height");
  const finalLevel = 3;

  let level, lives, paddle, mapData;
  let bricks = [], balls = [];
  let updater, screenTrans1, screenTrans2;

  // load images
  let powerUpImages = [];
  powerUpImages.push([new Image(), "assets/images/breakout/ballGrow.png"],
                    [new Image(), "assets/images/breakout/multiBall.png"],
                    [new Image(), "assets/images/breakout/oneUp.png"]);
  powerUpImages = powerUpImages.map(function(curr){
    curr[0].src = curr[1];
    return curr[0];
  })

  // Init
  $scope.init = function(){
    drawMessageScreen("Break Out");
  }

  $scope.startGame = function(){
    $("#bo-start").hide();
    $("#bo-restart").hide();

    // set initial game settings
    paddle = new BO_paddle.paddle({
      xPos: (gameWidth/2) - 40,
      speed: 3,
      gameWidth: gameWidth,
      gameHeight: gameHeight
    });
    balls[0] = new BO_ball.ball({
      xPos: gameWidth/2,
      yPos: gameHeight - 250,
      xSpd: 0,
      ySpd: 2,
      radius: 10
    })
    level = 1;
    lives = 3;
    mapData = new BO_mapData.mapData();

    // Create bricks;
    generateBricks();

    // Start game loop
    updater = setInterval(updateGame, 10);
  }

  // Keys/Controls ================================
  let keyState = {};
  $scope.keyDown = function(e){
    keyState[e.keyCode || e.which] = true;
  }
  $scope.keyUp = function(e){
    keyState[e.keyCode || e.which] = false;
  }
  function keyChecker(){
    // Right
    if(keyState[68]){
      paddle.move(68);
    }
    // Left
    if(keyState[65]){
      paddle.move(65);
    }
  }
  // ============================================

  function generateBricks(){
    mapData.getMap(level).forEach(function(brickProp){
      bricks.push(new BO_brick.brick({
        xPos: brickProp[0],
        yPos: brickProp[1],
        type: brickProp[2]
      }));
    });
  };

  // Collisions =================================
  function checkPaddleBallCollision(){
    balls.forEach(function(ball){
      // Get vertical/horizontal distance between the centers of paddle and ball
      let dx = Math.abs(ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2)));
      let dy = Math.abs(ball.getYPos() - (paddle.getYPos() + (paddle.getHeight()/2)));

      // No collision if distance > 50% width/height of paddle + ball radius
      if(dx > (paddle.getWidth()/2) + ball.getRadius() || dy > (paddle.getHeight()/2) + ball.getRadius()){
        return;
      }

      // Collision if distance <= 50% width/height of paddle
      if(dx <= paddle.getWidth()/2 || dy <= paddle.getHeight()/2){
        let tmp = ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2));
        ball.setXSpd((tmp * 3)/100);

        if(ball.getYSpd() > 0)
          ball.setYSpd(ball.getYSpd() * -1);
      }

      // Check corners of paddle for collision
      let dx2 = dx - paddle.getWidth()/2;
      let dy2 = dy - paddle.getHeight()/2;

      if((dx2*dx2) + (dy2*dy2) <= ball.getRadius()*ball.getRadius()){
        let tmp = ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2));
        ball.setXSpd((tmp * 3)/100);

        if(ball.getYSpd() > 0)
          ball.setYSpd(ball.getYSpd() * -1);
      }
    })
  }

  function checkBrickBallCollision(){
    balls.forEach(function(ball){
      bricks = bricks.filter(function(brick){
        // Get vertical/horizontal distance between the centers of brick and ball
        let dx = Math.abs(ball.getXPos() - (brick.getXPos() + (brick.getWidth()/2)));
        let dy = Math.abs(ball.getYPos() - (brick.getYPos() + (brick.getHeight()/2)));

        // No collision if distance > 50% width/height of brick + ball radius
        if(dx > (brick.getWidth()/2) + ball.getRadius() || dy > (brick.getHeight()/2) + ball.getRadius()){
          return true;
        }

        // Collision if distance <= 50% width/height of brick
        if(dx <= brick.getWidth()/2 || dy <= brick.getHeight()/2){
          if(dx <= brick.getWidth()/2)
            ball.setYSpd(ball.getYSpd() * -1);
          if(dy <= brick.getHeight()/2)
            ball.setXSpd(ball.getXSpd() * -1);

          brick.damaged();
        }

        // Check corners of brick for collision
        let dx2 = dx - brick.getWidth()/2;
        let dy2 = dy - brick.getHeight()/2;

        if((dx2*dx2) + (dy2*dy2) <= ball.getRadius()*ball.getRadius()){
          ball.setYSpd(ball.getYSpd() * -1);
          ball.setXSpd(ball.getXSpd() * -1);

          brick.damaged();
        }

        if(brick.getHealth() > 0){
          return true;
        }
        else{
          if(brick.getType() === 2){
            ball.setRadius(15);
          }
          else if(brick.getType() === 3){
            balls.push(new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: 2,
              ySpd: -2,
              radius: 10
            }), new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: -2,
              ySpd: 1.5,
              radius: 10
            }), new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: -1.5,
              ySpd: 2,
              radius: 10
            }));
          }
          else if(brick.getType() === 4){
            lives++;
          }
          return false;
        }
      })
    })

    // if all bricks are destroyed, advance to next level
    if(bricks.length === 0){
      level++;
      clearInterval(updater);

      if(level > finalLevel){
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Game Cleared");
          $("#bo-restart").show();
        }, 500);
      }
      else{
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Next Level");

          screenTrans2 = setTimeout(function(){
            balls = [];

            paddle = new BO_paddle.paddle({
              xPos: (gameWidth/2) - 40,
              speed: 3,
              gameWidth: gameWidth,
              gameHeight: gameHeight
            });
            balls[0] = new BO_ball.ball({
              xPos: gameWidth/2,
              yPos: gameHeight - 250,
              xSpd: 0,
              ySpd: 2,
              radius: 10
            });

            generateBricks();

            updater = setInterval(updateGame, 10);
          }, 500)
        }, 500)
      }
    }
  }

  function checkBorderBallCollision(){
    balls = balls.filter(function(ball){
      if(ball.getXPos() - ball.getRadius() <= 0 || ball.getXPos() + ball.getRadius() >= gameWidth){
        ball.setXSpd(ball.getXSpd() * -1);
      }
      if(ball.getYPos() - ball.getRadius() <= 0){
        ball.setYSpd(ball.getYSpd() * -1);
      }
      if(ball.getYPos() - ball.getRadius() >= gameHeight){
        return false;
      }
      return true;
    })

    if(balls.length === 0){
      lives--;
      if(lives > 0){
        balls[0] = new BO_ball.ball({
          xPos: gameWidth/2,
          yPos: gameHeight - 250,
          xSpd: 0,
          ySpd: 2,
          radius: 10
        })
      }
      else{
        clearInterval(updater);
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Game Over");
          $("#bo-restart").show();
        }, 500);
      }
    }
  }
  // ============================================

  // Draw Methods================================
  //clear screen
  function clearScreen(){
    ctx_BG.clearRect(0,0,gameWidth,gameHeight);
    ctx_PL.clearRect(0,0,gameWidth,gameHeight);
    ctx_BR.clearRect(0,0,gameWidth,gameHeight);
    ctx_BLL.clearRect(0,0,gameWidth,gameHeight);
  }

  // Heading Message
  function drawMessageScreen(message){
    clearScreen();

    ctx_BG.beginPath();
    ctx_BG.font = "40px Comic Sans MS";
    ctx_BG.fillText(message, 300, 100);
    ctx_BG.closePath();
  }

  // Paddle
  function drawPaddle(){
    ctx_PL.beginPath();
    ctx_PL.fillStyle = "white";
    ctx_PL.strokeStyle = "black";
    ctx_PL.rect(paddle.getXPos(), paddle.getYPos(), paddle.getWidth(), paddle.getHeight());
    ctx_PL.fill();
    ctx_PL.stroke();
    ctx_PL.closePath();
  }

  // Balls
  function drawBall(){
    balls.forEach(function(ball){
      ctx_BLL.beginPath();
      ctx_BLL.fillStyle = "white";
      ctx_BLL.strokeStyle = "black";
      ctx_BLL.arc(ball.getXPos(), ball.getYPos(), ball.getRadius(), 0, 2 * Math.PI);
      ctx_BLL.fill();
      ctx_BLL.stroke();
      ctx_BLL.closePath();
      ball.move();
    })
  }

  // Bricks
  function drawBricks(){
    bricks.forEach(function(brick){
      ctx_BR.beginPath();
      ctx_BR.fillStyle = "white";
      ctx_BR.strokeStyle = "black";
      ctx_BR.rect(brick.getXPos(), brick.getYPos(), brick.getWidth(), brick.getHeight());
      ctx_BR.fill();
      ctx_BR.stroke();
      if(brick.getType() === 2)
        ctx_BR.drawImage(powerUpImages[0], brick.getXPos() + 25, brick.getYPos(), 30, 30);
      else if(brick.getType() === 3)
        ctx_BR.drawImage(powerUpImages[1], brick.getXPos() + 25, brick.getYPos(), 30, 30);
      else if(brick.getType() === 4)
        ctx_BR.drawImage(powerUpImages[2], brick.getXPos() + 25, brick.getYPos(), 30, 30);
    })
  }

  function drawStatus(){
    ctx_BG.beginPath();
    ctx_BG.font = "20px sans-serif";
    ctx_BG.fillStyle = "black";
    ctx_BG.textAlign = "right";
    ctx_BG.fillText(lives + " Lives", gameWidth - 20, gameHeight - 20);
    ctx_BG.textAlign = "left";
    ctx_BG.fillText("Level "+level, 10, gameHeight - 20);
    ctx_BG.closePath();
  }

  // Update game
  function updateGame(){
    clearScreen();

    keyChecker();
    checkBorderBallCollision();
    checkPaddleBallCollision();
    checkBrickBallCollision();
    drawPaddle();
    drawBricks();
    drawBall();
    drawStatus();
  }

  $scope.$on('$locationChangeStart', function(event){
    clearTimeout(screenTrans1);
    clearTimeout(screenTrans2);
    clearInterval(updater);
    balls = [];
    bricks = [];
    paddle = null;
    mapData = null;
  })
})


/***/ }),
/* 21 */
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

		this.getMaxHealth = function(){
			return maxHealth;
		}
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}
		this.moveUp = function(){
			if(this.yPos - this.radius - this.ySpd < 0)
				this.yPos = this.radius;
			else
				this.yPos -= this.ySpd;
		}
		this.moveRight = function(gameWidth){
			if(this.xPos + this.radius + this.xSpd > gameWidth - 300)
					this.xPos = gameWidth - 300 - this.radius;
			else
				this.xPos += this.xSpd;
		}
		this.moveDown = function(gameHeight){
			if(this.yPos + this.radius + this.ySpd > gameHeight)
				this.yPos = gameHeight - this.radius;
			else
				this.yPos += this.ySpd;
		}
		this.moveLeft = function(){
			if(this.xPos - this.radius - this.xSpd < 0)
				this.xPos = this.radius;
			else
				this.xPos -= this.xSpd;
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


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.service("BO_paddle", function(){
  function paddle(data){
    const width = 100;
    const height = 20;
    const leftScreenBorder = 0;
    const rightScreenBorder = data.gameWidth;
    let xPos = data.xPos;
    let yPos = data.gameHeight - 60;
    let xSpd = data.speed;

    this.setXSpd = function(spd){
      xSpd = spd;
    }
    this.getWidth = function(){
      return width;
    }
    this.getHeight = function(){
      return height;
    }
    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }

    this.move = function(keyCode){
      switch(keyCode){
        // Right=68, Left=65
        case 68:
          xPos += xSpd;
          if(xPos + width > rightScreenBorder)
            xPos = rightScreenBorder - width;
          break;
        case 65:
          xPos -= xSpd;
          if(xPos < leftScreenBorder)
            xPos = leftScreenBorder + 1;
          break;
      }
    }
  }
  return {
    paddle: paddle
  };
})
.service("BO_brick", function(){
  function brick(data){
    const width = 80;
    const height = 30;
    const type = data.type;
    let xPos = data.xPos * width;
    let yPos = data.yPos * height;
    let health = 1;

    this.getHealth = function(){
      return health;
    }
    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }
    this.getWidth = function(){
      return width;
    }
    this.getHeight = function(){
      return height;
    }
    this.getType = function(){
      return type;
    }

    this.damaged = function(){
      health--;
    }
  }
  return {
    brick: brick
  };
})
.service("BO_ball", function(){
  function ball(data){
    let xPos = data.xPos;
    let yPos = data.yPos;
    let xSpd = data.xSpd;
    let ySpd = data.ySpd;
    let radius = data.radius;

    this.move = function(){
      xPos += xSpd;
      yPos += ySpd;
    }

    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }
    this.getXSpd = function(){
      return xSpd;
    }
    this.getYSpd = function(){
      return ySpd;
    }
    this.getRadius = function(){
      return radius;
    }

    this.setXSpd = function(x){
      xSpd = x;
    }
    this.setYSpd = function(y){
      ySpd = y;
    }
    this.setRadius = function(r){
      radius = r;
    }
  }
  return {
    ball: ball
  };
})
.service("BO_mapData", function(){
  function mapData(){
    // the arrays in "maps" represent each brick's properties [column, row, type]
    // at max, bricks can take up 10 columns and 7 rows
    // the number to the left represents the level in which the properties are used
    const maps = {
      1: [[0,1,1], [1,1,1], [2,1,1], [3,1,1], [4,1,1], [5,1,1], [6,1,1], [7,1,1], [8,1,1], [9,1,1],
          [0,2,1], [1,2,1], [2,2,1], [3,2,1], [4,2,1], [5,2,1], [6,2,1], [7,2,1], [8,2,1], [9,2,1],
          [0,3,1], [1,3,1], [2,3,1], [3,3,1], [4,3,1], [5,3,1], [6,3,1], [7,3,1], [8,3,1], [9,3,1]],
      2: [[0,1,1], [1,1,1], [2,1,1], [7,1,1], [8,1,1], [9,1,1],
          [0,2,1], [1,2,4], [2,2,1], [7,2,1], [8,2,2], [9,2,1],
          [0,3,1], [1,3,1], [2,3,1], [7,3,1], [8,3,1], [9,3,1]],
      3: [[1,1,1], [2,1,1], [3,1,1], [4,1,1], [5,5,3], [6,1,1], [7,1,1], [8,1,1],
          [1,2,1], [2,2,1], [3,2,3], [6,2,3], [7,2,1], [8,2,1],
          [1,3,1], [2,3,1], [3,3,1], [6,3,1], [7,3,1], [8,3,1],
          [1,4,1], [2,4,1], [3,4,3], [6,4,3], [7,4,1], [8,4,1],
          [1,5,1], [2,5,1], [3,5,1], [4,5,3], [5,5,3], [6,5,1], [7,5,1], [8,5,1]]
    };

    this.getMap = function(level){
      return maps[level];
    }
  }
  return {
    mapData: mapData
  };
})


/***/ })
/******/ ]);