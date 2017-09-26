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
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*fs-web@1.0.0#directory_entry*/

Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _path = __webpack_require__(0);
var _path2 = _interopRequireDefault(_path);
function DirectoryEntry(fullPath, type) {
    this.path = fullPath;
    this.name = _path2['default'].basename(fullPath);
    this.dir = _path2['default'].dirname(fullPath);
    this.type = type;
}
exports['default'] = DirectoryEntry;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var probeApp = __webpack_require__(3).probeApp;
var canvas = document.getElementById('draw-canvas');
var app = new probeApp(canvas);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
/**
 * @module  :   probeApp.ts
 * @author  :   Michael. A. Uman
 * @date    :   September 12, 2017
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(4);
;
/** Probe Application object */
var probeApp = (function () {
    function probeApp(c) {
        console.log("probeApp()");
        this.canvasElement = c;
        this.ctx = c.getContext("2d");
        this.panesLoaded = false;
        this.trackMove = false;
        this.startDrag = { x: 0, y: 0 };
        this.bgColor = "lightgreen";
        this.paneNo = -1;
        this.panes = new Array();
        this.initEvents();
        this.resizeCanvas();
        this.loadPanes();
    }
    probeApp.prototype.initEvents = function () {
        var _this = this;
        console.log("initEvents()");
        window.addEventListener("load", function () {
            _this.resizeCanvas();
        });
        window.addEventListener("resize", function () {
            _this.resizeCanvas();
        });
        /** Hook up the mouse up/down/move events */
        window.addEventListener("mousedown", function (e) {
            _this.onMouseDown(e);
        });
        window.addEventListener("mouseup", function (e) {
            _this.onMouseUp(e);
        });
        window.addEventListener("mousemove", function (e) {
            _this.onMouseMove(e);
        });
        window.addEventListener("beforeunload", function () {
            _this.onBeforeUnload();
        });
        this.canvasElement.addEventListener("keydown", function (e) {
            _this.onKeyDown(e);
        });
        setInterval(function () {
            _this.onTimer();
        }, 500);
    };
    probeApp.prototype.onBeforeUnload = function () {
        console.log("onBeforeUnload()");
        this.savePanes();
    };
    probeApp.prototype.addPane = function (pane) {
        this.panes.push(pane);
        if (this.panes.length > 0) {
            this.panesLoaded = true;
        }
        this.drawCanvas();
    };
    probeApp.prototype.onKeyDown = function (e) {
        switch (e.keyCode) {
            case 27:
                window.close();
                break;
            case 78:
                var newPane = {
                    x: 20,
                    y: 20,
                    w: 200,
                    h: 200,
                    title: "Test panel",
                    color: "blue",
                    content: []
                };
                this.addPane(newPane);
                break;
            default:
                console.log(e);
                break;
        }
    };
    probeApp.prototype.onTimer = function () {
        console.log("onTimer()");
        if (this.trackMove == false) {
            this.drawCanvas();
        }
    };
    /** Draw the timestamp into the canvas */
    probeApp.prototype.drawTimestamp = function () {
        var ts = new Date().toLocaleTimeString();
        this.ctx.fillStyle = "black";
        this.ctx.font = "10pt mono";
        this.ctx.fillText(ts, 2, 12);
    };
    probeApp.prototype.resizeCanvas = function () {
        console.log("resizeCanvas()");
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        // if (!this.panesLoaded) {
        //     this.loadPanes();
        // }
        this.drawCanvas();
    };
    ;
    probeApp.prototype.drawSunkenRect = function (rect) {
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(rect.x, rect.y + rect.h);
        this.ctx.lineTo(rect.x, rect.y);
        this.ctx.lineTo(rect.x + rect.w, rect.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(rect.x + rect.w, rect.y);
        this.ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
        this.ctx.lineTo(rect.x, rect.y + rect.h);
        this.ctx.stroke();
    };
    probeApp.prototype.drawRaisedRect = function (rect) {
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo(rect.x, rect.y + rect.h);
        this.ctx.lineTo(rect.x, rect.y);
        this.ctx.lineTo(rect.x + rect.w, rect.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo(rect.x + rect.w, rect.y);
        this.ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
        this.ctx.lineTo(rect.x, rect.y + rect.h);
        this.ctx.stroke();
    };
    /* Draw a single pane */
    probeApp.prototype.drawPane = function (pane) {
        this.ctx.fillStyle = pane.color;
        this.ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
        this.ctx.font = "10pt mono";
        this.ctx.fillStyle = "lightgrey";
        this.ctx.fillRect(pane.x, pane.y, pane.w, 16);
        this.ctx.fillStyle = "black";
        var dims = this.ctx.measureText(pane.title);
        this.ctx.fillText(pane.title, pane.x + ((pane.w - dims.width) / 2), pane.y + 12);
        this.drawRaisedRect({
            x: pane.x,
            y: pane.y,
            w: pane.w,
            h: pane.h,
        });
        if (pane.content) {
            // create clip rect.
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.rect(pane.x, pane.y, pane.w, pane.h);
            this.ctx.clip();
            this.ctx.fillStyle = "white";
            this.ctx.font = "9pt mono";
            for (var x = 0; x < pane.content.length; x++) {
                var line = pane.content[x];
                this.ctx.fillText(line, pane.x + 4, pane.y + 30 + (x * 14));
            }
            this.ctx.restore();
        }
    };
    /** Clear the canvas to the background color */
    probeApp.prototype.clearCanvas = function () {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };
    /** Draw all the panes */
    probeApp.prototype.drawCanvas = function () {
        this.clearCanvas();
        if (this.panes) {
            // this.panes.forEach((pane) => {
            //     this.drawPane(pane);
            // });
            for (var i = this.panes.length - 1; i >= 0; i--) {
                this.drawPane(this.panes[i]);
            }
        }
        this.drawTimestamp();
    };
    /** Determine which pane the point is in */
    probeApp.prototype.whichPane = function (pos) {
        if (this.panesLoaded) {
            for (var x = 0; x < this.panes.length; x++) {
                var pane = this.panes[x];
                if ((pos.x >= pane.x) && (pos.x <= (pane.x + pane.w))) {
                    if ((pos.y >= pane.y) && (pos.y <= (pane.y + pane.h))) {
                        return x;
                    }
                }
            }
        }
        return -1;
    };
    probeApp.prototype.loadPanes = function () {
        var _this = this;
        fs.readFile(__dirname + "/panes.json", 'utf8', function (err, data) {
            if (err) {
                console.log("ERROR : " + err);
                return;
            }
            _this.panes = JSON.parse(data);
            _this.panesLoaded = true;
            // if (cb) {
            //     cb();
            // } else {
            _this.drawCanvas();
            // }
        });
    };
    probeApp.prototype.paneToTop = function (n) {
        if (n < this.panes.length) {
            //            var topPane = this.panes.length - 1;
            var temp = this.panes[0];
            this.panes[0] = this.panes[n];
            this.panes[n] = temp;
        }
    };
    /** Save the pane layout to a JSON file */
    probeApp.prototype.savePanes = function () {
        console.log("savePaneLayout()");
        fs.writeFile("panes.json", JSON.stringify(this.panes, null, 4), function (err) {
            if (err)
                console.log(err);
        });
    };
    /** Get the mouse position relative to the canvas */
    probeApp.prototype.getMousePos = function (e) {
        var rect = this.canvasElement.getBoundingClientRect();
        return ({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
    };
    probeApp.prototype.onMouseUp = function (e) {
        var mousePos = this.getMousePos(e);
        console.log("onMouseUp() ", mousePos.x, mousePos.y);
        //this.canvasElement.onmousemove = null;
        //      this.canvasElement.removeEventListener('mousemove', this.onMouseMove);
        this.trackMove = false;
        this.paneNo = -1;
        this.startDrag = { x: 0, y: 0 };
    };
    probeApp.prototype.onMouseDown = function (e) {
        var mousePos = this.getMousePos(e);
        console.log("onMouseDown() ", mousePos.x, mousePos.y);
        this.paneNo = this.whichPane(mousePos);
        console.log("in pane ", this.paneNo);
        if (this.paneNo >= 0) {
            this.paneToTop(this.paneNo);
            this.paneNo = 0;
            //            this.canvasElement.onmousemove = this.onMouseMove;
            //            this.canvasElement.addEventListener('mousemove', this.onMouseMove);
            this.startDrag = mousePos;
            this.trackMove = true;
        }
    };
    probeApp.prototype.onMouseMove = function (e) {
        if (this.trackMove) {
            var mousePos = this.getMousePos(e);
            console.log("onMouseMove() ", mousePos.x, mousePos.y);
            var diff = {
                x: mousePos.x - this.startDrag.x,
                y: mousePos.y - this.startDrag.y
            };
            this.panes[this.paneNo].x += diff.x;
            this.panes[this.paneNo].y += diff.y;
            this.startDrag = mousePos;
            console.log("diff = ", diff);
            this.drawCanvas();
        }
    };
    return probeApp;
}());
exports.probeApp = probeApp;

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*fs-web@1.0.0#fs*/

Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    newObj[key] = obj[key];
            }
        }
        newObj['default'] = obj;
        return newObj;
    }
}
function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = Object.getOwnPropertyDescriptor(defaults, key);
        if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _core = __webpack_require__(5);
var _directory_entry = __webpack_require__(1);
var _directory_entry2 = _interopRequireDefault(_directory_entry);
_directory_entry2['default'].prototype.readFile = function (callback) {
    if (this.type !== 'file') {
        throw new TypeError('Not a file.');
    }
    return (0, _core.readFile)(this.path, callback);
};
_defaults(exports, _interopRequireWildcard(_core));
exports.DirectoryEntry = _directory_entry2['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*fs-web@1.0.0#core*/

Object.defineProperty(exports, '__esModule', { value: true });
exports.readFile = readFile;
exports.readString = readString;
exports.writeFile = writeFile;
exports.removeFile = removeFile;
exports.readdir = readdir;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _path = __webpack_require__(0);
var _path2 = _interopRequireDefault(_path);
var _directory_entry = __webpack_require__(1);
var _directory_entry2 = _interopRequireDefault(_directory_entry);
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
var DB_NAME = window.location.host + '_filesystem', OS_NAME = 'files', DIR_IDX = 'dir';
function init(callback) {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function (e) {
        var db = e.target.result;
        var objectStore = db.createObjectStore(OS_NAME, { keyPath: 'path' });
        objectStore.createIndex(DIR_IDX, 'dir', { unique: false });
    };
    req.onsuccess = function (e) {
        callback(e.target.result);
    };
}
function initOS(type, callback) {
    init(function (db) {
        var trans = db.transaction([OS_NAME], type), os = trans.objectStore(OS_NAME);
        callback(os);
    });
}
var readFrom = function readFrom(fileName) {
    return new Promise(function (resolve, reject) {
        initOS('readonly', function (os) {
            var req = os.get(fileName);
            req.onerror = reject;
            req.onsuccess = function (e) {
                var res = e.target.result;
                if (res && res.data) {
                    resolve(res.data);
                } else {
                    reject('File not found');
                }
            };
        });
    });
};
function readFile(fileName) {
    return readFrom(fileName).then(function (data) {
        if (!(data instanceof ArrayBuffer)) {
            data = str2ab(data.toString());
        }
        return data;
    });
}
function readString(fileName) {
    return readFrom(fileName).then(function (data) {
        if (data instanceof ArrayBuffer) {
            data = ab2str(data);
        }
        return data;
    });
}
;
function writeFile(fileName, data) {
    return new Promise(function (resolve, reject) {
        initOS('readwrite', function (os) {
            var req = os.put({
                'path': fileName,
                'dir': _path2['default'].dirname(fileName),
                'type': 'file',
                'data': data
            });
            req.onerror = reject;
            req.onsuccess = function (e) {
                resolve();
            };
        });
    });
}
;
function removeFile(fileName) {
    return new Promise(function (resolve) {
        initOS('readwrite', function (os) {
            var req = os['delete'](fileName);
            req.onerror = req.onsuccess = function (e) {
                resolve();
            };
        });
    });
}
;
function withTrailingSlash(path) {
    var directoryWithTrailingSlash = path[path.length - 1] === '/' ? path : path + '/';
    return directoryWithTrailingSlash;
}
function readdir(directoryName) {
    return new Promise(function (resolve, reject) {
        initOS('readonly', function (os) {
            var dir = _path2['default'].dirname(withTrailingSlash(directoryName));
            var idx = os.index(DIR_IDX);
            var range = IDBKeyRange.only(dir);
            var req = idx.openCursor(range);
            req.onerror = function (e) {
                reject(e);
            };
            var results = [];
            req.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    var value = cursor.value;
                    var entry = new _directory_entry2['default'](value.path, value.type);
                    results.push(entry);
                    cursor['continue']();
                } else {
                    resolve(results);
                }
            };
        });
    });
}
;
function mkdir(fullPath) {
    return new Promise(function (resolve, reject) {
        initOS('readwrite', function (os) {
            var dir = withTrailingSlash(_path2['default']);
            var req = os.put({
                'path': fullPath,
                'dir': _path2['default'].dirname(dir),
                'type': 'directory'
            });
            req.onerror = reject;
            req.onsuccess = function (e) {
                resolve();
            };
        });
    });
}
;
function rmdir(fullPath) {
    return readdir(fullPath).then(function removeFiles(files) {
        if (!files || !files.length) {
            return removeFile(fullPath);
        }
        var file = files.shift(), func = file.type === 'directory' ? rmdir : removeFile;
        return func(file.name).then(function () {
            return removeFiles(files);
        });
    });
}
;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);