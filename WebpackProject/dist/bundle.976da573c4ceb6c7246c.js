webpackJsonp([1,2],{

/***/ 112:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.loopAsync = loopAsync;
exports.mapAsync = mapAsync;
function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var sync = false,
      hasNext = false,
      doneArgs = void 0;

  function done() {
    isDone = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      doneArgs = [].concat(Array.prototype.slice.call(arguments));
      return;
    }

    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) {
      return;
    }

    hasNext = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      return;
    }

    sync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work.call(this, currentTurn++, next, done);
    }

    sync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(this, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  }

  next();
}

function mapAsync(array, work, callback) {
  var length = array.length;
  var values = [];

  if (length === 0) return callback(null, values);

  var isDone = false,
      doneCount = 0;

  function done(index, error, value) {
    if (isDone) return;

    if (error) {
      isDone = true;
      callback(error);
    } else {
      values[index] = value;

      isDone = ++doneCount === length;

      if (isDone) callback(null, values);
    }
  }

  array.forEach(function (item, index) {
    work(item, index, function (error, value) {
      done(index, error, value);
    });
  });
}

/***/ },

/***/ 113:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.ContextProvider = ContextProvider;
exports.ContextSubscriber = ContextSubscriber;

var _react = __webpack_require__(1);

// Works around issues with context updates failing to propagate.
// Caveat: the context value is expected to never change its identity.
// https://github.com/facebook/react/issues/2517
// https://github.com/reactjs/react-router/issues/470

var contextProviderShape = _react.PropTypes.shape({
  subscribe: _react.PropTypes.func.isRequired,
  eventIndex: _react.PropTypes.number.isRequired
});

function makeContextName(name) {
  return '@@contextSubscriber/' + name;
}

function ContextProvider(name) {
  var _childContextTypes, _ref2;

  var contextName = makeContextName(name);
  var listenersKey = contextName + '/listeners';
  var eventIndexKey = contextName + '/eventIndex';
  var subscribeKey = contextName + '/subscribe';

  return _ref2 = {
    childContextTypes: (_childContextTypes = {}, _childContextTypes[contextName] = contextProviderShape.isRequired, _childContextTypes),

    getChildContext: function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextName] = {
        eventIndex: this[eventIndexKey],
        subscribe: this[subscribeKey]
      }, _ref;
    },
    componentWillMount: function componentWillMount() {
      this[listenersKey] = [];
      this[eventIndexKey] = 0;
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
      this[eventIndexKey]++;
    },
    componentDidUpdate: function componentDidUpdate() {
      var _this = this;

      this[listenersKey].forEach(function (listener) {
        return listener(_this[eventIndexKey]);
      });
    }
  }, _ref2[subscribeKey] = function (listener) {
    var _this2 = this;

    // No need to immediately call listener here.
    this[listenersKey].push(listener);

    return function () {
      _this2[listenersKey] = _this2[listenersKey].filter(function (item) {
        return item !== listener;
      });
    };
  }, _ref2;
}

function ContextSubscriber(name) {
  var _contextTypes, _ref4;

  var contextName = makeContextName(name);
  var lastRenderedEventIndexKey = contextName + '/lastRenderedEventIndex';
  var handleContextUpdateKey = contextName + '/handleContextUpdate';
  var unsubscribeKey = contextName + '/unsubscribe';

  return _ref4 = {
    contextTypes: (_contextTypes = {}, _contextTypes[contextName] = contextProviderShape, _contextTypes),

    getInitialState: function getInitialState() {
      var _ref3;

      if (!this.context[contextName]) {
        return {};
      }

      return _ref3 = {}, _ref3[lastRenderedEventIndexKey] = this.context[contextName].eventIndex, _ref3;
    },
    componentDidMount: function componentDidMount() {
      if (!this.context[contextName]) {
        return;
      }

      this[unsubscribeKey] = this.context[contextName].subscribe(this[handleContextUpdateKey]);
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
      var _setState;

      if (!this.context[contextName]) {
        return;
      }

      this.setState((_setState = {}, _setState[lastRenderedEventIndexKey] = this.context[contextName].eventIndex, _setState));
    },
    componentWillUnmount: function componentWillUnmount() {
      if (!this[unsubscribeKey]) {
        return;
      }

      this[unsubscribeKey]();
      this[unsubscribeKey] = null;
    }
  }, _ref4[handleContextUpdateKey] = function (eventIndex) {
    if (eventIndex !== this.state[lastRenderedEventIndexKey]) {
      var _setState2;

      this.setState((_setState2 = {}, _setState2[lastRenderedEventIndexKey] = eventIndex, _setState2));
    }
  }, _ref4;
}

/***/ },

/***/ 114:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.locationShape = exports.routerShape = undefined;

var _react = __webpack_require__(1);

var func = _react.PropTypes.func,
    object = _react.PropTypes.object,
    shape = _react.PropTypes.shape,
    string = _react.PropTypes.string;
var routerShape = exports.routerShape = shape({
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired,
  setRouteLeaveHook: func.isRequired,
  isActive: func.isRequired
});

var locationShape = exports.locationShape = shape({
  pathname: string.isRequired,
  search: string.isRequired,
  state: object,
  action: string.isRequired,
  key: string
});

/***/ },

/***/ 115:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _getRouteParams = __webpack_require__(1429);

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _ContextUtils = __webpack_require__(113);

var _RouteUtils = __webpack_require__(24);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes,
    array = _React$PropTypes.array,
    func = _React$PropTypes.func,
    object = _React$PropTypes.object;

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */

var RouterContext = _react2.default.createClass({
  displayName: 'RouterContext',


  mixins: [(0, _ContextUtils.ContextProvider)('router')],

  propTypes: {
    router: object.isRequired,
    location: object.isRequired,
    routes: array.isRequired,
    params: object.isRequired,
    components: array.isRequired,
    createElement: func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      createElement: _react2.default.createElement
    };
  },


  childContextTypes: {
    router: object.isRequired
  },

  getChildContext: function getChildContext() {
    return {
      router: this.props.router
    };
  },
  createElement: function createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props);
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        location = _props.location,
        routes = _props.routes,
        params = _props.params,
        components = _props.components,
        router = _props.router;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = routes[index];
        var routeParams = (0, _getRouteParams2.default)(route, params);
        var props = {
          location: location,
          params: params,
          route: route,
          router: router,
          routeParams: routeParams,
          routes: routes
        };

        if ((0, _RouteUtils.isReactChildren)(element)) {
          props.children = element;
        } else if (element) {
          for (var prop in element) {
            if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
          }
        }

        if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object') {
          var elements = {};

          for (var key in components) {
            if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = _this.createElement(components[key], _extends({
                key: key }, props));
            }
          }

          return elements;
        }

        return _this.createElement(components, props);
      }, element);
    }

    !(element === null || element === false || _react2.default.isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;

    return element;
  }
});

exports.default = RouterContext;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1218:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var loopAsync = exports.loopAsync = function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var isSync = false,
      hasNext = false,
      doneArgs = void 0;

  var done = function done() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    isDone = true;

    if (isSync) {
      // Iterate instead of recursing if possible.
      doneArgs = args;
      return;
    }

    callback.apply(undefined, args);
  };

  var next = function next() {
    if (isDone) return;

    hasNext = true;

    if (isSync) return; // Iterate instead of recursing if possible.

    isSync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work(currentTurn++, next, done);
    }

    isSync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(undefined, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  };

  next();
};

/***/ },

/***/ 1219:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;

var _BrowserProtocol = __webpack_require__(77);

Object.defineProperty(exports, 'getUserConfirmation', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.getUserConfirmation;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.go;
  }
});

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

var _LocationUtils = __webpack_require__(34);

var _DOMUtils = __webpack_require__(56);

var _DOMStateStorage = __webpack_require__(131);

var _PathUtils = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HashChangeEvent = 'hashchange';

var getHashPath = function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};

var pushHashPath = function pushHashPath(path) {
  return window.location.hash = path;
};

var replaceHashPath = function replaceHashPath(path) {
  var hashIndex = window.location.href.indexOf('#');

  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation(pathCoder, queryKey) {
  var path = pathCoder.decodePath(getHashPath());
  var key = (0, _PathUtils.getQueryStringValueFromPath)(path, queryKey);

  var state = void 0;
  if (key) {
    path = (0, _PathUtils.stripQueryStringValueFromPath)(path, queryKey);
    state = (0, _DOMStateStorage.readState)(key);
  }

  var init = (0, _PathUtils.parsePath)(path);
  init.state = state;

  return (0, _LocationUtils.createLocation)(init, undefined, key);
};

var prevLocation = void 0;

var startListener = exports.startListener = function startListener(listener, pathCoder, queryKey) {
  var handleHashChange = function handleHashChange() {
    var path = getHashPath();
    var encodedPath = pathCoder.encodePath(path);

    if (path !== encodedPath) {
      // Always be sure we have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var currentLocation = getCurrentLocation(pathCoder, queryKey);

      if (prevLocation && currentLocation.key && prevLocation.key === currentLocation.key) return; // Ignore extraneous hashchange events

      prevLocation = currentLocation;

      listener(currentLocation);
    }
  };

  // Ensure the hash is encoded properly.
  var path = getHashPath();
  var encodedPath = pathCoder.encodePath(path);

  if (path !== encodedPath) replaceHashPath(encodedPath);

  (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);

  return function () {
    return (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
  };
};

var updateLocation = function updateLocation(location, pathCoder, queryKey, updateHash) {
  var state = location.state,
      key = location.key;


  var path = pathCoder.encodePath((0, _PathUtils.createPath)(location));

  if (state !== undefined) {
    path = (0, _PathUtils.addQueryStringValueToPath)(path, queryKey, key);
    (0, _DOMStateStorage.saveState)(key, state);
  }

  prevLocation = location;

  updateHash(path);
};

var pushLocation = exports.pushLocation = function pushLocation(location, pathCoder, queryKey) {
  return updateLocation(location, pathCoder, queryKey, function (path) {
    if (getHashPath() !== path) {
      pushHashPath(path);
    } else {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'You cannot PUSH the same path using hash history') : void 0;
    }
  });
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location, pathCoder, queryKey) {
  return updateLocation(location, pathCoder, queryKey, function (path) {
    if (getHashPath() !== path) replaceHashPath(path);
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1220:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.replaceLocation = exports.pushLocation = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;

var _BrowserProtocol = __webpack_require__(77);

Object.defineProperty(exports, 'getUserConfirmation', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.getUserConfirmation;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.go;
  }
});

var _LocationUtils = __webpack_require__(34);

var _PathUtils = __webpack_require__(21);

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
  return (0, _LocationUtils.createLocation)(window.location);
};

var pushLocation = exports.pushLocation = function pushLocation(location) {
  window.location.href = (0, _PathUtils.createPath)(location);
  return false; // Don't update location
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
  window.location.replace((0, _PathUtils.createPath)(location));
  return false; // Don't update location
};

/***/ },

/***/ 1221:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = __webpack_require__(78);

var _BrowserProtocol = __webpack_require__(77);

var BrowserProtocol = _interopRequireWildcard(_BrowserProtocol);

var _RefreshProtocol = __webpack_require__(1220);

var RefreshProtocol = _interopRequireWildcard(_RefreshProtocol);

var _DOMUtils = __webpack_require__(56);

var _createHistory = __webpack_require__(79);

var _createHistory2 = _interopRequireDefault(_createHistory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve clean URLs. You can force this
 * behavior using { forceRefresh: true } in options.
 */
var createBrowserHistory = function createBrowserHistory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Browser history needs a DOM') : (0, _invariant2.default)(false) : void 0;

  var useRefresh = options.forceRefresh || !(0, _DOMUtils.supportsHistory)();
  var Protocol = useRefresh ? RefreshProtocol : BrowserProtocol;

  var getUserConfirmation = Protocol.getUserConfirmation,
      getCurrentLocation = Protocol.getCurrentLocation,
      pushLocation = Protocol.pushLocation,
      replaceLocation = Protocol.replaceLocation,
      go = Protocol.go;


  var history = (0, _createHistory2.default)(_extends({
    getUserConfirmation: getUserConfirmation }, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: go
  }));

  var listenerCount = 0,
      stopListener = void 0;

  var startListener = function startListener(listener, before) {
    if (++listenerCount === 1) stopListener = BrowserProtocol.startListener(history.transitionTo);

    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopListener();
    };
  };

  var listenBefore = function listenBefore(listener) {
    return startListener(listener, true);
  };

  var listen = function listen(listener) {
    return startListener(listener, false);
  };

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen
  });
};

exports.default = createBrowserHistory;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1222:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = __webpack_require__(78);

var _DOMUtils = __webpack_require__(56);

var _HashProtocol = __webpack_require__(1219);

var HashProtocol = _interopRequireWildcard(_HashProtocol);

var _createHistory = __webpack_require__(79);

var _createHistory2 = _interopRequireDefault(_createHistory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultQueryKey = '_k';

var addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
};

var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!' + path;
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substring(1) : path;
    }
  },
  noslash: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '/' ? path.substring(1) : path;
    },
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

var createHashHistory = function createHashHistory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Hash history needs a DOM') : (0, _invariant2.default)(false) : void 0;

  var queryKey = options.queryKey,
      hashType = options.hashType;


  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(queryKey !== false, 'Using { queryKey: false } no longer works. Instead, just don\'t ' + 'use location state if you don\'t want a key in your URL query string') : void 0;

  if (typeof queryKey !== 'string') queryKey = DefaultQueryKey;

  if (hashType == null) hashType = 'slash';

  if (!(hashType in HashPathCoders)) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Invalid hash type: %s', hashType) : void 0;

    hashType = 'slash';
  }

  var pathCoder = HashPathCoders[hashType];

  var getUserConfirmation = HashProtocol.getUserConfirmation;


  var getCurrentLocation = function getCurrentLocation() {
    return HashProtocol.getCurrentLocation(pathCoder, queryKey);
  };

  var pushLocation = function pushLocation(location) {
    return HashProtocol.pushLocation(location, pathCoder, queryKey);
  };

  var replaceLocation = function replaceLocation(location) {
    return HashProtocol.replaceLocation(location, pathCoder, queryKey);
  };

  var history = (0, _createHistory2.default)(_extends({
    getUserConfirmation: getUserConfirmation }, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: HashProtocol.go
  }));

  var listenerCount = 0,
      stopListener = void 0;

  var startListener = function startListener(listener, before) {
    if (++listenerCount === 1) stopListener = HashProtocol.startListener(history.transitionTo, pathCoder, queryKey);

    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopListener();
    };
  };

  var listenBefore = function listenBefore(listener) {
    return startListener(listener, true);
  };

  var listen = function listen(listener) {
    return startListener(listener, false);
  };

  var goIsSupportedWithoutReload = (0, _DOMUtils.supportsGoWithoutReloadUsingHash)();

  var go = function go(n) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : void 0;

    history.go(n);
  };

  var createHref = function createHref(path) {
    return '#' + pathCoder.encodePath(history.createHref(path));
  };

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen,
    go: go,
    createHref: createHref
  });
};

exports.default = createHashHistory;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1223:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _LocationUtils = __webpack_require__(34);

var _PathUtils = __webpack_require__(21);

var _createHistory = __webpack_require__(79);

var _createHistory2 = _interopRequireDefault(_createHistory);

var _Actions = __webpack_require__(55);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStateStorage = function createStateStorage(entries) {
  return entries.filter(function (entry) {
    return entry.state;
  }).reduce(function (memo, entry) {
    memo[entry.key] = entry.state;
    return memo;
  }, {});
};

var createMemoryHistory = function createMemoryHistory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (Array.isArray(options)) {
    options = { entries: options };
  } else if (typeof options === 'string') {
    options = { entries: [options] };
  }

  var getCurrentLocation = function getCurrentLocation() {
    var entry = entries[current];
    var path = (0, _PathUtils.createPath)(entry);

    var key = void 0,
        state = void 0;
    if (entry.key) {
      key = entry.key;
      state = readState(key);
    }

    var init = (0, _PathUtils.parsePath)(path);

    return (0, _LocationUtils.createLocation)(_extends({}, init, { state: state }), undefined, key);
  };

  var canGo = function canGo(n) {
    var index = current + n;
    return index >= 0 && index < entries.length;
  };

  var go = function go(n) {
    if (!n) return;

    if (!canGo(n)) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Cannot go(%s) there is not enough history', n) : void 0;

      return;
    }

    current += n;
    var currentLocation = getCurrentLocation();

    // Change action to POP
    history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
  };

  var pushLocation = function pushLocation(location) {
    current += 1;

    if (current < entries.length) entries.splice(current);

    entries.push(location);

    saveState(location.key, location.state);
  };

  var replaceLocation = function replaceLocation(location) {
    entries[current] = location;
    saveState(location.key, location.state);
  };

  var history = (0, _createHistory2.default)(_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: go
  }));

  var _options = options,
      entries = _options.entries,
      current = _options.current;


  if (typeof entries === 'string') {
    entries = [entries];
  } else if (!Array.isArray(entries)) {
    entries = ['/'];
  }

  entries = entries.map(function (entry) {
    return (0, _LocationUtils.createLocation)(entry);
  });

  if (current == null) {
    current = entries.length - 1;
  } else {
    !(current >= 0 && current < entries.length) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Current index must be >= 0 and < %s, was %s', entries.length, current) : (0, _invariant2.default)(false) : void 0;
  }

  var storage = createStateStorage(entries);

  var saveState = function saveState(key, state) {
    return storage[key] = state;
  };

  var readState = function readState(key) {
    return storage[key];
  };

  return _extends({}, history, {
    canGo: canGo
  });
};

exports.default = createMemoryHistory;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 124:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
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

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
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

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },

/***/ 131:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports.readState = exports.saveState = undefined;

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuotaExceededErrors = {
  QuotaExceededError: true,
  QUOTA_EXCEEDED_ERR: true
};

var SecurityErrors = {
  SecurityError: true
};

var KeyPrefix = '@@History/';

var createKey = function createKey(key) {
  return KeyPrefix + key;
};

var saveState = exports.saveState = function saveState(key, state) {
  if (!window.sessionStorage) {
    // Session storage is not available or hidden.
    // sessionStorage is undefined in Internet Explorer when served via file protocol.
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available') : void 0;

    return;
  }

  try {
    if (state == null) {
      window.sessionStorage.removeItem(createKey(key));
    } else {
      window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
    }
  } catch (error) {
    if (SecurityErrors[error.name]) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available due to security settings') : void 0;

      return;
    }

    if (QuotaExceededErrors[error.name] && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : void 0;

      return;
    }

    throw error;
  }
};

var readState = exports.readState = function readState(key) {
  var json = void 0;
  try {
    json = window.sessionStorage.getItem(createKey(key));
  } catch (error) {
    if (SecurityErrors[error.name]) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to read state; sessionStorage is not available due to security settings') : void 0;

      return undefined;
    }
  }

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return undefined;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _runTransitionHook = __webpack_require__(80);

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _PathUtils = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useBasename = function useBasename(createHistory) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var history = createHistory(options);
    var basename = options.basename;


    var addBasename = function addBasename(location) {
      if (!location) return location;

      if (basename && location.basename == null) {
        if (location.pathname.toLowerCase().indexOf(basename.toLowerCase()) === 0) {
          location.pathname = location.pathname.substring(basename.length);
          location.basename = basename;

          if (location.pathname === '') location.pathname = '/';
        } else {
          location.basename = '';
        }
      }

      return location;
    };

    var prependBasename = function prependBasename(location) {
      if (!basename) return location;

      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
      var pname = object.pathname;
      var normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/';
      var normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname;
      var pathname = normalizedBasename + normalizedPathname;

      return _extends({}, object, {
        pathname: pathname
      });
    };

    // Override all read methods with basename-aware versions.
    var getCurrentLocation = function getCurrentLocation() {
      return addBasename(history.getCurrentLocation());
    };

    var listenBefore = function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        return (0, _runTransitionHook2.default)(hook, addBasename(location), callback);
      });
    };

    var listen = function listen(listener) {
      return history.listen(function (location) {
        return listener(addBasename(location));
      });
    };

    // Override all write methods with basename-aware versions.
    var push = function push(location) {
      return history.push(prependBasename(location));
    };

    var replace = function replace(location) {
      return history.replace(prependBasename(location));
    };

    var createPath = function createPath(location) {
      return history.createPath(prependBasename(location));
    };

    var createHref = function createHref(location) {
      return history.createHref(prependBasename(location));
    };

    var createLocation = function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return addBasename(history.createLocation.apply(history, [prependBasename(location)].concat(args)));
    };

    return _extends({}, history, {
      getCurrentLocation: getCurrentLocation,
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation
    });
  };
};

exports.default = useBasename;

/***/ },

/***/ 133:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = __webpack_require__(1336);

var _runTransitionHook = __webpack_require__(80);

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _LocationUtils = __webpack_require__(34);

var _PathUtils = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStringifyQuery = function defaultStringifyQuery(query) {
  return (0, _queryString.stringify)(query).replace(/%20/g, '+');
};

var defaultParseQueryString = _queryString.parse;

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
var useQueries = function useQueries(createHistory) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var history = createHistory(options);
    var stringifyQuery = options.stringifyQuery,
        parseQueryString = options.parseQueryString;


    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;

    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;

    var decodeQuery = function decodeQuery(location) {
      if (!location) return location;

      if (location.query == null) location.query = parseQueryString(location.search.substring(1));

      return location;
    };

    var encodeQuery = function encodeQuery(location, query) {
      if (query == null) return location;

      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
      var queryString = stringifyQuery(query);
      var search = queryString ? '?' + queryString : '';

      return _extends({}, object, {
        search: search
      });
    };

    // Override all read methods with query-aware versions.
    var getCurrentLocation = function getCurrentLocation() {
      return decodeQuery(history.getCurrentLocation());
    };

    var listenBefore = function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        return (0, _runTransitionHook2.default)(hook, decodeQuery(location), callback);
      });
    };

    var listen = function listen(listener) {
      return history.listen(function (location) {
        return listener(decodeQuery(location));
      });
    };

    // Override all write methods with query-aware versions.
    var push = function push(location) {
      return history.push(encodeQuery(location, location.query));
    };

    var replace = function replace(location) {
      return history.replace(encodeQuery(location, location.query));
    };

    var createPath = function createPath(location) {
      return history.createPath(encodeQuery(location, location.query));
    };

    var createHref = function createHref(location) {
      return history.createHref(encodeQuery(location, location.query));
    };

    var createLocation = function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var newLocation = history.createLocation.apply(history, [encodeQuery(location, location.query)].concat(args));

      if (location.query) newLocation.query = (0, _LocationUtils.createQuery)(location.query);

      return decodeQuery(newLocation);
    };

    return _extends({}, history, {
      getCurrentLocation: getCurrentLocation,
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation
    });
  };
};

exports.default = useQueries;

/***/ },

/***/ 1336:
/***/ function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(1488);
var objectAssign = __webpack_require__(5);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ },

/***/ 1419:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(184);

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An <IndexLink> is used to link to an <IndexRoute>.
 */
var IndexLink = _react2.default.createClass({
  displayName: 'IndexLink',
  render: function render() {
    return _react2.default.createElement(_Link2.default, _extends({}, this.props, { onlyActiveOnIndex: true }));
  }
});

exports.default = IndexLink;
module.exports = exports['default'];

/***/ },

/***/ 1420:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _Redirect = __webpack_require__(186);

var _Redirect2 = _interopRequireDefault(_Redirect);

var _InternalPropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes,
    string = _React$PropTypes.string,
    object = _React$PropTypes.object;

/**
 * An <IndexRedirect> is used to redirect from an indexRoute.
 */
/* eslint-disable react/require-render-return */

var IndexRedirect = _react2.default.createClass({
  displayName: 'IndexRedirect',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = _Redirect2.default.createRouteFromReactElement(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRedirect> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
     true ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRedirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRedirect;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1421:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = __webpack_require__(24);

var _InternalPropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _react2.default.PropTypes.func;

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */
/* eslint-disable react/require-render-return */

var IndexRoute = _react2.default.createClass({
  displayName: 'IndexRoute',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = (0, _RouteUtils.createRouteFromReactElement)(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRoute> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    path: _InternalPropTypes.falsy,
    component: _InternalPropTypes.component,
    components: _InternalPropTypes.components,
    getComponent: func,
    getComponents: func
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
     true ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRoute> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRoute;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1422:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = __webpack_require__(24);

var _InternalPropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes,
    string = _React$PropTypes.string,
    func = _React$PropTypes.func;

/**
 * A <Route> is used to declare which components are rendered to the
 * page when the URL matches a given pattern.
 *
 * Routes are arranged in a nested tree structure. When a new URL is
 * requested, the tree is searched depth-first to find a route whose
 * path matches the URL.  When one is found, all routes in the tree
 * that lead to it are considered "active" and their components are
 * rendered into the DOM, nested in the same order as in the tree.
 */
/* eslint-disable react/require-render-return */

var Route = _react2.default.createClass({
  displayName: 'Route',


  statics: {
    createRouteFromReactElement: _RouteUtils.createRouteFromReactElement
  },

  propTypes: {
    path: string,
    component: _InternalPropTypes.component,
    components: _InternalPropTypes.components,
    getComponent: func,
    getComponents: func
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
     true ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Route> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = Route;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1423:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _createTransitionManager2 = __webpack_require__(190);

var _createTransitionManager3 = _interopRequireDefault(_createTransitionManager2);

var _InternalPropTypes = __webpack_require__(51);

var _RouterContext = __webpack_require__(115);

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _RouteUtils = __webpack_require__(24);

var _RouterUtils = __webpack_require__(187);

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _React$PropTypes = _react2.default.PropTypes,
    func = _React$PropTypes.func,
    object = _React$PropTypes.object;

/**
 * A <Router> is a high-level API for automatically setting up
 * a router that renders a <RouterContext> with all the props
 * it needs each time the URL changes.
 */

var Router = _react2.default.createClass({
  displayName: 'Router',


  propTypes: {
    history: object,
    children: _InternalPropTypes.routes,
    routes: _InternalPropTypes.routes, // alias for children
    render: func,
    createElement: func,
    onError: func,
    onUpdate: func,

    // PRIVATE: For client-side rehydration of server match.
    matchContext: object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      render: function render(props) {
        return _react2.default.createElement(_RouterContext2.default, props);
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      location: null,
      routes: null,
      params: null,
      components: null
    };
  },
  handleError: function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably occurred in getChildRoutes or getComponents.
    }
  },
  createRouterObject: function createRouterObject(state) {
    var matchContext = this.props.matchContext;

    if (matchContext) {
      return matchContext.router;
    }

    var history = this.props.history;

    return (0, _RouterUtils.createRouterObject)(history, this.transitionManager, state);
  },
  createTransitionManager: function createTransitionManager() {
    var matchContext = this.props.matchContext;

    if (matchContext) {
      return matchContext.transitionManager;
    }

    var history = this.props.history;
    var _props = this.props,
        routes = _props.routes,
        children = _props.children;


    !history.getCurrentLocation ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You have provided a history object created with history v2.x or ' + 'earlier. This version of React Router is only compatible with v3 ' + 'history objects. Please upgrade to history v3.x.') : (0, _invariant2.default)(false) : void 0;

    return (0, _createTransitionManager3.default)(history, (0, _RouteUtils.createRoutes)(routes || children));
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    this.transitionManager = this.createTransitionManager();
    this.router = this.createRouterObject(this.state);

    this._unlisten = this.transitionManager.listen(function (error, state) {
      if (error) {
        _this.handleError(error);
      } else {
        // Keep the identity of this.router because of a caveat in ContextUtils:
        // they only work if the object identity is preserved.
        (0, _RouterUtils.assignRouterState)(_this.router, state);
        _this.setState(state, _this.props.onUpdate);
      }
    });
  },


  /* istanbul ignore next: sanity check */
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(nextProps.history === this.props.history, 'You cannot change <Router history>; it will be ignored') : void 0;

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)((nextProps.routes || nextProps.children) === (this.props.routes || this.props.children), 'You cannot change <Router routes>; it will be ignored') : void 0;
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._unlisten) this._unlisten();
  },
  render: function render() {
    var _state = this.state,
        location = _state.location,
        routes = _state.routes,
        params = _state.params,
        components = _state.components;

    var _props2 = this.props,
        createElement = _props2.createElement,
        render = _props2.render,
        props = _objectWithoutProperties(_props2, ['createElement', 'render']);

    if (location == null) return null; // Async match

    // Only forward non-Router-specific props to routing context, as those are
    // the only ones that might be custom routing context props.
    Object.keys(Router.propTypes).forEach(function (propType) {
      return delete props[propType];
    });

    return render(_extends({}, props, {
      router: this.router,
      location: location,
      routes: routes,
      params: params,
      components: components,
      createElement: createElement
    }));
  }
});

exports.default = Router;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1424:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.runEnterHooks = runEnterHooks;
exports.runChangeHooks = runChangeHooks;
exports.runLeaveHooks = runLeaveHooks;

var _AsyncUtils = __webpack_require__(112);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PendingHooks = function PendingHooks() {
  var _this = this;

  _classCallCheck(this, PendingHooks);

  this.hooks = [];

  this.add = function (hook) {
    return _this.hooks.push(hook);
  };

  this.remove = function (hook) {
    return _this.hooks = _this.hooks.filter(function (h) {
      return h !== hook;
    });
  };

  this.has = function (hook) {
    return _this.hooks.indexOf(hook) !== -1;
  };

  this.clear = function () {
    return _this.hooks = [];
  };
};

var enterHooks = new PendingHooks();
var changeHooks = new PendingHooks();

function createTransitionHook(hook, route, asyncArity, pendingHooks) {
  var isSync = hook.length < asyncArity;

  var transitionHook = function transitionHook() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    hook.apply(route, args);

    if (isSync) {
      var callback = args[args.length - 1];
      // Assume hook executes synchronously and
      // automatically call the callback.
      callback();
    }
  };

  pendingHooks.add(transitionHook);

  return transitionHook;
}

function getEnterHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onEnter) hooks.push(createTransitionHook(route.onEnter, route, 3, enterHooks));
    return hooks;
  }, []);
}

function getChangeHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onChange) hooks.push(createTransitionHook(route.onChange, route, 4, changeHooks));
    return hooks;
  }, []);
}

function runTransitionHooks(length, iter, callback) {
  if (!length) {
    callback();
    return;
  }

  var redirectInfo = void 0;
  function replace(location) {
    redirectInfo = location;
  }

  (0, _AsyncUtils.loopAsync)(length, function (index, next, done) {
    iter(index, replace, function (error) {
      if (error || redirectInfo) {
        done(error, redirectInfo); // No need to continue.
      } else {
        next();
      }
    });
  }, callback);
}

/**
 * Runs all onEnter hooks in the given array of routes in order
 * with onEnter(nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runEnterHooks(routes, nextState, callback) {
  enterHooks.clear();
  var hooks = getEnterHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    var wrappedNext = function wrappedNext() {
      if (enterHooks.has(hooks[index])) {
        next();
        enterHooks.remove(hooks[index]);
      }
    };
    hooks[index](nextState, replace, wrappedNext);
  }, callback);
}

/**
 * Runs all onChange hooks in the given array of routes in order
 * with onChange(prevState, nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runChangeHooks(routes, state, nextState, callback) {
  changeHooks.clear();
  var hooks = getChangeHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    var wrappedNext = function wrappedNext() {
      if (changeHooks.has(hooks[index])) {
        next();
        changeHooks.remove(hooks[index]);
      }
    };
    hooks[index](state, nextState, replace, wrappedNext);
  }, callback);
}

/**
 * Runs all onLeave hooks in the given array of routes in order.
 */
function runLeaveHooks(routes, prevState) {
  for (var i = 0, len = routes.length; i < len; ++i) {
    if (routes[i].onLeave) routes[i].onLeave.call(routes[i], prevState);
  }
}

/***/ },

/***/ 1425:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _RouterContext = __webpack_require__(115);

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  if (process.env.NODE_ENV !== 'production') {
    middlewares.forEach(function (middleware, index) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(middleware.renderRouterContext || middleware.renderRouteComponent, 'The middleware specified at index ' + index + ' does not appear to be ' + 'a valid React Router middleware.') : void 0;
    });
  }

  var withContext = middlewares.map(function (middleware) {
    return middleware.renderRouterContext;
  }).filter(Boolean);
  var withComponent = middlewares.map(function (middleware) {
    return middleware.renderRouteComponent;
  }).filter(Boolean);

  var makeCreateElement = function makeCreateElement() {
    var baseCreateElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _react.createElement;
    return function (Component, props) {
      return withComponent.reduceRight(function (previous, renderRouteComponent) {
        return renderRouteComponent(previous, props);
      }, baseCreateElement(Component, props));
    };
  };

  return function (renderProps) {
    return withContext.reduceRight(function (previous, renderRouterContext) {
      return renderRouterContext(previous, renderProps);
    }, _react2.default.createElement(_RouterContext2.default, _extends({}, renderProps, {
      createElement: makeCreateElement(renderProps.createElement)
    })));
  };
};

module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1426:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _createBrowserHistory = __webpack_require__(1221);

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createRouterHistory = __webpack_require__(189);

var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createRouterHistory2.default)(_createBrowserHistory2.default);
module.exports = exports['default'];

/***/ },

/***/ 1427:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _PatternUtils = __webpack_require__(38);

function routeParamsChanged(route, prevState, nextState) {
  if (!route.path) return false;

  var paramNames = (0, _PatternUtils.getParamNames)(route.path);

  return paramNames.some(function (paramName) {
    return prevState.params[paramName] !== nextState.params[paramName];
  });
}

/**
 * Returns an object of { leaveRoutes, changeRoutes, enterRoutes } determined by
 * the change from prevState to nextState. We leave routes if either
 * 1) they are not in the next state or 2) they are in the next state
 * but their params have changed (i.e. /users/123 => /users/456).
 *
 * leaveRoutes are ordered starting at the leaf route of the tree
 * we're leaving up to the common parent route. enterRoutes are ordered
 * from the top of the tree we're entering down to the leaf route.
 *
 * changeRoutes are any routes that didn't leave or enter during
 * the transition.
 */
function computeChangedRoutes(prevState, nextState) {
  var prevRoutes = prevState && prevState.routes;
  var nextRoutes = nextState.routes;

  var leaveRoutes = void 0,
      changeRoutes = void 0,
      enterRoutes = void 0;
  if (prevRoutes) {
    (function () {
      var parentIsLeaving = false;
      leaveRoutes = prevRoutes.filter(function (route) {
        if (parentIsLeaving) {
          return true;
        } else {
          var isLeaving = nextRoutes.indexOf(route) === -1 || routeParamsChanged(route, prevState, nextState);
          if (isLeaving) parentIsLeaving = true;
          return isLeaving;
        }
      });

      // onLeave hooks start at the leaf route.
      leaveRoutes.reverse();

      enterRoutes = [];
      changeRoutes = [];

      nextRoutes.forEach(function (route) {
        var isNew = prevRoutes.indexOf(route) === -1;
        var paramsChanged = leaveRoutes.indexOf(route) !== -1;

        if (isNew || paramsChanged) enterRoutes.push(route);else changeRoutes.push(route);
      });
    })();
  } else {
    leaveRoutes = [];
    changeRoutes = [];
    enterRoutes = nextRoutes;
  }

  return {
    leaveRoutes: leaveRoutes,
    changeRoutes: changeRoutes,
    enterRoutes: enterRoutes
  };
}

exports.default = computeChangedRoutes;
module.exports = exports['default'];

/***/ },

/***/ 1428:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _AsyncUtils = __webpack_require__(112);

var _PromiseUtils = __webpack_require__(185);

function getComponentsForRoute(nextState, route, callback) {
  if (route.component || route.components) {
    callback(null, route.component || route.components);
    return;
  }

  var getComponent = route.getComponent || route.getComponents;
  if (getComponent) {
    var componentReturn = getComponent.call(route, nextState, callback);
    if ((0, _PromiseUtils.isPromise)(componentReturn)) componentReturn.then(function (component) {
      return callback(null, component);
    }, callback);
  } else {
    callback();
  }
}

/**
 * Asynchronously fetches all components needed for the given router
 * state and calls callback(error, components) when finished.
 *
 * Note: This operation may finish synchronously if no routes have an
 * asynchronous getComponents method.
 */
function getComponents(nextState, callback) {
  (0, _AsyncUtils.mapAsync)(nextState.routes, function (route, index, callback) {
    getComponentsForRoute(nextState, route, callback);
  }, callback);
}

exports.default = getComponents;
module.exports = exports['default'];

/***/ },

/***/ 1429:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _PatternUtils = __webpack_require__(38);

/**
 * Extracts an object of params the given route cares about from
 * the given params object.
 */
function getRouteParams(route, params) {
  var routeParams = {};

  if (!route.path) return routeParams;

  (0, _PatternUtils.getParamNames)(route.path).forEach(function (p) {
    if (Object.prototype.hasOwnProperty.call(params, p)) {
      routeParams[p] = params[p];
    }
  });

  return routeParams;
}

exports.default = getRouteParams;
module.exports = exports['default'];

/***/ },

/***/ 1430:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _createHashHistory = __webpack_require__(1222);

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _createRouterHistory = __webpack_require__(189);

var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createRouterHistory2.default)(_createHashHistory2.default);
module.exports = exports['default'];

/***/ },

/***/ 1431:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isActive;

var _PatternUtils = __webpack_require__(38);

function deepEqual(a, b) {
  if (a == b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return deepEqual(item, b[index]);
    });
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
    for (var p in a) {
      if (!Object.prototype.hasOwnProperty.call(a, p)) {
        continue;
      }

      if (a[p] === undefined) {
        if (b[p] !== undefined) {
          return false;
        }
      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
        return false;
      } else if (!deepEqual(a[p], b[p])) {
        return false;
      }
    }

    return true;
  }

  return String(a) === String(b);
}

/**
 * Returns true if the current pathname matches the supplied one, net of
 * leading and trailing slash normalization. This is sufficient for an
 * indexOnly route match.
 */
function pathIsActive(pathname, currentPathname) {
  // Normalize leading slash for consistency. Leading slash on pathname has
  // already been normalized in isActive. See caveat there.
  if (currentPathname.charAt(0) !== '/') {
    currentPathname = '/' + currentPathname;
  }

  // Normalize the end of both path names too. Maybe `/foo/` shouldn't show
  // `/foo` as active, but in this case, we would already have failed the
  // match.
  if (pathname.charAt(pathname.length - 1) !== '/') {
    pathname += '/';
  }
  if (currentPathname.charAt(currentPathname.length - 1) !== '/') {
    currentPathname += '/';
  }

  return currentPathname === pathname;
}

/**
 * Returns true if the given pathname matches the active routes and params.
 */
function routeIsActive(pathname, routes, params) {
  var remainingPathname = pathname,
      paramNames = [],
      paramValues = [];

  // for...of would work here but it's probably slower post-transpilation.
  for (var i = 0, len = routes.length; i < len; ++i) {
    var route = routes[i];
    var pattern = route.path || '';

    if (pattern.charAt(0) === '/') {
      remainingPathname = pathname;
      paramNames = [];
      paramValues = [];
    }

    if (remainingPathname !== null && pattern) {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }

      if (remainingPathname === '') {
        // We have an exact match on the route. Just check that all the params
        // match.
        // FIXME: This doesn't work on repeated params.
        return paramNames.every(function (paramName, index) {
          return String(paramValues[index]) === String(params[paramName]);
        });
      }
    }
  }

  return false;
}

/**
 * Returns true if all key/value pairs in the given query are
 * currently active.
 */
function queryIsActive(query, activeQuery) {
  if (activeQuery == null) return query == null;

  if (query == null) return true;

  return deepEqual(query, activeQuery);
}

/**
 * Returns true if a <Link> to the given pathname/query combination is
 * currently active.
 */
function isActive(_ref, indexOnly, currentLocation, routes, params) {
  var pathname = _ref.pathname,
      query = _ref.query;

  if (currentLocation == null) return false;

  // TODO: This is a bit ugly. It keeps around support for treating pathnames
  // without preceding slashes as absolute paths, but possibly also works
  // around the same quirks with basenames as in matchRoutes.
  if (pathname.charAt(0) !== '/') {
    pathname = '/' + pathname;
  }

  if (!pathIsActive(pathname, currentLocation.pathname)) {
    // The path check is necessary and sufficient for indexOnly, but otherwise
    // we still need to check the routes.
    if (indexOnly || !routeIsActive(pathname, routes, params)) {
      return false;
    }
  }

  return queryIsActive(query, currentLocation.query);
}
module.exports = exports['default'];

/***/ },

/***/ 1432:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Actions = __webpack_require__(55);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _createMemoryHistory = __webpack_require__(188);

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createTransitionManager = __webpack_require__(190);

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _RouteUtils = __webpack_require__(24);

var _RouterUtils = __webpack_require__(187);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 */
function match(_ref, callback) {
  var history = _ref.history,
      routes = _ref.routes,
      location = _ref.location,
      options = _objectWithoutProperties(_ref, ['history', 'routes', 'location']);

  !(history || location) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'match needs a history or a location') : (0, _invariant2.default)(false) : void 0;

  history = history ? history : (0, _createMemoryHistory2.default)(options);
  var transitionManager = (0, _createTransitionManager2.default)(history, (0, _RouteUtils.createRoutes)(routes));

  if (location) {
    // Allow match({ location: '/the/path', ... })
    location = history.createLocation(location);
  } else {
    location = history.getCurrentLocation();
  }

  transitionManager.match(location, function (error, redirectLocation, nextState) {
    var renderProps = void 0;

    if (nextState) {
      var router = (0, _RouterUtils.createRouterObject)(history, transitionManager, nextState);
      renderProps = _extends({}, nextState, {
        router: router,
        matchContext: { transitionManager: transitionManager, router: router }
      });
    }

    callback(error, redirectLocation && history.createLocation(redirectLocation, _Actions.REPLACE), renderProps);
  });
}

exports.default = match;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1433:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = matchRoutes;

var _AsyncUtils = __webpack_require__(112);

var _PromiseUtils = __webpack_require__(185);

var _PatternUtils = __webpack_require__(38);

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _RouteUtils = __webpack_require__(24);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getChildRoutes(route, location, paramNames, paramValues, callback) {
  if (route.childRoutes) {
    return [null, route.childRoutes];
  }
  if (!route.getChildRoutes) {
    return [];
  }

  var sync = true,
      result = void 0;

  var partialNextState = {
    location: location,
    params: createParams(paramNames, paramValues)
  };

  var childRoutesReturn = route.getChildRoutes(partialNextState, function (error, childRoutes) {
    childRoutes = !error && (0, _RouteUtils.createRoutes)(childRoutes);
    if (sync) {
      result = [error, childRoutes];
      return;
    }

    callback(error, childRoutes);
  });

  if ((0, _PromiseUtils.isPromise)(childRoutesReturn)) childRoutesReturn.then(function (childRoutes) {
    return callback(null, (0, _RouteUtils.createRoutes)(childRoutes));
  }, callback);

  sync = false;
  return result; // Might be undefined.
}

function getIndexRoute(route, location, paramNames, paramValues, callback) {
  if (route.indexRoute) {
    callback(null, route.indexRoute);
  } else if (route.getIndexRoute) {
    var partialNextState = {
      location: location,
      params: createParams(paramNames, paramValues)
    };

    var indexRoutesReturn = route.getIndexRoute(partialNextState, function (error, indexRoute) {
      callback(error, !error && (0, _RouteUtils.createRoutes)(indexRoute)[0]);
    });

    if ((0, _PromiseUtils.isPromise)(indexRoutesReturn)) indexRoutesReturn.then(function (indexRoute) {
      return callback(null, (0, _RouteUtils.createRoutes)(indexRoute)[0]);
    }, callback);
  } else if (route.childRoutes) {
    (function () {
      var pathless = route.childRoutes.filter(function (childRoute) {
        return !childRoute.path;
      });

      (0, _AsyncUtils.loopAsync)(pathless.length, function (index, next, done) {
        getIndexRoute(pathless[index], location, paramNames, paramValues, function (error, indexRoute) {
          if (error || indexRoute) {
            var routes = [pathless[index]].concat(Array.isArray(indexRoute) ? indexRoute : [indexRoute]);
            done(error, routes);
          } else {
            next();
          }
        });
      }, function (err, routes) {
        callback(null, routes);
      });
    })();
  } else {
    callback();
  }
}

function assignParams(params, paramNames, paramValues) {
  return paramNames.reduce(function (params, paramName, index) {
    var paramValue = paramValues && paramValues[index];

    if (Array.isArray(params[paramName])) {
      params[paramName].push(paramValue);
    } else if (paramName in params) {
      params[paramName] = [params[paramName], paramValue];
    } else {
      params[paramName] = paramValue;
    }

    return params;
  }, params);
}

function createParams(paramNames, paramValues) {
  return assignParams({}, paramNames, paramValues);
}

function matchRouteDeep(route, location, remainingPathname, paramNames, paramValues, callback) {
  var pattern = route.path || '';

  if (pattern.charAt(0) === '/') {
    remainingPathname = location.pathname;
    paramNames = [];
    paramValues = [];
  }

  // Only try to match the path if the route actually has a pattern, and if
  // we're not just searching for potential nested absolute paths.
  if (remainingPathname !== null && pattern) {
    try {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }
    } catch (error) {
      callback(error);
    }

    // By assumption, pattern is non-empty here, which is the prerequisite for
    // actually terminating a match.
    if (remainingPathname === '') {
      var _ret2 = function () {
        var match = {
          routes: [route],
          params: createParams(paramNames, paramValues)
        };

        getIndexRoute(route, location, paramNames, paramValues, function (error, indexRoute) {
          if (error) {
            callback(error);
          } else {
            if (Array.isArray(indexRoute)) {
              var _match$routes;

              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(indexRoute.every(function (route) {
                return !route.path;
              }), 'Index routes should not have paths') : void 0;
              (_match$routes = match.routes).push.apply(_match$routes, indexRoute);
            } else if (indexRoute) {
              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!indexRoute.path, 'Index routes should not have paths') : void 0;
              match.routes.push(indexRoute);
            }

            callback(null, match);
          }
        });

        return {
          v: void 0
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
  }

  if (remainingPathname != null || route.childRoutes) {
    // Either a) this route matched at least some of the path or b)
    // we don't have to load this route's children asynchronously. In
    // either case continue checking for matches in the subtree.
    var onChildRoutes = function onChildRoutes(error, childRoutes) {
      if (error) {
        callback(error);
      } else if (childRoutes) {
        // Check the child routes to see if any of them match.
        matchRoutes(childRoutes, location, function (error, match) {
          if (error) {
            callback(error);
          } else if (match) {
            // A child route matched! Augment the match and pass it up the stack.
            match.routes.unshift(route);
            callback(null, match);
          } else {
            callback();
          }
        }, remainingPathname, paramNames, paramValues);
      } else {
        callback();
      }
    };

    var result = getChildRoutes(route, location, paramNames, paramValues, onChildRoutes);
    if (result) {
      onChildRoutes.apply(undefined, result);
    }
  } else {
    callback();
  }
}

/**
 * Asynchronously matches the given location to a set of routes and calls
 * callback(error, state) when finished. The state object will have the
 * following properties:
 *
 * - routes       An array of routes that matched, in hierarchical order
 * - params       An object of URL parameters
 *
 * Note: This operation may finish synchronously if no routes have an
 * asynchronous getChildRoutes method.
 */
function matchRoutes(routes, location, callback, remainingPathname) {
  var paramNames = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var paramValues = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

  if (remainingPathname === undefined) {
    // TODO: This is a little bit ugly, but it works around a quirk in history
    // that strips the leading slash from pathnames when using basenames with
    // trailing slashes.
    if (location.pathname.charAt(0) !== '/') {
      location = _extends({}, location, {
        pathname: '/' + location.pathname
      });
    }
    remainingPathname = location.pathname;
  }

  (0, _AsyncUtils.loopAsync)(routes.length, function (index, next, done) {
    matchRouteDeep(routes[index], location, remainingPathname, paramNames, paramValues, function (error, match) {
      if (error || match) {
        done(error, match);
      } else {
        next();
      }
    });
  }, callback);
}
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1434:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withRouter;

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = __webpack_require__(1435);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _ContextUtils = __webpack_require__(113);

var _PropTypes = __webpack_require__(114);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withRouter(WrappedComponent, options) {
  var withRef = options && options.withRef;

  var WithRouter = _react2.default.createClass({
    displayName: 'WithRouter',

    mixins: [(0, _ContextUtils.ContextSubscriber)('router')],

    contextTypes: { router: _PropTypes.routerShape },
    propTypes: { router: _PropTypes.routerShape },

    getWrappedInstance: function getWrappedInstance() {
      !withRef ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.') : (0, _invariant2.default)(false) : void 0;

      return this.wrappedInstance;
    },
    render: function render() {
      var _this = this;

      var router = this.props.router || this.context.router;
      var params = router.params,
          location = router.location,
          routes = router.routes;

      var props = _extends({}, this.props, { router: router, params: params, location: location, routes: routes });

      if (withRef) {
        props.ref = function (c) {
          _this.wrappedInstance = c;
        };
      }

      return _react2.default.createElement(WrappedComponent, props);
    }
  });

  WithRouter.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')';
  WithRouter.WrappedComponent = WrappedComponent;

  return (0, _hoistNonReactStatics2.default)(WithRouter, WrappedComponent);
}
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 1435:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};


/***/ },

/***/ 1488:
/***/ function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ },

/***/ 1491:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(73);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = __webpack_require__(27);

var _reactRedux = __webpack_require__(10);

var _reduxThunk = __webpack_require__(74);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = __webpack_require__(208);

var _reducers2 = _interopRequireDefault(_reducers);

var _router = __webpack_require__(209);

var _router2 = _interopRequireDefault(_router);

__webpack_require__(210);

__webpack_require__(211);

__webpack_require__(212);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('hi!');

var App = function App() {
  var store = (0, _redux.createStore)(_reducers2.default, {}, (0, _redux.applyMiddleware)(_reduxThunk2.default));

  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_router2.default, null)
  );
};

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));

/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);

var artists = _.times(20, function () {
  return Artist();
});

module.exports = artists;

/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _faker = __webpack_require__(125);

var _faker2 = _interopRequireDefault(_faker);

var _constants = __webpack_require__(214);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    _id: _lodash2.default.uniqueId(),
    name: _faker2.default.name.findName(),
    age: randomBetween(15, 45),
    yearsActive: randomBetween(0, 15),
    image: _faker2.default.image.avatar(),
    genre: getGenre(),
    website: _faker2.default.internet.url(),
    netWorth: randomBetween(0, 5000000),
    labelName: _faker2.default.company.companyName(),
    retired: _faker2.default.random.boolean(),
    albums: getAlbums()
  };
};

function getAlbums() {
  return _lodash2.default.times(randomBetween(0, 5), function () {
    var copiesSold = randomBetween(0, 1000000);

    return {
      title: _lodash2.default.capitalize(_faker2.default.random.words()),
      date: _faker2.default.date.past(),
      copiesSold: copiesSold,
      numberTracks: randomBetween(1, 20),
      image: getAlbumImage(),
      revenue: copiesSold * 12.99
    };
  });
}

function getAlbumImage() {
  var types = _lodash2.default.keys(_faker2.default.image);
  var method = randomEntry(types);

  return _faker2.default.image[method]();
}

function getGenre() {
  return randomEntry(_constants.GENRES);
}

function randomEntry(array) {
  return array[~~(Math.random() * array.length)];
}

function randomBetween(min, max) {
  return ~~(Math.random() * (max - min)) + min;
}

/***/ },

/***/ 184:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _PropTypes = __webpack_require__(114);

var _ContextUtils = __webpack_require__(113);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _React$PropTypes = _react2.default.PropTypes,
    bool = _React$PropTypes.bool,
    object = _React$PropTypes.object,
    string = _React$PropTypes.string,
    func = _React$PropTypes.func,
    oneOfType = _React$PropTypes.oneOfType;


function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
function isEmptyObject(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return false;
  }return true;
}

function resolveToLocation(to, router) {
  return typeof to === 'function' ? to(router.location) : to;
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets the value of its
 * activeClassName prop.
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 */
var Link = _react2.default.createClass({
  displayName: 'Link',


  mixins: [(0, _ContextUtils.ContextSubscriber)('router')],

  contextTypes: {
    router: _PropTypes.routerShape
  },

  propTypes: {
    to: oneOfType([string, object, func]),
    query: object,
    hash: string,
    state: object,
    activeStyle: object,
    activeClassName: string,
    onlyActiveOnIndex: bool.isRequired,
    onClick: func,
    target: string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onlyActiveOnIndex: false,
      style: {}
    };
  },
  handleClick: function handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);

    if (event.defaultPrevented) return;

    var router = this.context.router;

    !router ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Link>s rendered outside of a router context cannot navigate.') : (0, _invariant2.default)(false) : void 0;

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) return;

    event.preventDefault();

    router.push(resolveToLocation(this.props.to, router));
  },
  render: function render() {
    var _props = this.props,
        to = _props.to,
        activeClassName = _props.activeClassName,
        activeStyle = _props.activeStyle,
        onlyActiveOnIndex = _props.onlyActiveOnIndex,
        props = _objectWithoutProperties(_props, ['to', 'activeClassName', 'activeStyle', 'onlyActiveOnIndex']);

    // Ignore if rendered outside the context of router to simplify unit testing.


    var router = this.context.router;


    if (router) {
      // If user does not specify a `to` prop, return an empty anchor tag.
      if (to == null) {
        return _react2.default.createElement('a', props);
      }

      var toLocation = resolveToLocation(to, router);
      props.href = router.createHref(toLocation);

      if (activeClassName || activeStyle != null && !isEmptyObject(activeStyle)) {
        if (router.isActive(toLocation, onlyActiveOnIndex)) {
          if (activeClassName) {
            if (props.className) {
              props.className += ' ' + activeClassName;
            } else {
              props.className = activeClassName;
            }
          }

          if (activeStyle) props.style = _extends({}, props.style, activeStyle);
        }
      }
    }

    return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick }));
  }
});

exports.default = Link;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.isPromise = isPromise;
function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

/***/ },

/***/ 186:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = __webpack_require__(24);

var _PatternUtils = __webpack_require__(38);

var _InternalPropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes,
    string = _React$PropTypes.string,
    object = _React$PropTypes.object;

/**
 * A <Redirect> is used to declare another URL path a client should
 * be sent to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration
 * and are traversed in the same manner.
 */
/* eslint-disable react/require-render-return */

var Redirect = _react2.default.createClass({
  displayName: 'Redirect',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = (0, _RouteUtils.createRouteFromReactElement)(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, replace) {
        var location = nextState.location,
            params = nextState.params;


        var pathname = void 0;
        if (route.to.charAt(0) === '/') {
          pathname = (0, _PatternUtils.formatPattern)(route.to, params);
        } else if (!route.to) {
          pathname = location.pathname;
        } else {
          var routeIndex = nextState.routes.indexOf(route);
          var parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1);
          var pattern = parentPattern.replace(/\/*$/, '/') + route.to;
          pathname = (0, _PatternUtils.formatPattern)(pattern, params);
        }

        replace({
          pathname: pathname,
          query: route.query || location.query,
          state: route.state || location.state
        });
      };

      return route;
    },
    getRoutePattern: function getRoutePattern(routes, routeIndex) {
      var parentPattern = '';

      for (var i = routeIndex; i >= 0; i--) {
        var route = routes[i];
        var pattern = route.path || '';

        parentPattern = pattern.replace(/\/*$/, '/') + parentPattern;

        if (pattern.indexOf('/') === 0) break;
      }

      return '/' + parentPattern;
    }
  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
     true ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Redirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = Redirect;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createRouterObject = createRouterObject;
exports.assignRouterState = assignRouterState;
function createRouterObject(history, transitionManager, state) {
  var router = _extends({}, history, {
    setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
    isActive: transitionManager.isActive
  });

  return assignRouterState(router, state);
}

function assignRouterState(router, _ref) {
  var location = _ref.location,
      params = _ref.params,
      routes = _ref.routes;

  router.location = location;
  router.params = params;
  router.routes = routes;

  return router;
}

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = createMemoryHistory;

var _useQueries = __webpack_require__(133);

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = __webpack_require__(132);

var _useBasename2 = _interopRequireDefault(_useBasename);

var _createMemoryHistory = __webpack_require__(1223);

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMemoryHistory(options) {
  // signatures and type checking differ between `useQueries` and
  // `createMemoryHistory`, have to create `memoryHistory` first because
  // `useQueries` doesn't understand the signature
  var memoryHistory = (0, _createMemoryHistory2.default)(options);
  var createHistory = function createHistory() {
    return memoryHistory;
  };
  var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
  return history;
}
module.exports = exports['default'];

/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (createHistory) {
  var history = void 0;
  if (canUseDOM) history = (0, _useRouterHistory2.default)(createHistory)();
  return history;
};

var _useRouterHistory = __webpack_require__(191);

var _useRouterHistory2 = _interopRequireDefault(_useRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

module.exports = exports['default'];

/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createTransitionManager;

var _routerWarning = __webpack_require__(39);

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _computeChangedRoutes2 = __webpack_require__(1427);

var _computeChangedRoutes3 = _interopRequireDefault(_computeChangedRoutes2);

var _TransitionUtils = __webpack_require__(1424);

var _isActive2 = __webpack_require__(1431);

var _isActive3 = _interopRequireDefault(_isActive2);

var _getComponents = __webpack_require__(1428);

var _getComponents2 = _interopRequireDefault(_getComponents);

var _matchRoutes = __webpack_require__(1433);

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasAnyProperties(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return true;
  }return false;
}

function createTransitionManager(history, routes) {
  var state = {};

  // Signature should be (location, indexOnly), but needs to support (path,
  // query, indexOnly)
  function isActive(location, indexOnly) {
    location = history.createLocation(location);

    return (0, _isActive3.default)(location, indexOnly, state.location, state.routes, state.params);
  }

  var partialNextState = void 0;

  function match(location, callback) {
    if (partialNextState && partialNextState.location === location) {
      // Continue from where we left off.
      finishMatch(partialNextState, callback);
    } else {
      (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
        if (error) {
          callback(error);
        } else if (nextState) {
          finishMatch(_extends({}, nextState, { location: location }), callback);
        } else {
          callback();
        }
      });
    }
  }

  function finishMatch(nextState, callback) {
    var _computeChangedRoutes = (0, _computeChangedRoutes3.default)(state, nextState),
        leaveRoutes = _computeChangedRoutes.leaveRoutes,
        changeRoutes = _computeChangedRoutes.changeRoutes,
        enterRoutes = _computeChangedRoutes.enterRoutes;

    (0, _TransitionUtils.runLeaveHooks)(leaveRoutes, state);

    // Tear down confirmation hooks for left routes
    leaveRoutes.filter(function (route) {
      return enterRoutes.indexOf(route) === -1;
    }).forEach(removeListenBeforeHooksForRoute);

    // change and enter hooks are run in series
    (0, _TransitionUtils.runChangeHooks)(changeRoutes, state, nextState, function (error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      (0, _TransitionUtils.runEnterHooks)(enterRoutes, nextState, finishEnterHooks);
    });

    function finishEnterHooks(error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      // TODO: Fetch components after state is updated.
      (0, _getComponents2.default)(nextState, function (error, components) {
        if (error) {
          callback(error);
        } else {
          // TODO: Make match a pure function and have some other API
          // for "match and update state".
          callback(null, null, state = _extends({}, nextState, { components: components }));
        }
      });
    }

    function handleErrorOrRedirect(error, redirectInfo) {
      if (error) callback(error);else callback(null, redirectInfo);
    }
  }

  var RouteGuid = 1;

  function getRouteID(route) {
    var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return route.__id__ || create && (route.__id__ = RouteGuid++);
  }

  var RouteHooks = Object.create(null);

  function getRouteHooksForRoutes(routes) {
    return routes.map(function (route) {
      return RouteHooks[getRouteID(route)];
    }).filter(function (hook) {
      return hook;
    });
  }

  function transitionHook(location, callback) {
    (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
      if (nextState == null) {
        // TODO: We didn't actually match anything, but hang
        // onto error/nextState so we don't have to matchRoutes
        // again in the listen callback.
        callback();
        return;
      }

      // Cache some state here so we don't have to
      // matchRoutes() again in the listen callback.
      partialNextState = _extends({}, nextState, { location: location });

      var hooks = getRouteHooksForRoutes((0, _computeChangedRoutes3.default)(state, partialNextState).leaveRoutes);

      var result = void 0;
      for (var i = 0, len = hooks.length; result == null && i < len; ++i) {
        // Passing the location arg here indicates to
        // the user that this is a transition hook.
        result = hooks[i](location);
      }

      callback(result);
    });
  }

  /* istanbul ignore next: untestable with Karma */
  function beforeUnloadHook() {
    // Synchronously check to see if any route hooks want
    // to prevent the current window/tab from closing.
    if (state.routes) {
      var hooks = getRouteHooksForRoutes(state.routes);

      var message = void 0;
      for (var i = 0, len = hooks.length; typeof message !== 'string' && i < len; ++i) {
        // Passing no args indicates to the user that this is a
        // beforeunload hook. We don't know the next location.
        message = hooks[i]();
      }

      return message;
    }
  }

  var unlistenBefore = void 0,
      unlistenBeforeUnload = void 0;

  function removeListenBeforeHooksForRoute(route) {
    var routeID = getRouteID(route);
    if (!routeID) {
      return;
    }

    delete RouteHooks[routeID];

    if (!hasAnyProperties(RouteHooks)) {
      // teardown transition & beforeunload hooks
      if (unlistenBefore) {
        unlistenBefore();
        unlistenBefore = null;
      }

      if (unlistenBeforeUnload) {
        unlistenBeforeUnload();
        unlistenBeforeUnload = null;
      }
    }
  }

  /**
   * Registers the given hook function to run before leaving the given route.
   *
   * During a normal transition, the hook function receives the next location
   * as its only argument and can return either a prompt message (string) to show the user,
   * to make sure they want to leave the page; or `false`, to prevent the transition.
   * Any other return value will have no effect.
   *
   * During the beforeunload event (in browsers) the hook receives no arguments.
   * In this case it must return a prompt message to prevent the transition.
   *
   * Returns a function that may be used to unbind the listener.
   */
  function listenBeforeLeavingRoute(route, hook) {
    var thereWereNoRouteHooks = !hasAnyProperties(RouteHooks);
    var routeID = getRouteID(route, true);

    RouteHooks[routeID] = hook;

    if (thereWereNoRouteHooks) {
      // setup transition & beforeunload hooks
      unlistenBefore = history.listenBefore(transitionHook);

      if (history.listenBeforeUnload) unlistenBeforeUnload = history.listenBeforeUnload(beforeUnloadHook);
    }

    return function () {
      removeListenBeforeHooksForRoute(route);
    };
  }

  /**
   * This is the API for stateful environments. As the location
   * changes, we update state and call the listener. We can also
   * gracefully handle errors and redirects.
   */
  function listen(listener) {
    function historyListener(location) {
      if (state.location === location) {
        listener(null, state);
      } else {
        match(location, function (error, redirectLocation, nextState) {
          if (error) {
            listener(error);
          } else if (redirectLocation) {
            history.replace(redirectLocation);
          } else if (nextState) {
            listener(null, nextState);
          } else {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'Location "%s" did not match any routes', location.pathname + location.search + location.hash) : void 0;
          }
        });
      }
    }

    // TODO: Only use a single history listener. Otherwise we'll end up with
    // multiple concurrent calls to match.

    // Set up the history listener first in case the initial match redirects.
    var unsubscribe = history.listen(historyListener);

    if (state.location) {
      // Picking up on a matchContext.
      listener(null, state);
    } else {
      historyListener(history.getCurrentLocation());
    }

    return unsubscribe;
  }

  return {
    isActive: isActive,
    match: match,
    listenBeforeLeavingRoute: listenBeforeLeavingRoute,
    listen: listen
  };
}
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 191:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = useRouterHistory;

var _useQueries = __webpack_require__(133);

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = __webpack_require__(132);

var _useBasename2 = _interopRequireDefault(_useBasename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useRouterHistory(createHistory) {
  return function (options) {
    var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
    return history;
  };
}
module.exports = exports['default'];

/***/ },

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(27);

var _reduxForm = __webpack_require__(54);

var _FilterCriteriaReducer = __webpack_require__(239);

var _FilterCriteriaReducer2 = _interopRequireDefault(_FilterCriteriaReducer);

var _ArtistsReducer = __webpack_require__(237);

var _ArtistsReducer2 = _interopRequireDefault(_ArtistsReducer);

var _ErrorReducer = __webpack_require__(238);

var _ErrorReducer2 = _interopRequireDefault(_ErrorReducer);

var _SelectionReducer = __webpack_require__(240);

var _SelectionReducer2 = _interopRequireDefault(_SelectionReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  form: _reduxForm.reducer,
  filterCriteria: _FilterCriteriaReducer2.default,
  artists: _ArtistsReducer2.default,
  errors: _ErrorReducer2.default,
  selection: _SelectionReducer2.default
});

/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(52);

var _Home = __webpack_require__(225);

var _Home2 = _interopRequireDefault(_Home);

var _ArtistMain = __webpack_require__(231);

var _ArtistMain2 = _interopRequireDefault(_ArtistMain);

var _ArtistDetail = __webpack_require__(227);

var _ArtistDetail2 = _interopRequireDefault(_ArtistDetail);

var _ArtistCreate = __webpack_require__(226);

var _ArtistCreate2 = _interopRequireDefault(_ArtistCreate);

var _ArtistEdit = __webpack_require__(228);

var _ArtistEdit2 = _interopRequireDefault(_ArtistEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes() {
  return _react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    _react2.default.createElement(
      _reactRouter.Route,
      { path: '/', component: _Home2.default },
      _react2.default.createElement(_reactRouter.IndexRoute, { component: _ArtistMain2.default }),
      _react2.default.createElement(_reactRouter.Route, { path: 'artists/new', component: _ArtistCreate2.default }),
      _react2.default.createElement(_reactRouter.Route, { path: 'artists/:id', component: _ArtistDetail2.default }),
      _react2.default.createElement(_reactRouter.Route, { path: 'artists/:id/edit', component: _ArtistEdit2.default })
    )
  );
};

exports.default = Routes;

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports.createPath = exports.parsePath = exports.getQueryStringValueFromPath = exports.stripQueryStringValueFromPath = exports.addQueryStringValueToPath = undefined;

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addQueryStringValueToPath = exports.addQueryStringValueToPath = function addQueryStringValueToPath(path, key, value) {
  var _parsePath = parsePath(path),
      pathname = _parsePath.pathname,
      search = _parsePath.search,
      hash = _parsePath.hash;

  return createPath({
    pathname: pathname,
    search: search + (search.indexOf('?') === -1 ? '?' : '&') + key + '=' + value,
    hash: hash
  });
};

var stripQueryStringValueFromPath = exports.stripQueryStringValueFromPath = function stripQueryStringValueFromPath(path, key) {
  var _parsePath2 = parsePath(path),
      pathname = _parsePath2.pathname,
      search = _parsePath2.search,
      hash = _parsePath2.hash;

  return createPath({
    pathname: pathname,
    search: search.replace(new RegExp('([?&])' + key + '=[a-zA-Z0-9]+(&?)'), function (match, prefix, suffix) {
      return prefix === '?' ? prefix : suffix;
    }),
    hash: hash
  });
};

var getQueryStringValueFromPath = exports.getQueryStringValueFromPath = function getQueryStringValueFromPath(path, key) {
  var _parsePath3 = parsePath(path),
      search = _parsePath3.search;

  var match = search.match(new RegExp('[?&]' + key + '=([a-zA-Z0-9]+)'));
  return match && match[1];
};

var extractPath = function extractPath(string) {
  var match = string.match(/^(https?:)?\/\/[^\/]*/);
  return match == null ? string : string.substring(match[0].length);
};

var parsePath = exports.parsePath = function parsePath(path) {
  var pathname = extractPath(path);
  var search = '';
  var hash = '';

  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(path === pathname, 'A path must be pathname + search + hash only, not a full URL like "%s"', path) : void 0;

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex);
    pathname = pathname.substring(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex);
    pathname = pathname.substring(0, searchIndex);
  }

  if (pathname === '') pathname = '/';

  return {
    pathname: pathname,
    search: search,
    hash: hash
  };
};

var createPath = exports.createPath = function createPath(location) {
  if (location == null || typeof location === 'string') return location;

  var basename = location.basename,
      pathname = location.pathname,
      search = location.search,
      hash = location.hash;

  var path = (basename || '') + pathname;

  if (search && search !== '?') path += search;

  if (hash) path += hash;

  return path;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(241);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(124)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./materialize.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./materialize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(242);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(124)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./react-range.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./react-range.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 212:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(243);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(124)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var GENRES = exports.GENRES = ['Acceptable Country', 'Acceptable Emo', 'Acceptable Pop', 'Acceptable Pop-Punk', 'Alt-Country', 'Alt-Rap', 'Bloghaus', 'Blog Rap', 'Blog Rock', 'Cold Wave', 'Cool Jazz', 'Digital Punk', 'Doom Metal', 'Freak Folk', 'Garage Rock', 'Hypnagogic Pop', 'Noise Pop', 'Power Electronics', 'Serialism', 'Witch House', 'Ye Olde Timey Rock And Roll Music of Indeterminate Hipster Variety'];

/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Create a single artist in the artist collection.
 * @param {object} artistProps - Object containing a name, age, yearsActive, and genre
 * @return {promise} A promise that resolves with the Artist that was created
 */
module.exports = function (artistProps) {
  var artist = _.extend({}, artistProps, {
    _id: _.uniqueId(),
    age: parseInt(artistProps.age) || 20,
    yearsActive: parseInt(artistProps.yearsActive) || 5
  });
  db.push(artist);

  return new Promise(function (resolve, reject) {
    resolve(artist);
  });
};

/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Deletes a single artist from the Artists collection
 * @param {string} _id - The ID of the artist to delete.
 * @return {promise} A promise that resolves when the record is deleted
 */
module.exports = function (_id) {
  _.each(db, function (artist, index) {
    if (artist && artist._id === _id) {
      db.splice(index, 1);
    }
  });

  return new Promise(function (resolve, reject) {
    return resolve();
  });
};

/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Edits a single artist in the Artists collection
 * @param {string} _id - The ID of the artist to edit.
 * @param {object} artistProps - An object with a name, age, yearsActive, and genre
 * @return {promise} A promise that resolves when the record is edited
 */
module.exports = function (_id, artistProps) {
  var artist = _.find(db, function (a) {
    return a._id === _id;
  });
  _.extend(artist, artistProps);

  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Finds a single artist in the artist collection.
 * @param {string} _id - The ID of the record to find.
 * @return {promise} A promise that resolves with the Artist that matches the id
 */
module.exports = function (_id) {
  var artist = _.find(db, function (a) {
    return a._id === _id;
  });

  return new Promise(function (resolve, reject) {
    resolve(artist);
  });
};

/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Finds the lowest and highest age of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max ages, like { min: 16, max: 45 }.
 */
module.exports = function () {
  return new Promise(function (resolve, reject) {
    var range = {
      max: _.maxBy(db, function (a) {
        return a.age;
      }).age,
      min: _.minBy(db, function (a) {
        return a.age;
      }).age
    };

    resolve(range);
  });
};

/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Finds the lowest and highest yearsActive of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max yearsActive, like { min: 0, max: 14 }.
 */
module.exports = function () {
  return new Promise(function (resolve, reject) {
    var range = {
      max: _.maxBy(db, function (a) {
        return a.yearsActive;
      }).yearsActive,
      min: _.minBy(db, function (a) {
        return a.yearsActive;
      }).yearsActive
    };

    resolve(range);
  });
};

/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = function (_criteria, sortProperty) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;

  var criteria = _.extend({
    age: { min: 0, max: 100 },
    yearsActive: { min: 0, max: 100 },
    name: ''
  }, _criteria);

  var artists = _.chain(db).filter(function (a) {
    return _.includes(_.lowerCase(a.name), _.lowerCase(criteria.name));
  }).filter(function (a) {
    return a.age > criteria.age.min && a.age < criteria.age.max;
  }).filter(function (a) {
    return a.yearsActive > criteria.yearsActive.min && a.yearsActive < criteria.yearsActive.max;
  }).sortBy(function (a) {
    return a[sortProperty];
  }).value();

  return new Promise(function (resolve, reject) {
    resolve(artists);
  });
};

/***/ },

/***/ 222:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Sets a group of Artists as not retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = function (_ids) {
  return new Promise(function (resolve, reject) {
    var artists = _.chain(_ids).map(function (_id) {
      return _.find(db, function (a) {
        return a._id === _id;
      });
    }).tap(function (ids) {
      return console.log(ids);
    }).compact().each(function (a) {
      return a.retired = false;
    }).value();

    resolve();
  });
};

/***/ },

/***/ 223:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(8);
var Artist = __webpack_require__(16);
var db = __webpack_require__(15);

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = function (_ids) {
  return new Promise(function (resolve, reject) {
    var artists = _.chain(_ids).map(function (_id) {
      return _.find(db, function (a) {
        return a._id === _id;
      });
    }).compact().each(function (a) {
      return a.retired = true;
    }).value();

    resolve(artists);
  });
};

/***/ },

/***/ 224:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var db = __webpack_require__(15);

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header(props) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

    _this.state = { id: null };
    return _this;
  }

  _createClass(Header, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setLink();
    }
  }, {
    key: 'setLink',
    value: function setLink() {
      var index = _.random(0, db.length);
      this.setState({ id: index });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'nav',
          null,
          _react2.default.createElement(
            'div',
            { className: 'nav-wrapper' },
            _react2.default.createElement(
              'div',
              { className: 'col s12' },
              _react2.default.createElement(
                'a',
                { href: '#', className: 'brand-logo' },
                'UpStar Music'
              ),
              _react2.default.createElement(
                'ul',
                { id: 'nav-mobile', className: 'right hide-on-med-and-down' },
                _react2.default.createElement(
                  'li',
                  null,
                  _react2.default.createElement(
                    _reactRouter.Link,
                    {
                      to: '/artists/' + this.state.id,
                      onClick: this.setLink.bind(this)
                    },
                    'Random Artist'
                  )
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  _react2.default.createElement(
                    _reactRouter.Link,
                    { to: '/artists/new' },
                    'Create Artist'
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Header;
}(_react.Component);

;

exports.default = Header;

/***/ },

/***/ 225:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(224);

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home(_ref) {
  var children = _ref.children;

  return _react2.default.createElement(
    'div',
    { className: 'container' },
    _react2.default.createElement(_Header2.default, null),
    children
  );
};

exports.default = Home;

/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(10);

var _reduxForm = __webpack_require__(54);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArtistCreate = function (_Component) {
  _inherits(ArtistCreate, _Component);

  function ArtistCreate() {
    _classCallCheck(this, ArtistCreate);

    return _possibleConstructorReturn(this, (ArtistCreate.__proto__ || Object.getPrototypeOf(ArtistCreate)).apply(this, arguments));
  }

  _createClass(ArtistCreate, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.clearError();
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(formProps) {
      this.props.createArtist(formProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var handleSubmit = this.props.handleSubmit;


      return _react2.default.createElement(
        'form',
        { onSubmit: handleSubmit(this.onSubmit.bind(this)) },
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement(_reduxForm.Field, { name: 'name', component: 'input', placeholder: 'Name' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement(_reduxForm.Field, { name: 'age', component: 'input', placeholder: 'Age' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement(_reduxForm.Field, { name: 'yearsActive', component: 'input', placeholder: 'Years Active' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement(_reduxForm.Field, { name: 'genre', component: 'input', placeholder: 'Genre' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'has-error' },
          this.props.errorMessage
        ),
        _react2.default.createElement(
          'button',
          { className: 'btn' },
          'Submit'
        )
      );
    }
  }]);

  return ArtistCreate;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    errorMessage: state.errors
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)((0, _reduxForm.reduxForm)({
  form: 'create'
})(ArtistCreate));

/***/ },

/***/ 227:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(10);

var _reactRouter = __webpack_require__(52);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArtistDetail = function (_Component) {
  _inherits(ArtistDetail, _Component);

  function ArtistDetail() {
    _classCallCheck(this, ArtistDetail);

    return _possibleConstructorReturn(this, (ArtistDetail.__proto__ || Object.getPrototypeOf(ArtistDetail)).apply(this, arguments));
  }

  _createClass(ArtistDetail, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.findArtist(this.props.params.id);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.params.id !== this.props.params.id) {
        this.props.findArtist(nextProps.params.id);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.resetArtist();
    }
  }, {
    key: 'onDeleteClick',
    value: function onDeleteClick() {
      this.props.deleteArtist(this.props.params.id);
    }
  }, {
    key: 'renderAlbums',
    value: function renderAlbums() {
      var albums = this.props.artist.albums;


      if (!albums || !albums.map) {
        return;
      }

      return albums.map(function (album) {
        return _react2.default.createElement(
          'div',
          { className: 'card album', key: album.title },
          _react2.default.createElement(
            'div',
            { className: 'card-image' },
            _react2.default.createElement('img', { src: album.image }),
            _react2.default.createElement(
              'span',
              { className: 'card-title' },
              _react2.default.createElement(
                'h4',
                null,
                album.title
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'card-content' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'h5',
                null,
                album.copiesSold
              ),
              _react2.default.createElement(
                'i',
                null,
                'copies sold'
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'h5',
                null,
                album.numberTracks
              ),
              _react2.default.createElement(
                'i',
                null,
                'tracks'
              )
            )
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.artist) {
        return _react2.default.createElement(
          'div',
          null,
          'Todo: implement "FindArtist" query'
        );
      }

      var _props$artist = this.props.artist,
          name = _props$artist.name,
          age = _props$artist.age,
          genre = _props$artist.genre,
          image = _props$artist.image,
          yearsActive = _props$artist.yearsActive,
          netWorth = _props$artist.netWorth,
          labelName = _props$artist.labelName,
          _id = _props$artist._id;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'spacer' },
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/' },
            'Back'
          ),
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/artists/' + _id + '/edit' },
            'Edit'
          ),
          _react2.default.createElement(
            'a',
            { onClick: this.onDeleteClick.bind(this) },
            'Delete'
          )
        ),
        _react2.default.createElement(
          'ul',
          { className: 'collection artist-detail' },
          _react2.default.createElement(
            'li',
            { className: 'collection-item header' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'h3',
                null,
                name
              ),
              _react2.default.createElement(
                'h5',
                null,
                'Master of ',
                genre
              )
            ),
            _react2.default.createElement('image', { src: image, className: 'right' })
          ),
          _react2.default.createElement(
            'li',
            { className: 'collection-item' },
            _react2.default.createElement(
              'h5',
              null,
              yearsActive
            ),
            _react2.default.createElement(
              'p',
              null,
              _react2.default.createElement(
                'i',
                null,
                'Years Active'
              )
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'collection-item' },
            _react2.default.createElement(
              'h5',
              null,
              age
            ),
            _react2.default.createElement(
              'p',
              null,
              _react2.default.createElement(
                'i',
                null,
                'Years Old'
              )
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'collection-item' },
            _react2.default.createElement(
              'h5',
              null,
              '$',
              netWorth
            ),
            _react2.default.createElement(
              'p',
              null,
              _react2.default.createElement(
                'i',
                null,
                'Net Worth'
              )
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'collection-item' },
            _react2.default.createElement(
              'h5',
              null,
              labelName
            ),
            _react2.default.createElement(
              'p',
              null,
              _react2.default.createElement(
                'i',
                null,
                'Label'
              )
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'flex wrap' },
            this.renderAlbums()
          )
        )
      );
    }
  }]);

  return ArtistDetail;
}(_react.Component);

var mapStateToProps = function mapStateToProps(_ref) {
  var artists = _ref.artists;

  return { artist: artists.artist };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)(ArtistDetail);

/***/ },

/***/ 228:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(10);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArtistEdit = function (_Component) {
  _inherits(ArtistEdit, _Component);

  function ArtistEdit(props) {
    _classCallCheck(this, ArtistEdit);

    var _this = _possibleConstructorReturn(this, (ArtistEdit.__proto__ || Object.getPrototypeOf(ArtistEdit)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(ArtistEdit, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.findArtist(this.props.params.id);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var artist = _ref.artist;

      if (artist) {
        var name = artist.name,
            age = artist.age,
            yearsActive = artist.yearsActive,
            genre = artist.genre;


        this.setState({ name: name, age: age, yearsActive: yearsActive, genre: genre });
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (nextProps.params.id !== this.props.params.id) {
        this.props.findArtist(nextProps.params.id);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.clearError();
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      this.props.editArtist(this.props.params.id, this.state);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'form',
        { onSubmit: this.onSubmit.bind(this) },
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement('input', {
            value: this.state.name,
            onChange: function onChange(e) {
              return _this2.setState({ name: e.target.value });
            },
            placeholder: 'Name'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement('input', {
            value: this.state.age,
            onChange: function onChange(e) {
              return _this2.setState({ age: e.target.value });
            },
            placeholder: 'Age'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement('input', {
            value: this.state.yearsActive,
            onChange: function onChange(e) {
              return _this2.setState({ yearsActive: e.target.value });
            },
            placeholder: 'Years Active'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'input-field' },
          _react2.default.createElement('input', {
            value: this.state.genre,
            onChange: function onChange(e) {
              return _this2.setState({ genre: e.target.value });
            },
            placeholder: 'Genre'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'has-error' },
          this.props.errorMessage
        ),
        _react2.default.createElement(
          'button',
          { className: 'btn' },
          'Submit'
        )
      );
    }
  }]);

  return ArtistEdit;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    artist: state.artists.artist,
    errorMessage: state.errors
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)(ArtistEdit);

/***/ },

/***/ 229:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__(54);

var _reactRedux = __webpack_require__(10);

var _filters = __webpack_require__(236);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TEXT_FIELDS = [{ label: 'Name', prop: 'name' }];

var ArtistFilter = function (_Component) {
  _inherits(ArtistFilter, _Component);

  function ArtistFilter() {
    _classCallCheck(this, ArtistFilter);

    return _possibleConstructorReturn(this, (ArtistFilter.__proto__ || Object.getPrototypeOf(ArtistFilter)).apply(this, arguments));
  }

  _createClass(ArtistFilter, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.filters) {
        var criteria = _lodash2.default.extend({}, { name: '' }, this.props.filters);
        this.props.searchArtists(criteria);
      } else {
        this.props.searchArtists({
          name: '',
          sort: 'name'
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.setAgeRange();
      this.props.setYearsActiveRange();
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(formProps) {
      var criteria = _lodash2.default.extend({ name: '' }, formProps);
      this.props.searchArtists(criteria);
    }
  }, {
    key: 'renderInputs',
    value: function renderInputs() {
      return TEXT_FIELDS.map(function (_ref) {
        var label = _ref.label,
            prop = _ref.prop;
        return _react2.default.createElement(
          'div',
          { className: 'input-field', key: prop },
          _react2.default.createElement(_reduxForm.Field, {
            placeholder: label,
            id: prop,
            name: prop,
            component: 'input',
            type: 'text'
          })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var handleSubmit = this.props.handleSubmit;


      return _react2.default.createElement(
        'div',
        { className: 'card blue-grey darken-1 row' },
        _react2.default.createElement(
          'div',
          { className: 'card-content white-text' },
          _react2.default.createElement(
            'form',
            { onSubmit: handleSubmit(this.handleSubmit.bind(this)) },
            _react2.default.createElement(
              'div',
              { className: 'center-align card-title' },
              'Search'
            ),
            this.renderInputs(),
            _react2.default.createElement(
              'div',
              { className: 'input-field' },
              _react2.default.createElement(_reduxForm.Field, {
                id: 'age',
                label: 'Age',
                component: _filters.Range,
                type: 'text',
                name: 'age',
                range: this.props.ageRange
              })
            ),
            _react2.default.createElement(
              'div',
              { className: 'input-field' },
              _react2.default.createElement(_reduxForm.Field, {
                id: 'years-active',
                label: 'Years Active',
                component: _filters.Range,
                type: 'text',
                name: 'yearsActive',
                range: this.props.yearsActive
              })
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'label',
                { className: 'select', htmlFor: 'sort' },
                'Sort By'
              ),
              _react2.default.createElement(
                _reduxForm.Field,
                { id: 'sort', name: 'sort', component: 'select' },
                _react2.default.createElement(
                  'option',
                  { value: 'name' },
                  'Name'
                ),
                _react2.default.createElement(
                  'option',
                  { value: 'age' },
                  'Age'
                ),
                _react2.default.createElement(
                  'option',
                  { value: 'albums' },
                  'Albums Released'
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'center-align' },
              _react2.default.createElement(
                'button',
                { className: 'btn' },
                'Submit'
              )
            )
          )
        )
      );
    }
  }]);

  return ArtistFilter;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
  var filterCriteria = state.filterCriteria;


  return {
    yearsActive: filterCriteria.yearsActive,
    ageRange: filterCriteria.age,
    filters: state.form.filters && state.form.filters.values
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)((0, _reduxForm.reduxForm)({
  destroyOnUnmount: false,
  form: 'filters',
  initialValues: { sort: 'name' }
})(ArtistFilter));

/***/ },

/***/ 230:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(52);

var _reactRedux = __webpack_require__(10);

var _Paginator = __webpack_require__(232);

var _Paginator2 = _interopRequireDefault(_Paginator);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArtistIndex = function (_Component) {
  _inherits(ArtistIndex, _Component);

  function ArtistIndex() {
    _classCallCheck(this, ArtistIndex);

    return _possibleConstructorReturn(this, (ArtistIndex.__proto__ || Object.getPrototypeOf(ArtistIndex)).apply(this, arguments));
  }

  _createClass(ArtistIndex, [{
    key: 'onChange',
    value: function onChange(_id) {
      if (_lodash2.default.includes(this.props.selection, _id)) {
        this.props.deselectArtist(_id);
      } else {
        this.props.selectArtist(_id);
      }
    }
  }, {
    key: 'renderList',
    value: function renderList(artist) {
      var _this2 = this;

      var _id = artist._id;

      var classes = 'collection-item avatar ' + (artist.retired && 'retired');

      return _react2.default.createElement(
        'li',
        { className: classes, key: _id },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', {
            id: _id,
            type: 'checkbox',
            checked: _lodash2.default.includes(this.props.selection, _id),
            onChange: function onChange() {
              return _this2.onChange(_id);
            }
          }),
          _react2.default.createElement('label', { htmlFor: _id })
        ),
        _react2.default.createElement('img', { src: artist.image, className: 'circle' }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'span',
            { className: 'title' },
            _react2.default.createElement(
              'strong',
              null,
              artist.name
            )
          ),
          _react2.default.createElement(
            'p',
            null,
            _react2.default.createElement(
              'b',
              null,
              artist.age
            ),
            ' years old',
            _react2.default.createElement('br', null),
            artist.albums ? artist.albums.length : 0,
            ' albums released'
          )
        ),
        _react2.default.createElement(
          _reactRouter.Link,
          { to: 'artists/' + artist._id, className: 'secondary-content' },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            '>'
          )
        )
      );
    }
  }, {
    key: 'renderPaginator',
    value: function renderPaginator() {
      if (this.props.artists.all.length) {
        return _react2.default.createElement(_Paginator2.default, null);
      }
    }
  }, {
    key: 'renderEmptyCollection',
    value: function renderEmptyCollection() {
      if (this.props.artists.all.length) {
        return;
      }

      return _react2.default.createElement(
        'div',
        { className: 'center-align' },
        _react2.default.createElement(
          'h5',
          null,
          'No records found!'
        ),
        _react2.default.createElement(
          'div',
          null,
          'Try searching again'
        )
      );
    }
  }, {
    key: 'renderRetire',
    value: function renderRetire() {
      var _this3 = this;

      if (this.props.selection.length) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'button',
            {
              className: 'btn',
              onClick: function onClick() {
                return _this3.props.setRetired(_this3.props.selection);
              }
            },
            'Retire'
          ),
          _react2.default.createElement(
            'button',
            {
              className: 'btn',
              onClick: function onClick() {
                return _this3.props.setNotRetired(_this3.props.selection);
              }
            },
            'Unretire'
          )
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.renderRetire(),
        _react2.default.createElement(
          'ul',
          { className: 'collection' },
          this.props.artists.all.map(this.renderList.bind(this)),
          this.renderEmptyCollection()
        ),
        this.renderPaginator()
      );
    }
  }]);

  return ArtistIndex;
}(_react.Component);

var mapStateToProps = function mapStateToProps(_ref) {
  var artists = _ref.artists,
      selection = _ref.selection;
  return { artists: artists, selection: selection };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)(ArtistIndex);

/***/ },

/***/ 231:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _ArtistFilter = __webpack_require__(229);

var _ArtistFilter2 = _interopRequireDefault(_ArtistFilter);

var _ArtistIndex = __webpack_require__(230);

var _ArtistIndex2 = _interopRequireDefault(_ArtistIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArtistMain = function (_Component) {
  _inherits(ArtistMain, _Component);

  function ArtistMain() {
    _classCallCheck(this, ArtistMain);

    return _possibleConstructorReturn(this, (ArtistMain.__proto__ || Object.getPrototypeOf(ArtistMain)).apply(this, arguments));
  }

  _createClass(ArtistMain, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col s4' },
          _react2.default.createElement(_ArtistFilter2.default, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'col s8' },
          _react2.default.createElement(_ArtistIndex2.default, null)
        )
      );
    }
  }]);

  return ArtistMain;
}(_react.Component);

exports.default = ArtistMain;

/***/ },

/***/ 232:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(10);

var _actions = __webpack_require__(33);

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Paginator = function (_Component) {
  _inherits(Paginator, _Component);

  function Paginator() {
    _classCallCheck(this, Paginator);

    return _possibleConstructorReturn(this, (Paginator.__proto__ || Object.getPrototypeOf(Paginator)).apply(this, arguments));
  }

  _createClass(Paginator, [{
    key: 'back',
    value: function back() {
      var _props = this.props,
          offset = _props.offset,
          limit = _props.limit,
          values = _props.form.filters.values;


      if (offset === 0) {
        return;
      }

      this.props.searchArtists(values, offset - 10, limit);
    }
  }, {
    key: 'advance',
    value: function advance() {
      var _props2 = this.props,
          offset = _props2.offset,
          limit = _props2.limit,
          count = _props2.count,
          values = _props2.form.filters.values;


      if (offset + limit > count) {
        return;
      }

      this.props.searchArtists(values, offset + 10, limit);
    }
  }, {
    key: 'left',
    value: function left() {
      return _react2.default.createElement(
        'li',
        { className: this.props.offset === 0 ? 'disabled' : '' },
        _react2.default.createElement(
          'a',
          { onClick: this.back.bind(this) },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'chevron_left'
          )
        )
      );
    }
  }, {
    key: 'right',
    value: function right() {
      var _props3 = this.props,
          offset = _props3.offset,
          limit = _props3.limit,
          count = _props3.count;


      var end = offset + limit >= count ? true : false;

      return _react2.default.createElement(
        'li',
        { className: end ? 'disabled' : '' },
        _react2.default.createElement(
          'a',
          { onClick: this.advance.bind(this) },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'chevron_right'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'center-align' },
        _react2.default.createElement(
          'ul',
          { className: 'pagination' },
          this.left(),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'a',
              null,
              'Page ',
              this.props.offset / 10 + 1
            )
          ),
          this.right()
        ),
        this.props.count,
        ' Records Found'
      );
    }
  }]);

  return Paginator;
}(_react.Component);

var mapStateToProps = function mapStateToProps(_ref) {
  var artists = _ref.artists,
      form = _ref.form;
  var limit = artists.limit,
      offset = artists.offset,
      count = artists.count;


  return { limit: limit, offset: offset, count: count, form: form };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, actions)(Paginator);

/***/ },

/***/ 233:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Picker = undefined;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Picker = function Picker() {
  return _react2.default.createElement(
    'div',
    null,
    'Picker'
  );
};

exports.Picker = Picker;

/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Range = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactInputRange = __webpack_require__(126);

var _reactInputRange2 = _interopRequireDefault(_reactInputRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Range = function (_Component) {
  _inherits(Range, _Component);

  function Range() {
    _classCallCheck(this, Range);

    return _possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
  }

  _createClass(Range, [{
    key: 'onChange',
    value: function onChange(component, values) {
      var onChange = this.props.input.onChange;


      onChange(values);
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.props.input.value;


      return _react2.default.createElement(
        'div',
        { className: 'range-slider' },
        _react2.default.createElement(
          'label',
          null,
          this.props.label
        ),
        _react2.default.createElement(_reactInputRange2.default, {
          onChange: this.onChange.bind(this),
          minValue: parseInt(this.props.range.min),
          maxValue: parseInt(this.props.range.max),
          value: value || this.props.range
        })
      );
    }
  }]);

  return Range;
}(_react.Component);

;

Range.defaultProps = {
  range: { min: 0, max: 100 }
};

exports.Range = Range;

/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = undefined;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Switch = function Switch() {
  return _react2.default.createElement(
    'div',
    null,
    'Switch'
  );
};

exports.Switch = Switch;

/***/ },

/***/ 236:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Picker = __webpack_require__(233);

Object.keys(_Picker).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Picker[key];
    }
  });
});

var _Range = __webpack_require__(234);

Object.keys(_Range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Range[key];
    }
  });
});

var _Switch = __webpack_require__(235);

Object.keys(_Switch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Switch[key];
    }
  });
});

/***/ },

/***/ 237:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _types = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
  all: [],
  offset: 0,
  limit: 20,
  count: 0
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];

  switch (action.type) {
    case _types.SEARCH_ARTISTS:
      return _lodash2.default.extend({}, state, {
        count: action.payload.length,
        all: action.payload
      });
    case _types.FIND_ARTIST:
      return _lodash2.default.extend({}, state, { artist: action.payload });
    case _types.RESET_ARTIST:
      return _lodash2.default.extend({}, state, { artist: null });
    default:
      return state;
  }
};

/***/ },

/***/ 238:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = __webpack_require__(41);

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var action = arguments[1];

  switch (action.type) {
    case _types.CREATE_ERROR:
      return 'There was an error inserting this record';
    case _types.CLEAR_ERROR:
      return '';
    default:
      return state;
  }
};

/***/ },

/***/ 239:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _types = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
  age: { min: 0, max: 100 }
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];

  switch (action.type) {
    case _types.SET_AGE_RANGE:
      return _lodash2.default.extend({}, state, { age: action.payload });
    case _types.SET_YEARS_ACTIVE_RANGE:
      return _lodash2.default.extend({}, state, { yearsActive: action.payload });
    default:
      return state;
  }
};

/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isReactChildren = isReactChildren;
exports.createRouteFromReactElement = createRouteFromReactElement;
exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
exports.createRoutes = createRoutes;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidChild(object) {
  return object == null || _react2.default.isValidElement(object);
}

function isReactChildren(object) {
  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
}

function createRoute(defaultProps, props) {
  return _extends({}, defaultProps, props);
}

function createRouteFromReactElement(element) {
  var type = element.type;
  var route = createRoute(type.defaultProps, element.props);

  if (route.children) {
    var childRoutes = createRoutesFromReactChildren(route.children, route);

    if (childRoutes.length) route.childRoutes = childRoutes;

    delete route.children;
  }

  return route;
}

/**
 * Creates and returns a routes object from the given ReactChildren. JSX
 * provides a convenient way to visualize how routes in the hierarchy are
 * nested.
 *
 *   import { Route, createRoutesFromReactChildren } from 'react-router'
 *
 *   const routes = createRoutesFromReactChildren(
 *     <Route component={App}>
 *       <Route path="home" component={Dashboard}/>
 *       <Route path="news" component={NewsFeed}/>
 *     </Route>
 *   )
 *
 * Note: This method is automatically used when you provide <Route> children
 * to a <Router> component.
 */
function createRoutesFromReactChildren(children, parentRoute) {
  var routes = [];

  _react2.default.Children.forEach(children, function (element) {
    if (_react2.default.isValidElement(element)) {
      // Component classes may have a static create* method.
      if (element.type.createRouteFromReactElement) {
        var route = element.type.createRouteFromReactElement(element, parentRoute);

        if (route) routes.push(route);
      } else {
        routes.push(createRouteFromReactElement(element));
      }
    }
  });

  return routes;
}

/**
 * Creates and returns an array of routes from the given object which
 * may be a JSX route, a plain object route, or an array of either.
 */
function createRoutes(routes) {
  if (isReactChildren(routes)) {
    routes = createRoutesFromReactChildren(routes);
  } else if (routes && !Array.isArray(routes)) {
    routes = [routes];
  }

  return routes;
}

/***/ },

/***/ 240:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _types = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case _types.SELECT_ARTIST:
      return [].concat(_toConsumableArray(state), [action.payload]);
    case _types.DESELECT_ARTIST:
      return _lodash2.default.without(state, action.payload);
    case _types.RESET_SELECTION:
      return [];
    default:
      return state;
  }
};

/***/ },

/***/ 241:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)();
// imports


// module
exports.push([module.i, "/*!\r\n * Materialize v0.97.8 (http://materializecss.com)\r\n * Copyright 2014-2015 Materialize\r\n * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)\r\n */\r\n.materialize-red {\r\n  background-color: #e51c23 !important;\r\n}\r\n\r\n.materialize-red-text {\r\n  color: #e51c23 !important;\r\n}\r\n\r\n.materialize-red.lighten-5 {\r\n  background-color: #fdeaeb !important;\r\n}\r\n\r\n.materialize-red-text.text-lighten-5 {\r\n  color: #fdeaeb !important;\r\n}\r\n\r\n.materialize-red.lighten-4 {\r\n  background-color: #f8c1c3 !important;\r\n}\r\n\r\n.materialize-red-text.text-lighten-4 {\r\n  color: #f8c1c3 !important;\r\n}\r\n\r\n.materialize-red.lighten-3 {\r\n  background-color: #f3989b !important;\r\n}\r\n\r\n.materialize-red-text.text-lighten-3 {\r\n  color: #f3989b !important;\r\n}\r\n\r\n.materialize-red.lighten-2 {\r\n  background-color: #ee6e73 !important;\r\n}\r\n\r\n.materialize-red-text.text-lighten-2 {\r\n  color: #ee6e73 !important;\r\n}\r\n\r\n.materialize-red.lighten-1 {\r\n  background-color: #ea454b !important;\r\n}\r\n\r\n.materialize-red-text.text-lighten-1 {\r\n  color: #ea454b !important;\r\n}\r\n\r\n.materialize-red.darken-1 {\r\n  background-color: #d0181e !important;\r\n}\r\n\r\n.materialize-red-text.text-darken-1 {\r\n  color: #d0181e !important;\r\n}\r\n\r\n.materialize-red.darken-2 {\r\n  background-color: #b9151b !important;\r\n}\r\n\r\n.materialize-red-text.text-darken-2 {\r\n  color: #b9151b !important;\r\n}\r\n\r\n.materialize-red.darken-3 {\r\n  background-color: #a21318 !important;\r\n}\r\n\r\n.materialize-red-text.text-darken-3 {\r\n  color: #a21318 !important;\r\n}\r\n\r\n.materialize-red.darken-4 {\r\n  background-color: #8b1014 !important;\r\n}\r\n\r\n.materialize-red-text.text-darken-4 {\r\n  color: #8b1014 !important;\r\n}\r\n\r\n.red {\r\n  background-color: #F44336 !important;\r\n}\r\n\r\n.red-text {\r\n  color: #F44336 !important;\r\n}\r\n\r\n.red.lighten-5 {\r\n  background-color: #FFEBEE !important;\r\n}\r\n\r\n.red-text.text-lighten-5 {\r\n  color: #FFEBEE !important;\r\n}\r\n\r\n.red.lighten-4 {\r\n  background-color: #FFCDD2 !important;\r\n}\r\n\r\n.red-text.text-lighten-4 {\r\n  color: #FFCDD2 !important;\r\n}\r\n\r\n.red.lighten-3 {\r\n  background-color: #EF9A9A !important;\r\n}\r\n\r\n.red-text.text-lighten-3 {\r\n  color: #EF9A9A !important;\r\n}\r\n\r\n.red.lighten-2 {\r\n  background-color: #E57373 !important;\r\n}\r\n\r\n.red-text.text-lighten-2 {\r\n  color: #E57373 !important;\r\n}\r\n\r\n.red.lighten-1 {\r\n  background-color: #EF5350 !important;\r\n}\r\n\r\n.red-text.text-lighten-1 {\r\n  color: #EF5350 !important;\r\n}\r\n\r\n.red.darken-1 {\r\n  background-color: #E53935 !important;\r\n}\r\n\r\n.red-text.text-darken-1 {\r\n  color: #E53935 !important;\r\n}\r\n\r\n.red.darken-2 {\r\n  background-color: #D32F2F !important;\r\n}\r\n\r\n.red-text.text-darken-2 {\r\n  color: #D32F2F !important;\r\n}\r\n\r\n.red.darken-3 {\r\n  background-color: #C62828 !important;\r\n}\r\n\r\n.red-text.text-darken-3 {\r\n  color: #C62828 !important;\r\n}\r\n\r\n.red.darken-4 {\r\n  background-color: #B71C1C !important;\r\n}\r\n\r\n.red-text.text-darken-4 {\r\n  color: #B71C1C !important;\r\n}\r\n\r\n.red.accent-1 {\r\n  background-color: #FF8A80 !important;\r\n}\r\n\r\n.red-text.text-accent-1 {\r\n  color: #FF8A80 !important;\r\n}\r\n\r\n.red.accent-2 {\r\n  background-color: #FF5252 !important;\r\n}\r\n\r\n.red-text.text-accent-2 {\r\n  color: #FF5252 !important;\r\n}\r\n\r\n.red.accent-3 {\r\n  background-color: #FF1744 !important;\r\n}\r\n\r\n.red-text.text-accent-3 {\r\n  color: #FF1744 !important;\r\n}\r\n\r\n.red.accent-4 {\r\n  background-color: #D50000 !important;\r\n}\r\n\r\n.red-text.text-accent-4 {\r\n  color: #D50000 !important;\r\n}\r\n\r\n.pink {\r\n  background-color: #e91e63 !important;\r\n}\r\n\r\n.pink-text {\r\n  color: #e91e63 !important;\r\n}\r\n\r\n.pink.lighten-5 {\r\n  background-color: #fce4ec !important;\r\n}\r\n\r\n.pink-text.text-lighten-5 {\r\n  color: #fce4ec !important;\r\n}\r\n\r\n.pink.lighten-4 {\r\n  background-color: #f8bbd0 !important;\r\n}\r\n\r\n.pink-text.text-lighten-4 {\r\n  color: #f8bbd0 !important;\r\n}\r\n\r\n.pink.lighten-3 {\r\n  background-color: #f48fb1 !important;\r\n}\r\n\r\n.pink-text.text-lighten-3 {\r\n  color: #f48fb1 !important;\r\n}\r\n\r\n.pink.lighten-2 {\r\n  background-color: #f06292 !important;\r\n}\r\n\r\n.pink-text.text-lighten-2 {\r\n  color: #f06292 !important;\r\n}\r\n\r\n.pink.lighten-1 {\r\n  background-color: #ec407a !important;\r\n}\r\n\r\n.pink-text.text-lighten-1 {\r\n  color: #ec407a !important;\r\n}\r\n\r\n.pink.darken-1 {\r\n  background-color: #d81b60 !important;\r\n}\r\n\r\n.pink-text.text-darken-1 {\r\n  color: #d81b60 !important;\r\n}\r\n\r\n.pink.darken-2 {\r\n  background-color: #c2185b !important;\r\n}\r\n\r\n.pink-text.text-darken-2 {\r\n  color: #c2185b !important;\r\n}\r\n\r\n.pink.darken-3 {\r\n  background-color: #ad1457 !important;\r\n}\r\n\r\n.pink-text.text-darken-3 {\r\n  color: #ad1457 !important;\r\n}\r\n\r\n.pink.darken-4 {\r\n  background-color: #880e4f !important;\r\n}\r\n\r\n.pink-text.text-darken-4 {\r\n  color: #880e4f !important;\r\n}\r\n\r\n.pink.accent-1 {\r\n  background-color: #ff80ab !important;\r\n}\r\n\r\n.pink-text.text-accent-1 {\r\n  color: #ff80ab !important;\r\n}\r\n\r\n.pink.accent-2 {\r\n  background-color: #ff4081 !important;\r\n}\r\n\r\n.pink-text.text-accent-2 {\r\n  color: #ff4081 !important;\r\n}\r\n\r\n.pink.accent-3 {\r\n  background-color: #f50057 !important;\r\n}\r\n\r\n.pink-text.text-accent-3 {\r\n  color: #f50057 !important;\r\n}\r\n\r\n.pink.accent-4 {\r\n  background-color: #c51162 !important;\r\n}\r\n\r\n.pink-text.text-accent-4 {\r\n  color: #c51162 !important;\r\n}\r\n\r\n.purple {\r\n  background-color: #9c27b0 !important;\r\n}\r\n\r\n.purple-text {\r\n  color: #9c27b0 !important;\r\n}\r\n\r\n.purple.lighten-5 {\r\n  background-color: #f3e5f5 !important;\r\n}\r\n\r\n.purple-text.text-lighten-5 {\r\n  color: #f3e5f5 !important;\r\n}\r\n\r\n.purple.lighten-4 {\r\n  background-color: #e1bee7 !important;\r\n}\r\n\r\n.purple-text.text-lighten-4 {\r\n  color: #e1bee7 !important;\r\n}\r\n\r\n.purple.lighten-3 {\r\n  background-color: #ce93d8 !important;\r\n}\r\n\r\n.purple-text.text-lighten-3 {\r\n  color: #ce93d8 !important;\r\n}\r\n\r\n.purple.lighten-2 {\r\n  background-color: #ba68c8 !important;\r\n}\r\n\r\n.purple-text.text-lighten-2 {\r\n  color: #ba68c8 !important;\r\n}\r\n\r\n.purple.lighten-1 {\r\n  background-color: #ab47bc !important;\r\n}\r\n\r\n.purple-text.text-lighten-1 {\r\n  color: #ab47bc !important;\r\n}\r\n\r\n.purple.darken-1 {\r\n  background-color: #8e24aa !important;\r\n}\r\n\r\n.purple-text.text-darken-1 {\r\n  color: #8e24aa !important;\r\n}\r\n\r\n.purple.darken-2 {\r\n  background-color: #7b1fa2 !important;\r\n}\r\n\r\n.purple-text.text-darken-2 {\r\n  color: #7b1fa2 !important;\r\n}\r\n\r\n.purple.darken-3 {\r\n  background-color: #6a1b9a !important;\r\n}\r\n\r\n.purple-text.text-darken-3 {\r\n  color: #6a1b9a !important;\r\n}\r\n\r\n.purple.darken-4 {\r\n  background-color: #4a148c !important;\r\n}\r\n\r\n.purple-text.text-darken-4 {\r\n  color: #4a148c !important;\r\n}\r\n\r\n.purple.accent-1 {\r\n  background-color: #ea80fc !important;\r\n}\r\n\r\n.purple-text.text-accent-1 {\r\n  color: #ea80fc !important;\r\n}\r\n\r\n.purple.accent-2 {\r\n  background-color: #e040fb !important;\r\n}\r\n\r\n.purple-text.text-accent-2 {\r\n  color: #e040fb !important;\r\n}\r\n\r\n.purple.accent-3 {\r\n  background-color: #d500f9 !important;\r\n}\r\n\r\n.purple-text.text-accent-3 {\r\n  color: #d500f9 !important;\r\n}\r\n\r\n.purple.accent-4 {\r\n  background-color: #aa00ff !important;\r\n}\r\n\r\n.purple-text.text-accent-4 {\r\n  color: #aa00ff !important;\r\n}\r\n\r\n.deep-purple {\r\n  background-color: #673ab7 !important;\r\n}\r\n\r\n.deep-purple-text {\r\n  color: #673ab7 !important;\r\n}\r\n\r\n.deep-purple.lighten-5 {\r\n  background-color: #ede7f6 !important;\r\n}\r\n\r\n.deep-purple-text.text-lighten-5 {\r\n  color: #ede7f6 !important;\r\n}\r\n\r\n.deep-purple.lighten-4 {\r\n  background-color: #d1c4e9 !important;\r\n}\r\n\r\n.deep-purple-text.text-lighten-4 {\r\n  color: #d1c4e9 !important;\r\n}\r\n\r\n.deep-purple.lighten-3 {\r\n  background-color: #b39ddb !important;\r\n}\r\n\r\n.deep-purple-text.text-lighten-3 {\r\n  color: #b39ddb !important;\r\n}\r\n\r\n.deep-purple.lighten-2 {\r\n  background-color: #9575cd !important;\r\n}\r\n\r\n.deep-purple-text.text-lighten-2 {\r\n  color: #9575cd !important;\r\n}\r\n\r\n.deep-purple.lighten-1 {\r\n  background-color: #7e57c2 !important;\r\n}\r\n\r\n.deep-purple-text.text-lighten-1 {\r\n  color: #7e57c2 !important;\r\n}\r\n\r\n.deep-purple.darken-1 {\r\n  background-color: #5e35b1 !important;\r\n}\r\n\r\n.deep-purple-text.text-darken-1 {\r\n  color: #5e35b1 !important;\r\n}\r\n\r\n.deep-purple.darken-2 {\r\n  background-color: #512da8 !important;\r\n}\r\n\r\n.deep-purple-text.text-darken-2 {\r\n  color: #512da8 !important;\r\n}\r\n\r\n.deep-purple.darken-3 {\r\n  background-color: #4527a0 !important;\r\n}\r\n\r\n.deep-purple-text.text-darken-3 {\r\n  color: #4527a0 !important;\r\n}\r\n\r\n.deep-purple.darken-4 {\r\n  background-color: #311b92 !important;\r\n}\r\n\r\n.deep-purple-text.text-darken-4 {\r\n  color: #311b92 !important;\r\n}\r\n\r\n.deep-purple.accent-1 {\r\n  background-color: #b388ff !important;\r\n}\r\n\r\n.deep-purple-text.text-accent-1 {\r\n  color: #b388ff !important;\r\n}\r\n\r\n.deep-purple.accent-2 {\r\n  background-color: #7c4dff !important;\r\n}\r\n\r\n.deep-purple-text.text-accent-2 {\r\n  color: #7c4dff !important;\r\n}\r\n\r\n.deep-purple.accent-3 {\r\n  background-color: #651fff !important;\r\n}\r\n\r\n.deep-purple-text.text-accent-3 {\r\n  color: #651fff !important;\r\n}\r\n\r\n.deep-purple.accent-4 {\r\n  background-color: #6200ea !important;\r\n}\r\n\r\n.deep-purple-text.text-accent-4 {\r\n  color: #6200ea !important;\r\n}\r\n\r\n.indigo {\r\n  background-color: #3f51b5 !important;\r\n}\r\n\r\n.indigo-text {\r\n  color: #3f51b5 !important;\r\n}\r\n\r\n.indigo.lighten-5 {\r\n  background-color: #e8eaf6 !important;\r\n}\r\n\r\n.indigo-text.text-lighten-5 {\r\n  color: #e8eaf6 !important;\r\n}\r\n\r\n.indigo.lighten-4 {\r\n  background-color: #c5cae9 !important;\r\n}\r\n\r\n.indigo-text.text-lighten-4 {\r\n  color: #c5cae9 !important;\r\n}\r\n\r\n.indigo.lighten-3 {\r\n  background-color: #9fa8da !important;\r\n}\r\n\r\n.indigo-text.text-lighten-3 {\r\n  color: #9fa8da !important;\r\n}\r\n\r\n.indigo.lighten-2 {\r\n  background-color: #7986cb !important;\r\n}\r\n\r\n.indigo-text.text-lighten-2 {\r\n  color: #7986cb !important;\r\n}\r\n\r\n.indigo.lighten-1 {\r\n  background-color: #5c6bc0 !important;\r\n}\r\n\r\n.indigo-text.text-lighten-1 {\r\n  color: #5c6bc0 !important;\r\n}\r\n\r\n.indigo.darken-1 {\r\n  background-color: #3949ab !important;\r\n}\r\n\r\n.indigo-text.text-darken-1 {\r\n  color: #3949ab !important;\r\n}\r\n\r\n.indigo.darken-2 {\r\n  background-color: #303f9f !important;\r\n}\r\n\r\n.indigo-text.text-darken-2 {\r\n  color: #303f9f !important;\r\n}\r\n\r\n.indigo.darken-3 {\r\n  background-color: #283593 !important;\r\n}\r\n\r\n.indigo-text.text-darken-3 {\r\n  color: #283593 !important;\r\n}\r\n\r\n.indigo.darken-4 {\r\n  background-color: #1a237e !important;\r\n}\r\n\r\n.indigo-text.text-darken-4 {\r\n  color: #1a237e !important;\r\n}\r\n\r\n.indigo.accent-1 {\r\n  background-color: #8c9eff !important;\r\n}\r\n\r\n.indigo-text.text-accent-1 {\r\n  color: #8c9eff !important;\r\n}\r\n\r\n.indigo.accent-2 {\r\n  background-color: #536dfe !important;\r\n}\r\n\r\n.indigo-text.text-accent-2 {\r\n  color: #536dfe !important;\r\n}\r\n\r\n.indigo.accent-3 {\r\n  background-color: #3d5afe !important;\r\n}\r\n\r\n.indigo-text.text-accent-3 {\r\n  color: #3d5afe !important;\r\n}\r\n\r\n.indigo.accent-4 {\r\n  background-color: #304ffe !important;\r\n}\r\n\r\n.indigo-text.text-accent-4 {\r\n  color: #304ffe !important;\r\n}\r\n\r\n.blue {\r\n  background-color: #2196F3 !important;\r\n}\r\n\r\n.blue-text {\r\n  color: #2196F3 !important;\r\n}\r\n\r\n.blue.lighten-5 {\r\n  background-color: #E3F2FD !important;\r\n}\r\n\r\n.blue-text.text-lighten-5 {\r\n  color: #E3F2FD !important;\r\n}\r\n\r\n.blue.lighten-4 {\r\n  background-color: #BBDEFB !important;\r\n}\r\n\r\n.blue-text.text-lighten-4 {\r\n  color: #BBDEFB !important;\r\n}\r\n\r\n.blue.lighten-3 {\r\n  background-color: #90CAF9 !important;\r\n}\r\n\r\n.blue-text.text-lighten-3 {\r\n  color: #90CAF9 !important;\r\n}\r\n\r\n.blue.lighten-2 {\r\n  background-color: #64B5F6 !important;\r\n}\r\n\r\n.blue-text.text-lighten-2 {\r\n  color: #64B5F6 !important;\r\n}\r\n\r\n.blue.lighten-1 {\r\n  background-color: #42A5F5 !important;\r\n}\r\n\r\n.blue-text.text-lighten-1 {\r\n  color: #42A5F5 !important;\r\n}\r\n\r\n.blue.darken-1 {\r\n  background-color: #1E88E5 !important;\r\n}\r\n\r\n.blue-text.text-darken-1 {\r\n  color: #1E88E5 !important;\r\n}\r\n\r\n.blue.darken-2 {\r\n  background-color: #1976D2 !important;\r\n}\r\n\r\n.blue-text.text-darken-2 {\r\n  color: #1976D2 !important;\r\n}\r\n\r\n.blue.darken-3 {\r\n  background-color: #1565C0 !important;\r\n}\r\n\r\n.blue-text.text-darken-3 {\r\n  color: #1565C0 !important;\r\n}\r\n\r\n.blue.darken-4 {\r\n  background-color: #0D47A1 !important;\r\n}\r\n\r\n.blue-text.text-darken-4 {\r\n  color: #0D47A1 !important;\r\n}\r\n\r\n.blue.accent-1 {\r\n  background-color: #82B1FF !important;\r\n}\r\n\r\n.blue-text.text-accent-1 {\r\n  color: #82B1FF !important;\r\n}\r\n\r\n.blue.accent-2 {\r\n  background-color: #448AFF !important;\r\n}\r\n\r\n.blue-text.text-accent-2 {\r\n  color: #448AFF !important;\r\n}\r\n\r\n.blue.accent-3 {\r\n  background-color: #2979FF !important;\r\n}\r\n\r\n.blue-text.text-accent-3 {\r\n  color: #2979FF !important;\r\n}\r\n\r\n.blue.accent-4 {\r\n  background-color: #2962FF !important;\r\n}\r\n\r\n.blue-text.text-accent-4 {\r\n  color: #2962FF !important;\r\n}\r\n\r\n.light-blue {\r\n  background-color: #03a9f4 !important;\r\n}\r\n\r\n.light-blue-text {\r\n  color: #03a9f4 !important;\r\n}\r\n\r\n.light-blue.lighten-5 {\r\n  background-color: #e1f5fe !important;\r\n}\r\n\r\n.light-blue-text.text-lighten-5 {\r\n  color: #e1f5fe !important;\r\n}\r\n\r\n.light-blue.lighten-4 {\r\n  background-color: #b3e5fc !important;\r\n}\r\n\r\n.light-blue-text.text-lighten-4 {\r\n  color: #b3e5fc !important;\r\n}\r\n\r\n.light-blue.lighten-3 {\r\n  background-color: #81d4fa !important;\r\n}\r\n\r\n.light-blue-text.text-lighten-3 {\r\n  color: #81d4fa !important;\r\n}\r\n\r\n.light-blue.lighten-2 {\r\n  background-color: #4fc3f7 !important;\r\n}\r\n\r\n.light-blue-text.text-lighten-2 {\r\n  color: #4fc3f7 !important;\r\n}\r\n\r\n.light-blue.lighten-1 {\r\n  background-color: #29b6f6 !important;\r\n}\r\n\r\n.light-blue-text.text-lighten-1 {\r\n  color: #29b6f6 !important;\r\n}\r\n\r\n.light-blue.darken-1 {\r\n  background-color: #039be5 !important;\r\n}\r\n\r\n.light-blue-text.text-darken-1 {\r\n  color: #039be5 !important;\r\n}\r\n\r\n.light-blue.darken-2 {\r\n  background-color: #0288d1 !important;\r\n}\r\n\r\n.light-blue-text.text-darken-2 {\r\n  color: #0288d1 !important;\r\n}\r\n\r\n.light-blue.darken-3 {\r\n  background-color: #0277bd !important;\r\n}\r\n\r\n.light-blue-text.text-darken-3 {\r\n  color: #0277bd !important;\r\n}\r\n\r\n.light-blue.darken-4 {\r\n  background-color: #01579b !important;\r\n}\r\n\r\n.light-blue-text.text-darken-4 {\r\n  color: #01579b !important;\r\n}\r\n\r\n.light-blue.accent-1 {\r\n  background-color: #80d8ff !important;\r\n}\r\n\r\n.light-blue-text.text-accent-1 {\r\n  color: #80d8ff !important;\r\n}\r\n\r\n.light-blue.accent-2 {\r\n  background-color: #40c4ff !important;\r\n}\r\n\r\n.light-blue-text.text-accent-2 {\r\n  color: #40c4ff !important;\r\n}\r\n\r\n.light-blue.accent-3 {\r\n  background-color: #00b0ff !important;\r\n}\r\n\r\n.light-blue-text.text-accent-3 {\r\n  color: #00b0ff !important;\r\n}\r\n\r\n.light-blue.accent-4 {\r\n  background-color: #0091ea !important;\r\n}\r\n\r\n.light-blue-text.text-accent-4 {\r\n  color: #0091ea !important;\r\n}\r\n\r\n.cyan {\r\n  background-color: #00bcd4 !important;\r\n}\r\n\r\n.cyan-text {\r\n  color: #00bcd4 !important;\r\n}\r\n\r\n.cyan.lighten-5 {\r\n  background-color: #e0f7fa !important;\r\n}\r\n\r\n.cyan-text.text-lighten-5 {\r\n  color: #e0f7fa !important;\r\n}\r\n\r\n.cyan.lighten-4 {\r\n  background-color: #b2ebf2 !important;\r\n}\r\n\r\n.cyan-text.text-lighten-4 {\r\n  color: #b2ebf2 !important;\r\n}\r\n\r\n.cyan.lighten-3 {\r\n  background-color: #80deea !important;\r\n}\r\n\r\n.cyan-text.text-lighten-3 {\r\n  color: #80deea !important;\r\n}\r\n\r\n.cyan.lighten-2 {\r\n  background-color: #4dd0e1 !important;\r\n}\r\n\r\n.cyan-text.text-lighten-2 {\r\n  color: #4dd0e1 !important;\r\n}\r\n\r\n.cyan.lighten-1 {\r\n  background-color: #26c6da !important;\r\n}\r\n\r\n.cyan-text.text-lighten-1 {\r\n  color: #26c6da !important;\r\n}\r\n\r\n.cyan.darken-1 {\r\n  background-color: #00acc1 !important;\r\n}\r\n\r\n.cyan-text.text-darken-1 {\r\n  color: #00acc1 !important;\r\n}\r\n\r\n.cyan.darken-2 {\r\n  background-color: #0097a7 !important;\r\n}\r\n\r\n.cyan-text.text-darken-2 {\r\n  color: #0097a7 !important;\r\n}\r\n\r\n.cyan.darken-3 {\r\n  background-color: #00838f !important;\r\n}\r\n\r\n.cyan-text.text-darken-3 {\r\n  color: #00838f !important;\r\n}\r\n\r\n.cyan.darken-4 {\r\n  background-color: #006064 !important;\r\n}\r\n\r\n.cyan-text.text-darken-4 {\r\n  color: #006064 !important;\r\n}\r\n\r\n.cyan.accent-1 {\r\n  background-color: #84ffff !important;\r\n}\r\n\r\n.cyan-text.text-accent-1 {\r\n  color: #84ffff !important;\r\n}\r\n\r\n.cyan.accent-2 {\r\n  background-color: #18ffff !important;\r\n}\r\n\r\n.cyan-text.text-accent-2 {\r\n  color: #18ffff !important;\r\n}\r\n\r\n.cyan.accent-3 {\r\n  background-color: #00e5ff !important;\r\n}\r\n\r\n.cyan-text.text-accent-3 {\r\n  color: #00e5ff !important;\r\n}\r\n\r\n.cyan.accent-4 {\r\n  background-color: #00b8d4 !important;\r\n}\r\n\r\n.cyan-text.text-accent-4 {\r\n  color: #00b8d4 !important;\r\n}\r\n\r\n.teal {\r\n  background-color: #009688 !important;\r\n}\r\n\r\n.teal-text {\r\n  color: #009688 !important;\r\n}\r\n\r\n.teal.lighten-5 {\r\n  background-color: #e0f2f1 !important;\r\n}\r\n\r\n.teal-text.text-lighten-5 {\r\n  color: #e0f2f1 !important;\r\n}\r\n\r\n.teal.lighten-4 {\r\n  background-color: #b2dfdb !important;\r\n}\r\n\r\n.teal-text.text-lighten-4 {\r\n  color: #b2dfdb !important;\r\n}\r\n\r\n.teal.lighten-3 {\r\n  background-color: #80cbc4 !important;\r\n}\r\n\r\n.teal-text.text-lighten-3 {\r\n  color: #80cbc4 !important;\r\n}\r\n\r\n.teal.lighten-2 {\r\n  background-color: #4db6ac !important;\r\n}\r\n\r\n.teal-text.text-lighten-2 {\r\n  color: #4db6ac !important;\r\n}\r\n\r\n.teal.lighten-1 {\r\n  background-color: #26a69a !important;\r\n}\r\n\r\n.teal-text.text-lighten-1 {\r\n  color: #26a69a !important;\r\n}\r\n\r\n.teal.darken-1 {\r\n  background-color: #00897b !important;\r\n}\r\n\r\n.teal-text.text-darken-1 {\r\n  color: #00897b !important;\r\n}\r\n\r\n.teal.darken-2 {\r\n  background-color: #00796b !important;\r\n}\r\n\r\n.teal-text.text-darken-2 {\r\n  color: #00796b !important;\r\n}\r\n\r\n.teal.darken-3 {\r\n  background-color: #00695c !important;\r\n}\r\n\r\n.teal-text.text-darken-3 {\r\n  color: #00695c !important;\r\n}\r\n\r\n.teal.darken-4 {\r\n  background-color: #004d40 !important;\r\n}\r\n\r\n.teal-text.text-darken-4 {\r\n  color: #004d40 !important;\r\n}\r\n\r\n.teal.accent-1 {\r\n  background-color: #a7ffeb !important;\r\n}\r\n\r\n.teal-text.text-accent-1 {\r\n  color: #a7ffeb !important;\r\n}\r\n\r\n.teal.accent-2 {\r\n  background-color: #64ffda !important;\r\n}\r\n\r\n.teal-text.text-accent-2 {\r\n  color: #64ffda !important;\r\n}\r\n\r\n.teal.accent-3 {\r\n  background-color: #1de9b6 !important;\r\n}\r\n\r\n.teal-text.text-accent-3 {\r\n  color: #1de9b6 !important;\r\n}\r\n\r\n.teal.accent-4 {\r\n  background-color: #00bfa5 !important;\r\n}\r\n\r\n.teal-text.text-accent-4 {\r\n  color: #00bfa5 !important;\r\n}\r\n\r\n.green {\r\n  background-color: #4CAF50 !important;\r\n}\r\n\r\n.green-text {\r\n  color: #4CAF50 !important;\r\n}\r\n\r\n.green.lighten-5 {\r\n  background-color: #E8F5E9 !important;\r\n}\r\n\r\n.green-text.text-lighten-5 {\r\n  color: #E8F5E9 !important;\r\n}\r\n\r\n.green.lighten-4 {\r\n  background-color: #C8E6C9 !important;\r\n}\r\n\r\n.green-text.text-lighten-4 {\r\n  color: #C8E6C9 !important;\r\n}\r\n\r\n.green.lighten-3 {\r\n  background-color: #A5D6A7 !important;\r\n}\r\n\r\n.green-text.text-lighten-3 {\r\n  color: #A5D6A7 !important;\r\n}\r\n\r\n.green.lighten-2 {\r\n  background-color: #81C784 !important;\r\n}\r\n\r\n.green-text.text-lighten-2 {\r\n  color: #81C784 !important;\r\n}\r\n\r\n.green.lighten-1 {\r\n  background-color: #66BB6A !important;\r\n}\r\n\r\n.green-text.text-lighten-1 {\r\n  color: #66BB6A !important;\r\n}\r\n\r\n.green.darken-1 {\r\n  background-color: #43A047 !important;\r\n}\r\n\r\n.green-text.text-darken-1 {\r\n  color: #43A047 !important;\r\n}\r\n\r\n.green.darken-2 {\r\n  background-color: #388E3C !important;\r\n}\r\n\r\n.green-text.text-darken-2 {\r\n  color: #388E3C !important;\r\n}\r\n\r\n.green.darken-3 {\r\n  background-color: #2E7D32 !important;\r\n}\r\n\r\n.green-text.text-darken-3 {\r\n  color: #2E7D32 !important;\r\n}\r\n\r\n.green.darken-4 {\r\n  background-color: #1B5E20 !important;\r\n}\r\n\r\n.green-text.text-darken-4 {\r\n  color: #1B5E20 !important;\r\n}\r\n\r\n.green.accent-1 {\r\n  background-color: #B9F6CA !important;\r\n}\r\n\r\n.green-text.text-accent-1 {\r\n  color: #B9F6CA !important;\r\n}\r\n\r\n.green.accent-2 {\r\n  background-color: #69F0AE !important;\r\n}\r\n\r\n.green-text.text-accent-2 {\r\n  color: #69F0AE !important;\r\n}\r\n\r\n.green.accent-3 {\r\n  background-color: #00E676 !important;\r\n}\r\n\r\n.green-text.text-accent-3 {\r\n  color: #00E676 !important;\r\n}\r\n\r\n.green.accent-4 {\r\n  background-color: #00C853 !important;\r\n}\r\n\r\n.green-text.text-accent-4 {\r\n  color: #00C853 !important;\r\n}\r\n\r\n.light-green {\r\n  background-color: #8bc34a !important;\r\n}\r\n\r\n.light-green-text {\r\n  color: #8bc34a !important;\r\n}\r\n\r\n.light-green.lighten-5 {\r\n  background-color: #f1f8e9 !important;\r\n}\r\n\r\n.light-green-text.text-lighten-5 {\r\n  color: #f1f8e9 !important;\r\n}\r\n\r\n.light-green.lighten-4 {\r\n  background-color: #dcedc8 !important;\r\n}\r\n\r\n.light-green-text.text-lighten-4 {\r\n  color: #dcedc8 !important;\r\n}\r\n\r\n.light-green.lighten-3 {\r\n  background-color: #c5e1a5 !important;\r\n}\r\n\r\n.light-green-text.text-lighten-3 {\r\n  color: #c5e1a5 !important;\r\n}\r\n\r\n.light-green.lighten-2 {\r\n  background-color: #aed581 !important;\r\n}\r\n\r\n.light-green-text.text-lighten-2 {\r\n  color: #aed581 !important;\r\n}\r\n\r\n.light-green.lighten-1 {\r\n  background-color: #9ccc65 !important;\r\n}\r\n\r\n.light-green-text.text-lighten-1 {\r\n  color: #9ccc65 !important;\r\n}\r\n\r\n.light-green.darken-1 {\r\n  background-color: #7cb342 !important;\r\n}\r\n\r\n.light-green-text.text-darken-1 {\r\n  color: #7cb342 !important;\r\n}\r\n\r\n.light-green.darken-2 {\r\n  background-color: #689f38 !important;\r\n}\r\n\r\n.light-green-text.text-darken-2 {\r\n  color: #689f38 !important;\r\n}\r\n\r\n.light-green.darken-3 {\r\n  background-color: #558b2f !important;\r\n}\r\n\r\n.light-green-text.text-darken-3 {\r\n  color: #558b2f !important;\r\n}\r\n\r\n.light-green.darken-4 {\r\n  background-color: #33691e !important;\r\n}\r\n\r\n.light-green-text.text-darken-4 {\r\n  color: #33691e !important;\r\n}\r\n\r\n.light-green.accent-1 {\r\n  background-color: #ccff90 !important;\r\n}\r\n\r\n.light-green-text.text-accent-1 {\r\n  color: #ccff90 !important;\r\n}\r\n\r\n.light-green.accent-2 {\r\n  background-color: #b2ff59 !important;\r\n}\r\n\r\n.light-green-text.text-accent-2 {\r\n  color: #b2ff59 !important;\r\n}\r\n\r\n.light-green.accent-3 {\r\n  background-color: #76ff03 !important;\r\n}\r\n\r\n.light-green-text.text-accent-3 {\r\n  color: #76ff03 !important;\r\n}\r\n\r\n.light-green.accent-4 {\r\n  background-color: #64dd17 !important;\r\n}\r\n\r\n.light-green-text.text-accent-4 {\r\n  color: #64dd17 !important;\r\n}\r\n\r\n.lime {\r\n  background-color: #cddc39 !important;\r\n}\r\n\r\n.lime-text {\r\n  color: #cddc39 !important;\r\n}\r\n\r\n.lime.lighten-5 {\r\n  background-color: #f9fbe7 !important;\r\n}\r\n\r\n.lime-text.text-lighten-5 {\r\n  color: #f9fbe7 !important;\r\n}\r\n\r\n.lime.lighten-4 {\r\n  background-color: #f0f4c3 !important;\r\n}\r\n\r\n.lime-text.text-lighten-4 {\r\n  color: #f0f4c3 !important;\r\n}\r\n\r\n.lime.lighten-3 {\r\n  background-color: #e6ee9c !important;\r\n}\r\n\r\n.lime-text.text-lighten-3 {\r\n  color: #e6ee9c !important;\r\n}\r\n\r\n.lime.lighten-2 {\r\n  background-color: #dce775 !important;\r\n}\r\n\r\n.lime-text.text-lighten-2 {\r\n  color: #dce775 !important;\r\n}\r\n\r\n.lime.lighten-1 {\r\n  background-color: #d4e157 !important;\r\n}\r\n\r\n.lime-text.text-lighten-1 {\r\n  color: #d4e157 !important;\r\n}\r\n\r\n.lime.darken-1 {\r\n  background-color: #c0ca33 !important;\r\n}\r\n\r\n.lime-text.text-darken-1 {\r\n  color: #c0ca33 !important;\r\n}\r\n\r\n.lime.darken-2 {\r\n  background-color: #afb42b !important;\r\n}\r\n\r\n.lime-text.text-darken-2 {\r\n  color: #afb42b !important;\r\n}\r\n\r\n.lime.darken-3 {\r\n  background-color: #9e9d24 !important;\r\n}\r\n\r\n.lime-text.text-darken-3 {\r\n  color: #9e9d24 !important;\r\n}\r\n\r\n.lime.darken-4 {\r\n  background-color: #827717 !important;\r\n}\r\n\r\n.lime-text.text-darken-4 {\r\n  color: #827717 !important;\r\n}\r\n\r\n.lime.accent-1 {\r\n  background-color: #f4ff81 !important;\r\n}\r\n\r\n.lime-text.text-accent-1 {\r\n  color: #f4ff81 !important;\r\n}\r\n\r\n.lime.accent-2 {\r\n  background-color: #eeff41 !important;\r\n}\r\n\r\n.lime-text.text-accent-2 {\r\n  color: #eeff41 !important;\r\n}\r\n\r\n.lime.accent-3 {\r\n  background-color: #c6ff00 !important;\r\n}\r\n\r\n.lime-text.text-accent-3 {\r\n  color: #c6ff00 !important;\r\n}\r\n\r\n.lime.accent-4 {\r\n  background-color: #aeea00 !important;\r\n}\r\n\r\n.lime-text.text-accent-4 {\r\n  color: #aeea00 !important;\r\n}\r\n\r\n.yellow {\r\n  background-color: #ffeb3b !important;\r\n}\r\n\r\n.yellow-text {\r\n  color: #ffeb3b !important;\r\n}\r\n\r\n.yellow.lighten-5 {\r\n  background-color: #fffde7 !important;\r\n}\r\n\r\n.yellow-text.text-lighten-5 {\r\n  color: #fffde7 !important;\r\n}\r\n\r\n.yellow.lighten-4 {\r\n  background-color: #fff9c4 !important;\r\n}\r\n\r\n.yellow-text.text-lighten-4 {\r\n  color: #fff9c4 !important;\r\n}\r\n\r\n.yellow.lighten-3 {\r\n  background-color: #fff59d !important;\r\n}\r\n\r\n.yellow-text.text-lighten-3 {\r\n  color: #fff59d !important;\r\n}\r\n\r\n.yellow.lighten-2 {\r\n  background-color: #fff176 !important;\r\n}\r\n\r\n.yellow-text.text-lighten-2 {\r\n  color: #fff176 !important;\r\n}\r\n\r\n.yellow.lighten-1 {\r\n  background-color: #ffee58 !important;\r\n}\r\n\r\n.yellow-text.text-lighten-1 {\r\n  color: #ffee58 !important;\r\n}\r\n\r\n.yellow.darken-1 {\r\n  background-color: #fdd835 !important;\r\n}\r\n\r\n.yellow-text.text-darken-1 {\r\n  color: #fdd835 !important;\r\n}\r\n\r\n.yellow.darken-2 {\r\n  background-color: #fbc02d !important;\r\n}\r\n\r\n.yellow-text.text-darken-2 {\r\n  color: #fbc02d !important;\r\n}\r\n\r\n.yellow.darken-3 {\r\n  background-color: #f9a825 !important;\r\n}\r\n\r\n.yellow-text.text-darken-3 {\r\n  color: #f9a825 !important;\r\n}\r\n\r\n.yellow.darken-4 {\r\n  background-color: #f57f17 !important;\r\n}\r\n\r\n.yellow-text.text-darken-4 {\r\n  color: #f57f17 !important;\r\n}\r\n\r\n.yellow.accent-1 {\r\n  background-color: #ffff8d !important;\r\n}\r\n\r\n.yellow-text.text-accent-1 {\r\n  color: #ffff8d !important;\r\n}\r\n\r\n.yellow.accent-2 {\r\n  background-color: #ffff00 !important;\r\n}\r\n\r\n.yellow-text.text-accent-2 {\r\n  color: #ffff00 !important;\r\n}\r\n\r\n.yellow.accent-3 {\r\n  background-color: #ffea00 !important;\r\n}\r\n\r\n.yellow-text.text-accent-3 {\r\n  color: #ffea00 !important;\r\n}\r\n\r\n.yellow.accent-4 {\r\n  background-color: #ffd600 !important;\r\n}\r\n\r\n.yellow-text.text-accent-4 {\r\n  color: #ffd600 !important;\r\n}\r\n\r\n.amber {\r\n  background-color: #ffc107 !important;\r\n}\r\n\r\n.amber-text {\r\n  color: #ffc107 !important;\r\n}\r\n\r\n.amber.lighten-5 {\r\n  background-color: #fff8e1 !important;\r\n}\r\n\r\n.amber-text.text-lighten-5 {\r\n  color: #fff8e1 !important;\r\n}\r\n\r\n.amber.lighten-4 {\r\n  background-color: #ffecb3 !important;\r\n}\r\n\r\n.amber-text.text-lighten-4 {\r\n  color: #ffecb3 !important;\r\n}\r\n\r\n.amber.lighten-3 {\r\n  background-color: #ffe082 !important;\r\n}\r\n\r\n.amber-text.text-lighten-3 {\r\n  color: #ffe082 !important;\r\n}\r\n\r\n.amber.lighten-2 {\r\n  background-color: #ffd54f !important;\r\n}\r\n\r\n.amber-text.text-lighten-2 {\r\n  color: #ffd54f !important;\r\n}\r\n\r\n.amber.lighten-1 {\r\n  background-color: #ffca28 !important;\r\n}\r\n\r\n.amber-text.text-lighten-1 {\r\n  color: #ffca28 !important;\r\n}\r\n\r\n.amber.darken-1 {\r\n  background-color: #ffb300 !important;\r\n}\r\n\r\n.amber-text.text-darken-1 {\r\n  color: #ffb300 !important;\r\n}\r\n\r\n.amber.darken-2 {\r\n  background-color: #ffa000 !important;\r\n}\r\n\r\n.amber-text.text-darken-2 {\r\n  color: #ffa000 !important;\r\n}\r\n\r\n.amber.darken-3 {\r\n  background-color: #ff8f00 !important;\r\n}\r\n\r\n.amber-text.text-darken-3 {\r\n  color: #ff8f00 !important;\r\n}\r\n\r\n.amber.darken-4 {\r\n  background-color: #ff6f00 !important;\r\n}\r\n\r\n.amber-text.text-darken-4 {\r\n  color: #ff6f00 !important;\r\n}\r\n\r\n.amber.accent-1 {\r\n  background-color: #ffe57f !important;\r\n}\r\n\r\n.amber-text.text-accent-1 {\r\n  color: #ffe57f !important;\r\n}\r\n\r\n.amber.accent-2 {\r\n  background-color: #ffd740 !important;\r\n}\r\n\r\n.amber-text.text-accent-2 {\r\n  color: #ffd740 !important;\r\n}\r\n\r\n.amber.accent-3 {\r\n  background-color: #ffc400 !important;\r\n}\r\n\r\n.amber-text.text-accent-3 {\r\n  color: #ffc400 !important;\r\n}\r\n\r\n.amber.accent-4 {\r\n  background-color: #ffab00 !important;\r\n}\r\n\r\n.amber-text.text-accent-4 {\r\n  color: #ffab00 !important;\r\n}\r\n\r\n.orange {\r\n  background-color: #ff9800 !important;\r\n}\r\n\r\n.orange-text {\r\n  color: #ff9800 !important;\r\n}\r\n\r\n.orange.lighten-5 {\r\n  background-color: #fff3e0 !important;\r\n}\r\n\r\n.orange-text.text-lighten-5 {\r\n  color: #fff3e0 !important;\r\n}\r\n\r\n.orange.lighten-4 {\r\n  background-color: #ffe0b2 !important;\r\n}\r\n\r\n.orange-text.text-lighten-4 {\r\n  color: #ffe0b2 !important;\r\n}\r\n\r\n.orange.lighten-3 {\r\n  background-color: #ffcc80 !important;\r\n}\r\n\r\n.orange-text.text-lighten-3 {\r\n  color: #ffcc80 !important;\r\n}\r\n\r\n.orange.lighten-2 {\r\n  background-color: #ffb74d !important;\r\n}\r\n\r\n.orange-text.text-lighten-2 {\r\n  color: #ffb74d !important;\r\n}\r\n\r\n.orange.lighten-1 {\r\n  background-color: #ffa726 !important;\r\n}\r\n\r\n.orange-text.text-lighten-1 {\r\n  color: #ffa726 !important;\r\n}\r\n\r\n.orange.darken-1 {\r\n  background-color: #fb8c00 !important;\r\n}\r\n\r\n.orange-text.text-darken-1 {\r\n  color: #fb8c00 !important;\r\n}\r\n\r\n.orange.darken-2 {\r\n  background-color: #f57c00 !important;\r\n}\r\n\r\n.orange-text.text-darken-2 {\r\n  color: #f57c00 !important;\r\n}\r\n\r\n.orange.darken-3 {\r\n  background-color: #ef6c00 !important;\r\n}\r\n\r\n.orange-text.text-darken-3 {\r\n  color: #ef6c00 !important;\r\n}\r\n\r\n.orange.darken-4 {\r\n  background-color: #e65100 !important;\r\n}\r\n\r\n.orange-text.text-darken-4 {\r\n  color: #e65100 !important;\r\n}\r\n\r\n.orange.accent-1 {\r\n  background-color: #ffd180 !important;\r\n}\r\n\r\n.orange-text.text-accent-1 {\r\n  color: #ffd180 !important;\r\n}\r\n\r\n.orange.accent-2 {\r\n  background-color: #ffab40 !important;\r\n}\r\n\r\n.orange-text.text-accent-2 {\r\n  color: #ffab40 !important;\r\n}\r\n\r\n.orange.accent-3 {\r\n  background-color: #ff9100 !important;\r\n}\r\n\r\n.orange-text.text-accent-3 {\r\n  color: #ff9100 !important;\r\n}\r\n\r\n.orange.accent-4 {\r\n  background-color: #ff6d00 !important;\r\n}\r\n\r\n.orange-text.text-accent-4 {\r\n  color: #ff6d00 !important;\r\n}\r\n\r\n.deep-orange {\r\n  background-color: #ff5722 !important;\r\n}\r\n\r\n.deep-orange-text {\r\n  color: #ff5722 !important;\r\n}\r\n\r\n.deep-orange.lighten-5 {\r\n  background-color: #fbe9e7 !important;\r\n}\r\n\r\n.deep-orange-text.text-lighten-5 {\r\n  color: #fbe9e7 !important;\r\n}\r\n\r\n.deep-orange.lighten-4 {\r\n  background-color: #ffccbc !important;\r\n}\r\n\r\n.deep-orange-text.text-lighten-4 {\r\n  color: #ffccbc !important;\r\n}\r\n\r\n.deep-orange.lighten-3 {\r\n  background-color: #ffab91 !important;\r\n}\r\n\r\n.deep-orange-text.text-lighten-3 {\r\n  color: #ffab91 !important;\r\n}\r\n\r\n.deep-orange.lighten-2 {\r\n  background-color: #ff8a65 !important;\r\n}\r\n\r\n.deep-orange-text.text-lighten-2 {\r\n  color: #ff8a65 !important;\r\n}\r\n\r\n.deep-orange.lighten-1 {\r\n  background-color: #ff7043 !important;\r\n}\r\n\r\n.deep-orange-text.text-lighten-1 {\r\n  color: #ff7043 !important;\r\n}\r\n\r\n.deep-orange.darken-1 {\r\n  background-color: #f4511e !important;\r\n}\r\n\r\n.deep-orange-text.text-darken-1 {\r\n  color: #f4511e !important;\r\n}\r\n\r\n.deep-orange.darken-2 {\r\n  background-color: #e64a19 !important;\r\n}\r\n\r\n.deep-orange-text.text-darken-2 {\r\n  color: #e64a19 !important;\r\n}\r\n\r\n.deep-orange.darken-3 {\r\n  background-color: #d84315 !important;\r\n}\r\n\r\n.deep-orange-text.text-darken-3 {\r\n  color: #d84315 !important;\r\n}\r\n\r\n.deep-orange.darken-4 {\r\n  background-color: #bf360c !important;\r\n}\r\n\r\n.deep-orange-text.text-darken-4 {\r\n  color: #bf360c !important;\r\n}\r\n\r\n.deep-orange.accent-1 {\r\n  background-color: #ff9e80 !important;\r\n}\r\n\r\n.deep-orange-text.text-accent-1 {\r\n  color: #ff9e80 !important;\r\n}\r\n\r\n.deep-orange.accent-2 {\r\n  background-color: #ff6e40 !important;\r\n}\r\n\r\n.deep-orange-text.text-accent-2 {\r\n  color: #ff6e40 !important;\r\n}\r\n\r\n.deep-orange.accent-3 {\r\n  background-color: #ff3d00 !important;\r\n}\r\n\r\n.deep-orange-text.text-accent-3 {\r\n  color: #ff3d00 !important;\r\n}\r\n\r\n.deep-orange.accent-4 {\r\n  background-color: #dd2c00 !important;\r\n}\r\n\r\n.deep-orange-text.text-accent-4 {\r\n  color: #dd2c00 !important;\r\n}\r\n\r\n.brown {\r\n  background-color: #795548 !important;\r\n}\r\n\r\n.brown-text {\r\n  color: #795548 !important;\r\n}\r\n\r\n.brown.lighten-5 {\r\n  background-color: #efebe9 !important;\r\n}\r\n\r\n.brown-text.text-lighten-5 {\r\n  color: #efebe9 !important;\r\n}\r\n\r\n.brown.lighten-4 {\r\n  background-color: #d7ccc8 !important;\r\n}\r\n\r\n.brown-text.text-lighten-4 {\r\n  color: #d7ccc8 !important;\r\n}\r\n\r\n.brown.lighten-3 {\r\n  background-color: #bcaaa4 !important;\r\n}\r\n\r\n.brown-text.text-lighten-3 {\r\n  color: #bcaaa4 !important;\r\n}\r\n\r\n.brown.lighten-2 {\r\n  background-color: #a1887f !important;\r\n}\r\n\r\n.brown-text.text-lighten-2 {\r\n  color: #a1887f !important;\r\n}\r\n\r\n.brown.lighten-1 {\r\n  background-color: #8d6e63 !important;\r\n}\r\n\r\n.brown-text.text-lighten-1 {\r\n  color: #8d6e63 !important;\r\n}\r\n\r\n.brown.darken-1 {\r\n  background-color: #6d4c41 !important;\r\n}\r\n\r\n.brown-text.text-darken-1 {\r\n  color: #6d4c41 !important;\r\n}\r\n\r\n.brown.darken-2 {\r\n  background-color: #5d4037 !important;\r\n}\r\n\r\n.brown-text.text-darken-2 {\r\n  color: #5d4037 !important;\r\n}\r\n\r\n.brown.darken-3 {\r\n  background-color: #4e342e !important;\r\n}\r\n\r\n.brown-text.text-darken-3 {\r\n  color: #4e342e !important;\r\n}\r\n\r\n.brown.darken-4 {\r\n  background-color: #3e2723 !important;\r\n}\r\n\r\n.brown-text.text-darken-4 {\r\n  color: #3e2723 !important;\r\n}\r\n\r\n.blue-grey {\r\n  background-color: #607d8b !important;\r\n}\r\n\r\n.blue-grey-text {\r\n  color: #607d8b !important;\r\n}\r\n\r\n.blue-grey.lighten-5 {\r\n  background-color: #eceff1 !important;\r\n}\r\n\r\n.blue-grey-text.text-lighten-5 {\r\n  color: #eceff1 !important;\r\n}\r\n\r\n.blue-grey.lighten-4 {\r\n  background-color: #cfd8dc !important;\r\n}\r\n\r\n.blue-grey-text.text-lighten-4 {\r\n  color: #cfd8dc !important;\r\n}\r\n\r\n.blue-grey.lighten-3 {\r\n  background-color: #b0bec5 !important;\r\n}\r\n\r\n.blue-grey-text.text-lighten-3 {\r\n  color: #b0bec5 !important;\r\n}\r\n\r\n.blue-grey.lighten-2 {\r\n  background-color: #90a4ae !important;\r\n}\r\n\r\n.blue-grey-text.text-lighten-2 {\r\n  color: #90a4ae !important;\r\n}\r\n\r\n.blue-grey.lighten-1 {\r\n  background-color: #78909c !important;\r\n}\r\n\r\n.blue-grey-text.text-lighten-1 {\r\n  color: #78909c !important;\r\n}\r\n\r\n.blue-grey.darken-1 {\r\n  background-color: #546e7a !important;\r\n}\r\n\r\n.blue-grey-text.text-darken-1 {\r\n  color: #546e7a !important;\r\n}\r\n\r\n.blue-grey.darken-2 {\r\n  background-color: #455a64 !important;\r\n}\r\n\r\n.blue-grey-text.text-darken-2 {\r\n  color: #455a64 !important;\r\n}\r\n\r\n.blue-grey.darken-3 {\r\n  background-color: #37474f !important;\r\n}\r\n\r\n.blue-grey-text.text-darken-3 {\r\n  color: #37474f !important;\r\n}\r\n\r\n.blue-grey.darken-4 {\r\n  background-color: #263238 !important;\r\n}\r\n\r\n.blue-grey-text.text-darken-4 {\r\n  color: #263238 !important;\r\n}\r\n\r\n.grey {\r\n  background-color: #9e9e9e !important;\r\n}\r\n\r\n.grey-text {\r\n  color: #9e9e9e !important;\r\n}\r\n\r\n.grey.lighten-5 {\r\n  background-color: #fafafa !important;\r\n}\r\n\r\n.grey-text.text-lighten-5 {\r\n  color: #fafafa !important;\r\n}\r\n\r\n.grey.lighten-4 {\r\n  background-color: #f5f5f5 !important;\r\n}\r\n\r\n.grey-text.text-lighten-4 {\r\n  color: #f5f5f5 !important;\r\n}\r\n\r\n.grey.lighten-3 {\r\n  background-color: #eeeeee !important;\r\n}\r\n\r\n.grey-text.text-lighten-3 {\r\n  color: #eeeeee !important;\r\n}\r\n\r\n.grey.lighten-2 {\r\n  background-color: #e0e0e0 !important;\r\n}\r\n\r\n.grey-text.text-lighten-2 {\r\n  color: #e0e0e0 !important;\r\n}\r\n\r\n.grey.lighten-1 {\r\n  background-color: #bdbdbd !important;\r\n}\r\n\r\n.grey-text.text-lighten-1 {\r\n  color: #bdbdbd !important;\r\n}\r\n\r\n.grey.darken-1 {\r\n  background-color: #757575 !important;\r\n}\r\n\r\n.grey-text.text-darken-1 {\r\n  color: #757575 !important;\r\n}\r\n\r\n.grey.darken-2 {\r\n  background-color: #616161 !important;\r\n}\r\n\r\n.grey-text.text-darken-2 {\r\n  color: #616161 !important;\r\n}\r\n\r\n.grey.darken-3 {\r\n  background-color: #424242 !important;\r\n}\r\n\r\n.grey-text.text-darken-3 {\r\n  color: #424242 !important;\r\n}\r\n\r\n.grey.darken-4 {\r\n  background-color: #212121 !important;\r\n}\r\n\r\n.grey-text.text-darken-4 {\r\n  color: #212121 !important;\r\n}\r\n\r\n.black {\r\n  background-color: #000000 !important;\r\n}\r\n\r\n.black-text {\r\n  color: #000000 !important;\r\n}\r\n\r\n.white {\r\n  background-color: #FFFFFF !important;\r\n}\r\n\r\n.white-text {\r\n  color: #FFFFFF !important;\r\n}\r\n\r\n.transparent {\r\n  background-color: transparent !important;\r\n}\r\n\r\n.transparent-text {\r\n  color: transparent !important;\r\n}\r\n\r\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\r\n/**\r\n * 1. Set default font family to sans-serif.\r\n * 2. Prevent iOS and IE text size adjust after device orientation change,\r\n *    without disabling user zoom.\r\n */\r\nhtml {\r\n  font-family: sans-serif;\r\n  /* 1 */\r\n  -ms-text-size-adjust: 100%;\r\n  /* 2 */\r\n  -webkit-text-size-adjust: 100%;\r\n  /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default margin.\r\n */\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n/* HTML5 display definitions\r\n   ========================================================================== */\r\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nmenu,\r\nnav,\r\nsection,\r\nsummary {\r\n  display: block;\r\n}\r\n\r\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo {\r\n  display: inline-block;\r\n  /* 1 */\r\n  vertical-align: baseline;\r\n  /* 2 */\r\n}\r\n\r\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\r\naudio:not([controls]) {\r\n  display: none;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\r\n */\r\n[hidden],\r\ntemplate {\r\n  display: none;\r\n}\r\n\r\n/* Links\r\n   ========================================================================== */\r\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\r\na {\r\n  background-color: transparent;\r\n}\r\n\r\n/**\r\n * Improve readability of focused elements when they are also in an\r\n * active/hover state.\r\n */\r\na:active,\r\na:hover {\r\n  outline: 0;\r\n}\r\n\r\n/* Text-level semantics\r\n   ========================================================================== */\r\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\r\nabbr[title] {\r\n  border-bottom: 1px dotted;\r\n}\r\n\r\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\r\nb,\r\nstrong {\r\n  font-weight: bold;\r\n}\r\n\r\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\r\ndfn {\r\n  font-style: italic;\r\n}\r\n\r\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\r\nh1 {\r\n  font-size: 2em;\r\n  margin: 0.67em 0;\r\n}\r\n\r\n/**\r\n * Address styling not present in IE 8/9.\r\n */\r\nmark {\r\n  background: #ff0;\r\n  color: #000;\r\n}\r\n\r\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\r\nsmall {\r\n  font-size: 80%;\r\n}\r\n\r\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\r\nsub,\r\nsup {\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  position: relative;\r\n  vertical-align: baseline;\r\n}\r\n\r\nsup {\r\n  top: -0.5em;\r\n}\r\n\r\nsub {\r\n  bottom: -0.25em;\r\n}\r\n\r\n/* Embedded content\r\n   ========================================================================== */\r\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\r\nimg {\r\n  border: 0;\r\n}\r\n\r\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\r\nsvg:not(:root) {\r\n  overflow: hidden;\r\n}\r\n\r\n/* Grouping content\r\n   ========================================================================== */\r\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\r\nfigure {\r\n  margin: 1em 40px;\r\n}\r\n\r\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\r\nhr {\r\n  box-sizing: content-box;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Contain overflow in all browsers.\r\n */\r\npre {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: monospace, monospace;\r\n  font-size: 1em;\r\n}\r\n\r\n/* Forms\r\n   ========================================================================== */\r\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\r\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  color: inherit;\r\n  /* 1 */\r\n  font: inherit;\r\n  /* 2 */\r\n  margin: 0;\r\n  /* 3 */\r\n}\r\n\r\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\r\nbutton {\r\n  overflow: visible;\r\n}\r\n\r\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\r\nbutton,\r\nselect {\r\n  text-transform: none;\r\n}\r\n\r\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\r\nbutton,\r\nhtml input[type=\"button\"],\r\ninput[type=\"reset\"],\r\ninput[type=\"submit\"] {\r\n  -webkit-appearance: button;\r\n  /* 2 */\r\n  cursor: pointer;\r\n  /* 3 */\r\n}\r\n\r\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\r\nbutton[disabled],\r\nhtml input[disabled] {\r\n  cursor: default;\r\n}\r\n\r\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\r\nbutton::-moz-focus-inner,\r\ninput::-moz-focus-inner {\r\n  border: 0;\r\n  padding: 0;\r\n}\r\n\r\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\r\ninput {\r\n  line-height: normal;\r\n}\r\n\r\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  box-sizing: border-box;\r\n  /* 1 */\r\n  padding: 0;\r\n  /* 2 */\r\n}\r\n\r\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\r\ninput[type=\"number\"]::-webkit-inner-spin-button,\r\ninput[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\n\r\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\r\n */\r\ninput[type=\"search\"] {\r\n  -webkit-appearance: textfield;\r\n  /* 1 */\r\n  box-sizing: content-box;\r\n  /* 2 */\r\n}\r\n\r\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\r\ninput[type=\"search\"]::-webkit-search-cancel-button,\r\ninput[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\n\r\n/**\r\n * Define consistent border, margin, and padding.\r\n */\r\nfieldset {\r\n  border: 1px solid #c0c0c0;\r\n  margin: 0 2px;\r\n  padding: 0.35em 0.625em 0.75em;\r\n}\r\n\r\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\r\nlegend {\r\n  border: 0;\r\n  /* 1 */\r\n  padding: 0;\r\n  /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\r\ntextarea {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\r\noptgroup {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Tables\r\n   ========================================================================== */\r\n/**\r\n * Remove most spacing between table cells.\r\n */\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n\r\ntd,\r\nth {\r\n  padding: 0;\r\n}\r\n\r\nhtml {\r\n  box-sizing: border-box;\r\n}\r\n\r\n*, *:before, *:after {\r\n  box-sizing: inherit;\r\n}\r\n\r\nul:not(.browser-default) {\r\n  padding-left: 0;\r\n  list-style-type: none;\r\n}\r\n\r\nul:not(.browser-default) li {\r\n  list-style-type: none;\r\n}\r\n\r\na {\r\n  color: #039be5;\r\n  text-decoration: none;\r\n  -webkit-tap-highlight-color: transparent;\r\n}\r\n\r\n.valign-wrapper {\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-align-items: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n\r\n.valign-wrapper .valign {\r\n  display: block;\r\n}\r\n\r\n.clearfix {\r\n  clear: both;\r\n}\r\n\r\n.z-depth-0 {\r\n  box-shadow: none !important;\r\n}\r\n\r\n.z-depth-1, nav, .card-panel, .card, .toast, .btn, .btn-large, .btn-floating, .dropdown-content, .collapsible, .side-nav {\r\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.z-depth-1-half, .btn:hover, .btn-large:hover, .btn-floating:hover {\r\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.z-depth-2 {\r\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.z-depth-3 {\r\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.z-depth-4, .modal {\r\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.z-depth-5 {\r\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.hoverable {\r\n  transition: box-shadow .25s;\r\n  box-shadow: 0;\r\n}\r\n\r\n.hoverable:hover {\r\n  transition: box-shadow .25s;\r\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n}\r\n\r\n.divider {\r\n  height: 1px;\r\n  overflow: hidden;\r\n  background-color: #e0e0e0;\r\n}\r\n\r\nblockquote {\r\n  margin: 20px 0;\r\n  padding-left: 1.5rem;\r\n  border-left: 5px solid #ee6e73;\r\n}\r\n\r\ni {\r\n  line-height: inherit;\r\n}\r\n\r\ni.left {\r\n  float: left;\r\n  margin-right: 15px;\r\n}\r\n\r\ni.right {\r\n  float: right;\r\n  margin-left: 15px;\r\n}\r\n\r\ni.tiny {\r\n  font-size: 1rem;\r\n}\r\n\r\ni.small {\r\n  font-size: 2rem;\r\n}\r\n\r\ni.medium {\r\n  font-size: 4rem;\r\n}\r\n\r\ni.large {\r\n  font-size: 6rem;\r\n}\r\n\r\nimg.responsive-img,\r\nvideo.responsive-video {\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n\r\n.pagination li {\r\n  display: inline-block;\r\n  border-radius: 2px;\r\n  text-align: center;\r\n  vertical-align: top;\r\n  height: 30px;\r\n}\r\n\r\n.pagination li a {\r\n  color: #444;\r\n  display: inline-block;\r\n  font-size: 1.2rem;\r\n  padding: 0 10px;\r\n  line-height: 30px;\r\n}\r\n\r\n.pagination li.active a {\r\n  color: #fff;\r\n}\r\n\r\n.pagination li.active {\r\n  background-color: #ee6e73;\r\n}\r\n\r\n.pagination li.disabled a {\r\n  cursor: default;\r\n  color: #999;\r\n}\r\n\r\n.pagination li i {\r\n  font-size: 2rem;\r\n}\r\n\r\n.pagination li.pages ul li {\r\n  display: inline-block;\r\n  float: none;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .pagination {\r\n    width: 100%;\r\n  }\r\n  .pagination li.prev,\r\n  .pagination li.next {\r\n    width: 10%;\r\n  }\r\n  .pagination li.pages {\r\n    width: 80%;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n  }\r\n}\r\n\r\n.breadcrumb {\r\n  font-size: 18px;\r\n  color: rgba(255, 255, 255, 0.7);\r\n}\r\n\r\n.breadcrumb i,\r\n.breadcrumb [class^=\"mdi-\"], .breadcrumb [class*=\"mdi-\"],\r\n.breadcrumb i.material-icons {\r\n  display: inline-block;\r\n  float: left;\r\n  font-size: 24px;\r\n}\r\n\r\n.breadcrumb:before {\r\n  content: '\\E5CC';\r\n  color: rgba(255, 255, 255, 0.7);\r\n  vertical-align: top;\r\n  display: inline-block;\r\n  font-family: 'Material Icons';\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 25px;\r\n  margin: 0 10px 0 8px;\r\n  -webkit-font-smoothing: antialiased;\r\n}\r\n\r\n.breadcrumb:first-child:before {\r\n  display: none;\r\n}\r\n\r\n.breadcrumb:last-child {\r\n  color: #fff;\r\n}\r\n\r\n.parallax-container {\r\n  position: relative;\r\n  overflow: hidden;\r\n  height: 500px;\r\n}\r\n\r\n.parallax {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  z-index: -1;\r\n}\r\n\r\n.parallax img {\r\n  display: none;\r\n  position: absolute;\r\n  left: 50%;\r\n  bottom: 0;\r\n  min-width: 100%;\r\n  min-height: 100%;\r\n  -webkit-transform: translate3d(0, 0, 0);\r\n  transform: translate3d(0, 0, 0);\r\n  -webkit-transform: translateX(-50%);\r\n          transform: translateX(-50%);\r\n}\r\n\r\n.pin-top, .pin-bottom {\r\n  position: relative;\r\n}\r\n\r\n.pinned {\r\n  position: fixed !important;\r\n}\r\n\r\n/*********************\r\n  Transition Classes\r\n**********************/\r\nul.staggered-list li {\r\n  opacity: 0;\r\n}\r\n\r\n.fade-in {\r\n  opacity: 0;\r\n  -webkit-transform-origin: 0 50%;\r\n          transform-origin: 0 50%;\r\n}\r\n\r\n/*********************\r\n  Media Query Classes\r\n**********************/\r\n@media only screen and (max-width: 600px) {\r\n  .hide-on-small-only, .hide-on-small-and-down {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .hide-on-med-and-down {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 601px) {\r\n  .hide-on-med-and-up {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 600px) and (max-width: 992px) {\r\n  .hide-on-med-only {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  .hide-on-large-only {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  .show-on-large {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 600px) and (max-width: 992px) {\r\n  .show-on-medium {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  .show-on-small {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 601px) {\r\n  .show-on-medium-and-up {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .show-on-medium-and-down {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  .center-on-small-only {\r\n    text-align: center;\r\n  }\r\n}\r\n\r\nfooter.page-footer {\r\n  margin-top: 20px;\r\n  padding-top: 20px;\r\n  background-color: #ee6e73;\r\n}\r\n\r\nfooter.page-footer .footer-copyright {\r\n  overflow: hidden;\r\n  height: 50px;\r\n  line-height: 50px;\r\n  color: rgba(255, 255, 255, 0.8);\r\n  background-color: rgba(51, 51, 51, 0.08);\r\n}\r\n\r\ntable, th, td {\r\n  border: none;\r\n}\r\n\r\ntable {\r\n  width: 100%;\r\n  display: table;\r\n}\r\n\r\ntable.bordered > thead > tr,\r\ntable.bordered > tbody > tr {\r\n  border-bottom: 1px solid #d0d0d0;\r\n}\r\n\r\ntable.striped > tbody > tr:nth-child(odd) {\r\n  background-color: #f2f2f2;\r\n}\r\n\r\ntable.striped > tbody > tr > td {\r\n  border-radius: 0;\r\n}\r\n\r\ntable.highlight > tbody > tr {\r\n  transition: background-color .25s ease;\r\n}\r\n\r\ntable.highlight > tbody > tr:hover {\r\n  background-color: #f2f2f2;\r\n}\r\n\r\ntable.centered thead tr th, table.centered tbody tr td {\r\n  text-align: center;\r\n}\r\n\r\nthead {\r\n  border-bottom: 1px solid #d0d0d0;\r\n}\r\n\r\ntd, th {\r\n  padding: 15px 5px;\r\n  display: table-cell;\r\n  text-align: left;\r\n  vertical-align: middle;\r\n  border-radius: 2px;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  table.responsive-table {\r\n    width: 100%;\r\n    border-collapse: collapse;\r\n    border-spacing: 0;\r\n    display: block;\r\n    position: relative;\r\n    /* sort out borders */\r\n  }\r\n  table.responsive-table td:empty:before {\r\n    content: '\\A0';\r\n  }\r\n  table.responsive-table th,\r\n  table.responsive-table td {\r\n    margin: 0;\r\n    vertical-align: top;\r\n  }\r\n  table.responsive-table th {\r\n    text-align: left;\r\n  }\r\n  table.responsive-table thead {\r\n    display: block;\r\n    float: left;\r\n  }\r\n  table.responsive-table thead tr {\r\n    display: block;\r\n    padding: 0 10px 0 0;\r\n  }\r\n  table.responsive-table thead tr th::before {\r\n    content: \"\\A0\";\r\n  }\r\n  table.responsive-table tbody {\r\n    display: block;\r\n    width: auto;\r\n    position: relative;\r\n    overflow-x: auto;\r\n    white-space: nowrap;\r\n  }\r\n  table.responsive-table tbody tr {\r\n    display: inline-block;\r\n    vertical-align: top;\r\n  }\r\n  table.responsive-table th {\r\n    display: block;\r\n    text-align: right;\r\n  }\r\n  table.responsive-table td {\r\n    display: block;\r\n    min-height: 1.25em;\r\n    text-align: left;\r\n  }\r\n  table.responsive-table tr {\r\n    padding: 0 10px;\r\n  }\r\n  table.responsive-table thead {\r\n    border: 0;\r\n    border-right: 1px solid #d0d0d0;\r\n  }\r\n  table.responsive-table.bordered th {\r\n    border-bottom: 0;\r\n    border-left: 0;\r\n  }\r\n  table.responsive-table.bordered td {\r\n    border-left: 0;\r\n    border-right: 0;\r\n    border-bottom: 0;\r\n  }\r\n  table.responsive-table.bordered tr {\r\n    border: 0;\r\n  }\r\n  table.responsive-table.bordered tbody tr {\r\n    border-right: 1px solid #d0d0d0;\r\n  }\r\n}\r\n\r\n.collection {\r\n  margin: 0.5rem 0 1rem 0;\r\n  border: 1px solid #e0e0e0;\r\n  border-radius: 2px;\r\n  overflow: hidden;\r\n  position: relative;\r\n}\r\n\r\n.collection .collection-item {\r\n  background-color: #fff;\r\n  line-height: 1.5rem;\r\n  padding: 10px 20px;\r\n  margin: 0;\r\n  border-bottom: 1px solid #e0e0e0;\r\n}\r\n\r\n.collection .collection-item.avatar {\r\n  min-height: 84px;\r\n  padding-left: 72px;\r\n  position: relative;\r\n}\r\n\r\n.collection .collection-item.avatar .circle {\r\n  position: absolute;\r\n  width: 42px;\r\n  height: 42px;\r\n  overflow: hidden;\r\n  left: 15px;\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n\r\n.collection .collection-item.avatar i.circle {\r\n  font-size: 18px;\r\n  line-height: 42px;\r\n  color: #fff;\r\n  background-color: #999;\r\n  text-align: center;\r\n}\r\n\r\n.collection .collection-item.avatar .title {\r\n  font-size: 16px;\r\n}\r\n\r\n.collection .collection-item.avatar p {\r\n  margin: 0;\r\n}\r\n\r\n.collection .collection-item.avatar .secondary-content {\r\n  position: absolute;\r\n  top: 16px;\r\n  right: 16px;\r\n}\r\n\r\n.collection .collection-item:last-child {\r\n  border-bottom: none;\r\n}\r\n\r\n.collection .collection-item.active {\r\n  background-color: #26a69a;\r\n  color: #eafaf9;\r\n}\r\n\r\n.collection .collection-item.active .secondary-content {\r\n  color: #fff;\r\n}\r\n\r\n.collection a.collection-item {\r\n  display: block;\r\n  transition: .25s;\r\n  color: #26a69a;\r\n}\r\n\r\n.collection a.collection-item:not(.active):hover {\r\n  background-color: #ddd;\r\n}\r\n\r\n.collection.with-header .collection-header {\r\n  background-color: #fff;\r\n  border-bottom: 1px solid #e0e0e0;\r\n  padding: 10px 20px;\r\n}\r\n\r\n.collection.with-header .collection-item {\r\n  padding-left: 30px;\r\n}\r\n\r\n.collection.with-header .collection-item.avatar {\r\n  padding-left: 72px;\r\n}\r\n\r\n.secondary-content {\r\n  float: right;\r\n  color: #26a69a;\r\n}\r\n\r\n.collapsible .collection {\r\n  margin: 0;\r\n  border: none;\r\n}\r\n\r\nspan.badge {\r\n  min-width: 3rem;\r\n  padding: 0 6px;\r\n  margin-left: 14px;\r\n  text-align: center;\r\n  font-size: 1rem;\r\n  line-height: inherit;\r\n  color: #757575;\r\n  float: right;\r\n  box-sizing: border-box;\r\n}\r\n\r\nspan.badge.new {\r\n  font-weight: 300;\r\n  font-size: 0.8rem;\r\n  color: #fff;\r\n  background-color: #26a69a;\r\n  border-radius: 2px;\r\n}\r\n\r\nspan.badge.new:after {\r\n  content: \" new\";\r\n}\r\n\r\nspan.badge[data-badge-caption]::after {\r\n  content: \" \" attr(data-badge-caption);\r\n}\r\n\r\nnav ul a span.badge {\r\n  display: inline-block;\r\n  float: none;\r\n  margin-left: 4px;\r\n  line-height: 22px;\r\n  height: 22px;\r\n}\r\n\r\n.side-nav span.badge.new,\r\n.collapsible span.badge.new {\r\n  position: relative;\r\n  background-color: transparent;\r\n}\r\n\r\n.side-nav span.badge.new::before,\r\n.collapsible span.badge.new::before {\r\n  content: '';\r\n  position: absolute;\r\n  top: 10px;\r\n  right: 0;\r\n  bottom: 10px;\r\n  left: 0;\r\n  background-color: #26a69a;\r\n  border-radius: 2px;\r\n  z-index: -1;\r\n}\r\n\r\n.collapsible span.badge.new {\r\n  z-index: 1;\r\n}\r\n\r\n.video-container {\r\n  position: relative;\r\n  padding-bottom: 56.25%;\r\n  height: 0;\r\n  overflow: hidden;\r\n}\r\n\r\n.video-container iframe, .video-container object, .video-container embed {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.progress {\r\n  position: relative;\r\n  height: 4px;\r\n  display: block;\r\n  width: 100%;\r\n  background-color: #acece6;\r\n  border-radius: 2px;\r\n  margin: 0.5rem 0 1rem 0;\r\n  overflow: hidden;\r\n}\r\n\r\n.progress .determinate {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  background-color: #26a69a;\r\n  transition: width .3s linear;\r\n}\r\n\r\n.progress .indeterminate {\r\n  background-color: #26a69a;\r\n}\r\n\r\n.progress .indeterminate:before {\r\n  content: '';\r\n  position: absolute;\r\n  background-color: inherit;\r\n  top: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  will-change: left, right;\r\n  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\r\n          animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\r\n}\r\n\r\n.progress .indeterminate:after {\r\n  content: '';\r\n  position: absolute;\r\n  background-color: inherit;\r\n  top: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  will-change: left, right;\r\n  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\r\n          animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\r\n  -webkit-animation-delay: 1.15s;\r\n          animation-delay: 1.15s;\r\n}\r\n\r\n@-webkit-keyframes indeterminate {\r\n  0% {\r\n    left: -35%;\r\n    right: 100%;\r\n  }\r\n  60% {\r\n    left: 100%;\r\n    right: -90%;\r\n  }\r\n  100% {\r\n    left: 100%;\r\n    right: -90%;\r\n  }\r\n}\r\n\r\n@keyframes indeterminate {\r\n  0% {\r\n    left: -35%;\r\n    right: 100%;\r\n  }\r\n  60% {\r\n    left: 100%;\r\n    right: -90%;\r\n  }\r\n  100% {\r\n    left: 100%;\r\n    right: -90%;\r\n  }\r\n}\r\n\r\n@-webkit-keyframes indeterminate-short {\r\n  0% {\r\n    left: -200%;\r\n    right: 100%;\r\n  }\r\n  60% {\r\n    left: 107%;\r\n    right: -8%;\r\n  }\r\n  100% {\r\n    left: 107%;\r\n    right: -8%;\r\n  }\r\n}\r\n\r\n@keyframes indeterminate-short {\r\n  0% {\r\n    left: -200%;\r\n    right: 100%;\r\n  }\r\n  60% {\r\n    left: 107%;\r\n    right: -8%;\r\n  }\r\n  100% {\r\n    left: 107%;\r\n    right: -8%;\r\n  }\r\n}\r\n\r\n/*******************\r\n  Utility Classes\r\n*******************/\r\n.hide {\r\n  display: none !important;\r\n}\r\n\r\n.left-align {\r\n  text-align: left;\r\n}\r\n\r\n.right-align {\r\n  text-align: right;\r\n}\r\n\r\n.center, .center-align {\r\n  text-align: center;\r\n}\r\n\r\n.left {\r\n  float: left !important;\r\n}\r\n\r\n.right {\r\n  float: right !important;\r\n}\r\n\r\n.no-select, input[type=range],\r\ninput[type=range] + .thumb {\r\n  -webkit-touch-callout: none;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n.circle {\r\n  border-radius: 50%;\r\n}\r\n\r\n.center-block {\r\n  display: block;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\n.truncate {\r\n  display: block;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n.no-padding {\r\n  padding: 0 !important;\r\n}\r\n\r\n/* This is needed for some mobile phones to display the Google Icon font properly */\r\n.material-icons {\r\n  text-rendering: optimizeLegibility;\r\n  -webkit-font-feature-settings: 'liga';\r\n     -moz-font-feature-settings: 'liga';\r\n          font-feature-settings: 'liga';\r\n}\r\n\r\n.container {\r\n  margin: 0 auto;\r\n  max-width: 1280px;\r\n  width: 90%;\r\n}\r\n\r\n@media only screen and (min-width: 601px) {\r\n  .container {\r\n    width: 85%;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  .container {\r\n    width: 70%;\r\n  }\r\n}\r\n\r\n.container .row {\r\n  margin-left: -0.75rem;\r\n  margin-right: -0.75rem;\r\n}\r\n\r\n.section {\r\n  padding-top: 1rem;\r\n  padding-bottom: 1rem;\r\n}\r\n\r\n.section.no-pad {\r\n  padding: 0;\r\n}\r\n\r\n.section.no-pad-bot {\r\n  padding-bottom: 0;\r\n}\r\n\r\n.section.no-pad-top {\r\n  padding-top: 0;\r\n}\r\n\r\n.row {\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n.row:after {\r\n  content: \"\";\r\n  display: table;\r\n  clear: both;\r\n}\r\n\r\n.row .col {\r\n  float: left;\r\n  box-sizing: border-box;\r\n  padding: 0 0.75rem;\r\n  min-height: 1px;\r\n}\r\n\r\n.row .col[class*=\"push-\"], .row .col[class*=\"pull-\"] {\r\n  position: relative;\r\n}\r\n\r\n.row .col.s1 {\r\n  width: 8.3333333333%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s2 {\r\n  width: 16.6666666667%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s3 {\r\n  width: 25%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s4 {\r\n  width: 33.3333333333%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s5 {\r\n  width: 41.6666666667%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s6 {\r\n  width: 50%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s7 {\r\n  width: 58.3333333333%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s8 {\r\n  width: 66.6666666667%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s9 {\r\n  width: 75%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s10 {\r\n  width: 83.3333333333%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s11 {\r\n  width: 91.6666666667%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.s12 {\r\n  width: 100%;\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n\r\n.row .col.offset-s1 {\r\n  margin-left: 8.3333333333%;\r\n}\r\n\r\n.row .col.pull-s1 {\r\n  right: 8.3333333333%;\r\n}\r\n\r\n.row .col.push-s1 {\r\n  left: 8.3333333333%;\r\n}\r\n\r\n.row .col.offset-s2 {\r\n  margin-left: 16.6666666667%;\r\n}\r\n\r\n.row .col.pull-s2 {\r\n  right: 16.6666666667%;\r\n}\r\n\r\n.row .col.push-s2 {\r\n  left: 16.6666666667%;\r\n}\r\n\r\n.row .col.offset-s3 {\r\n  margin-left: 25%;\r\n}\r\n\r\n.row .col.pull-s3 {\r\n  right: 25%;\r\n}\r\n\r\n.row .col.push-s3 {\r\n  left: 25%;\r\n}\r\n\r\n.row .col.offset-s4 {\r\n  margin-left: 33.3333333333%;\r\n}\r\n\r\n.row .col.pull-s4 {\r\n  right: 33.3333333333%;\r\n}\r\n\r\n.row .col.push-s4 {\r\n  left: 33.3333333333%;\r\n}\r\n\r\n.row .col.offset-s5 {\r\n  margin-left: 41.6666666667%;\r\n}\r\n\r\n.row .col.pull-s5 {\r\n  right: 41.6666666667%;\r\n}\r\n\r\n.row .col.push-s5 {\r\n  left: 41.6666666667%;\r\n}\r\n\r\n.row .col.offset-s6 {\r\n  margin-left: 50%;\r\n}\r\n\r\n.row .col.pull-s6 {\r\n  right: 50%;\r\n}\r\n\r\n.row .col.push-s6 {\r\n  left: 50%;\r\n}\r\n\r\n.row .col.offset-s7 {\r\n  margin-left: 58.3333333333%;\r\n}\r\n\r\n.row .col.pull-s7 {\r\n  right: 58.3333333333%;\r\n}\r\n\r\n.row .col.push-s7 {\r\n  left: 58.3333333333%;\r\n}\r\n\r\n.row .col.offset-s8 {\r\n  margin-left: 66.6666666667%;\r\n}\r\n\r\n.row .col.pull-s8 {\r\n  right: 66.6666666667%;\r\n}\r\n\r\n.row .col.push-s8 {\r\n  left: 66.6666666667%;\r\n}\r\n\r\n.row .col.offset-s9 {\r\n  margin-left: 75%;\r\n}\r\n\r\n.row .col.pull-s9 {\r\n  right: 75%;\r\n}\r\n\r\n.row .col.push-s9 {\r\n  left: 75%;\r\n}\r\n\r\n.row .col.offset-s10 {\r\n  margin-left: 83.3333333333%;\r\n}\r\n\r\n.row .col.pull-s10 {\r\n  right: 83.3333333333%;\r\n}\r\n\r\n.row .col.push-s10 {\r\n  left: 83.3333333333%;\r\n}\r\n\r\n.row .col.offset-s11 {\r\n  margin-left: 91.6666666667%;\r\n}\r\n\r\n.row .col.pull-s11 {\r\n  right: 91.6666666667%;\r\n}\r\n\r\n.row .col.push-s11 {\r\n  left: 91.6666666667%;\r\n}\r\n\r\n.row .col.offset-s12 {\r\n  margin-left: 100%;\r\n}\r\n\r\n.row .col.pull-s12 {\r\n  right: 100%;\r\n}\r\n\r\n.row .col.push-s12 {\r\n  left: 100%;\r\n}\r\n\r\n@media only screen and (min-width: 601px) {\r\n  .row .col.m1 {\r\n    width: 8.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m2 {\r\n    width: 16.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m3 {\r\n    width: 25%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m4 {\r\n    width: 33.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m5 {\r\n    width: 41.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m6 {\r\n    width: 50%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m7 {\r\n    width: 58.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m8 {\r\n    width: 66.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m9 {\r\n    width: 75%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m10 {\r\n    width: 83.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m11 {\r\n    width: 91.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.m12 {\r\n    width: 100%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.offset-m1 {\r\n    margin-left: 8.3333333333%;\r\n  }\r\n  .row .col.pull-m1 {\r\n    right: 8.3333333333%;\r\n  }\r\n  .row .col.push-m1 {\r\n    left: 8.3333333333%;\r\n  }\r\n  .row .col.offset-m2 {\r\n    margin-left: 16.6666666667%;\r\n  }\r\n  .row .col.pull-m2 {\r\n    right: 16.6666666667%;\r\n  }\r\n  .row .col.push-m2 {\r\n    left: 16.6666666667%;\r\n  }\r\n  .row .col.offset-m3 {\r\n    margin-left: 25%;\r\n  }\r\n  .row .col.pull-m3 {\r\n    right: 25%;\r\n  }\r\n  .row .col.push-m3 {\r\n    left: 25%;\r\n  }\r\n  .row .col.offset-m4 {\r\n    margin-left: 33.3333333333%;\r\n  }\r\n  .row .col.pull-m4 {\r\n    right: 33.3333333333%;\r\n  }\r\n  .row .col.push-m4 {\r\n    left: 33.3333333333%;\r\n  }\r\n  .row .col.offset-m5 {\r\n    margin-left: 41.6666666667%;\r\n  }\r\n  .row .col.pull-m5 {\r\n    right: 41.6666666667%;\r\n  }\r\n  .row .col.push-m5 {\r\n    left: 41.6666666667%;\r\n  }\r\n  .row .col.offset-m6 {\r\n    margin-left: 50%;\r\n  }\r\n  .row .col.pull-m6 {\r\n    right: 50%;\r\n  }\r\n  .row .col.push-m6 {\r\n    left: 50%;\r\n  }\r\n  .row .col.offset-m7 {\r\n    margin-left: 58.3333333333%;\r\n  }\r\n  .row .col.pull-m7 {\r\n    right: 58.3333333333%;\r\n  }\r\n  .row .col.push-m7 {\r\n    left: 58.3333333333%;\r\n  }\r\n  .row .col.offset-m8 {\r\n    margin-left: 66.6666666667%;\r\n  }\r\n  .row .col.pull-m8 {\r\n    right: 66.6666666667%;\r\n  }\r\n  .row .col.push-m8 {\r\n    left: 66.6666666667%;\r\n  }\r\n  .row .col.offset-m9 {\r\n    margin-left: 75%;\r\n  }\r\n  .row .col.pull-m9 {\r\n    right: 75%;\r\n  }\r\n  .row .col.push-m9 {\r\n    left: 75%;\r\n  }\r\n  .row .col.offset-m10 {\r\n    margin-left: 83.3333333333%;\r\n  }\r\n  .row .col.pull-m10 {\r\n    right: 83.3333333333%;\r\n  }\r\n  .row .col.push-m10 {\r\n    left: 83.3333333333%;\r\n  }\r\n  .row .col.offset-m11 {\r\n    margin-left: 91.6666666667%;\r\n  }\r\n  .row .col.pull-m11 {\r\n    right: 91.6666666667%;\r\n  }\r\n  .row .col.push-m11 {\r\n    left: 91.6666666667%;\r\n  }\r\n  .row .col.offset-m12 {\r\n    margin-left: 100%;\r\n  }\r\n  .row .col.pull-m12 {\r\n    right: 100%;\r\n  }\r\n  .row .col.push-m12 {\r\n    left: 100%;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  .row .col.l1 {\r\n    width: 8.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l2 {\r\n    width: 16.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l3 {\r\n    width: 25%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l4 {\r\n    width: 33.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l5 {\r\n    width: 41.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l6 {\r\n    width: 50%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l7 {\r\n    width: 58.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l8 {\r\n    width: 66.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l9 {\r\n    width: 75%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l10 {\r\n    width: 83.3333333333%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l11 {\r\n    width: 91.6666666667%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.l12 {\r\n    width: 100%;\r\n    margin-left: auto;\r\n    left: auto;\r\n    right: auto;\r\n  }\r\n  .row .col.offset-l1 {\r\n    margin-left: 8.3333333333%;\r\n  }\r\n  .row .col.pull-l1 {\r\n    right: 8.3333333333%;\r\n  }\r\n  .row .col.push-l1 {\r\n    left: 8.3333333333%;\r\n  }\r\n  .row .col.offset-l2 {\r\n    margin-left: 16.6666666667%;\r\n  }\r\n  .row .col.pull-l2 {\r\n    right: 16.6666666667%;\r\n  }\r\n  .row .col.push-l2 {\r\n    left: 16.6666666667%;\r\n  }\r\n  .row .col.offset-l3 {\r\n    margin-left: 25%;\r\n  }\r\n  .row .col.pull-l3 {\r\n    right: 25%;\r\n  }\r\n  .row .col.push-l3 {\r\n    left: 25%;\r\n  }\r\n  .row .col.offset-l4 {\r\n    margin-left: 33.3333333333%;\r\n  }\r\n  .row .col.pull-l4 {\r\n    right: 33.3333333333%;\r\n  }\r\n  .row .col.push-l4 {\r\n    left: 33.3333333333%;\r\n  }\r\n  .row .col.offset-l5 {\r\n    margin-left: 41.6666666667%;\r\n  }\r\n  .row .col.pull-l5 {\r\n    right: 41.6666666667%;\r\n  }\r\n  .row .col.push-l5 {\r\n    left: 41.6666666667%;\r\n  }\r\n  .row .col.offset-l6 {\r\n    margin-left: 50%;\r\n  }\r\n  .row .col.pull-l6 {\r\n    right: 50%;\r\n  }\r\n  .row .col.push-l6 {\r\n    left: 50%;\r\n  }\r\n  .row .col.offset-l7 {\r\n    margin-left: 58.3333333333%;\r\n  }\r\n  .row .col.pull-l7 {\r\n    right: 58.3333333333%;\r\n  }\r\n  .row .col.push-l7 {\r\n    left: 58.3333333333%;\r\n  }\r\n  .row .col.offset-l8 {\r\n    margin-left: 66.6666666667%;\r\n  }\r\n  .row .col.pull-l8 {\r\n    right: 66.6666666667%;\r\n  }\r\n  .row .col.push-l8 {\r\n    left: 66.6666666667%;\r\n  }\r\n  .row .col.offset-l9 {\r\n    margin-left: 75%;\r\n  }\r\n  .row .col.pull-l9 {\r\n    right: 75%;\r\n  }\r\n  .row .col.push-l9 {\r\n    left: 75%;\r\n  }\r\n  .row .col.offset-l10 {\r\n    margin-left: 83.3333333333%;\r\n  }\r\n  .row .col.pull-l10 {\r\n    right: 83.3333333333%;\r\n  }\r\n  .row .col.push-l10 {\r\n    left: 83.3333333333%;\r\n  }\r\n  .row .col.offset-l11 {\r\n    margin-left: 91.6666666667%;\r\n  }\r\n  .row .col.pull-l11 {\r\n    right: 91.6666666667%;\r\n  }\r\n  .row .col.push-l11 {\r\n    left: 91.6666666667%;\r\n  }\r\n  .row .col.offset-l12 {\r\n    margin-left: 100%;\r\n  }\r\n  .row .col.pull-l12 {\r\n    right: 100%;\r\n  }\r\n  .row .col.push-l12 {\r\n    left: 100%;\r\n  }\r\n}\r\n\r\nnav {\r\n  color: #fff;\r\n  background-color: #ee6e73;\r\n  width: 100%;\r\n  height: 56px;\r\n  line-height: 56px;\r\n}\r\n\r\nnav.nav-extended {\r\n  height: auto;\r\n}\r\n\r\nnav.nav-extended .nav-wrapper {\r\n  height: auto;\r\n}\r\n\r\nnav a {\r\n  color: #fff;\r\n}\r\n\r\nnav i,\r\nnav [class^=\"mdi-\"], nav [class*=\"mdi-\"],\r\nnav i.material-icons {\r\n  display: block;\r\n  font-size: 24px;\r\n  height: 56px;\r\n  line-height: 56px;\r\n}\r\n\r\nnav .nav-wrapper {\r\n  position: relative;\r\n  height: 100%;\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  nav a.button-collapse {\r\n    display: none;\r\n  }\r\n}\r\n\r\nnav .button-collapse {\r\n  float: left;\r\n  position: relative;\r\n  z-index: 1;\r\n  height: 56px;\r\n  margin: 0 18px;\r\n}\r\n\r\nnav .button-collapse i {\r\n  height: 56px;\r\n  line-height: 56px;\r\n}\r\n\r\nnav .brand-logo {\r\n  position: absolute;\r\n  color: #fff;\r\n  display: inline-block;\r\n  font-size: 2.1rem;\r\n  padding: 0;\r\n  white-space: nowrap;\r\n}\r\n\r\nnav .brand-logo.center {\r\n  left: 50%;\r\n  -webkit-transform: translateX(-50%);\r\n          transform: translateX(-50%);\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  nav .brand-logo {\r\n    left: 50%;\r\n    -webkit-transform: translateX(-50%);\r\n            transform: translateX(-50%);\r\n  }\r\n  nav .brand-logo.left, nav .brand-logo.right {\r\n    padding: 0;\r\n    -webkit-transform: none;\r\n            transform: none;\r\n  }\r\n  nav .brand-logo.left {\r\n    left: 0.5rem;\r\n  }\r\n  nav .brand-logo.right {\r\n    right: 0.5rem;\r\n    left: auto;\r\n  }\r\n}\r\n\r\nnav .brand-logo.right {\r\n  right: 0.5rem;\r\n  padding: 0;\r\n}\r\n\r\nnav .brand-logo i,\r\nnav .brand-logo [class^=\"mdi-\"], nav .brand-logo [class*=\"mdi-\"],\r\nnav .brand-logo i.material-icons {\r\n  float: left;\r\n  margin-right: 15px;\r\n}\r\n\r\nnav ul {\r\n  margin: 0;\r\n}\r\n\r\nnav ul li {\r\n  transition: background-color .3s;\r\n  float: left;\r\n  padding: 0;\r\n}\r\n\r\nnav ul li.active {\r\n  background-color: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\nnav ul a {\r\n  transition: background-color .3s;\r\n  font-size: 1rem;\r\n  color: #fff;\r\n  display: block;\r\n  padding: 0 15px;\r\n  cursor: pointer;\r\n}\r\n\r\nnav ul a.btn, nav ul a.btn-large, nav ul a.btn-large, nav ul a.btn-flat, nav ul a.btn-floating {\r\n  margin-top: -2px;\r\n  margin-left: 15px;\r\n  margin-right: 15px;\r\n}\r\n\r\nnav ul a:hover {\r\n  background-color: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\nnav ul.left {\r\n  float: left;\r\n}\r\n\r\nnav form {\r\n  height: 100%;\r\n}\r\n\r\nnav .input-field {\r\n  margin: 0;\r\n  height: 100%;\r\n}\r\n\r\nnav .input-field input {\r\n  height: 100%;\r\n  font-size: 1.2rem;\r\n  border: none;\r\n  padding-left: 2rem;\r\n}\r\n\r\nnav .input-field input:focus, nav .input-field input[type=text]:valid, nav .input-field input[type=password]:valid, nav .input-field input[type=email]:valid, nav .input-field input[type=url]:valid, nav .input-field input[type=date]:valid {\r\n  border: none;\r\n  box-shadow: none;\r\n}\r\n\r\nnav .input-field label {\r\n  top: 0;\r\n  left: 0;\r\n}\r\n\r\nnav .input-field label i {\r\n  color: rgba(255, 255, 255, 0.7);\r\n  transition: color .3s;\r\n}\r\n\r\nnav .input-field label.active i {\r\n  color: #fff;\r\n}\r\n\r\nnav .input-field label.active {\r\n  -webkit-transform: translateY(0);\r\n          transform: translateY(0);\r\n}\r\n\r\n.navbar-fixed {\r\n  position: relative;\r\n  height: 56px;\r\n  z-index: 997;\r\n}\r\n\r\n.navbar-fixed nav {\r\n  position: fixed;\r\n}\r\n\r\n@media only screen and (min-width: 601px) {\r\n  nav, nav .nav-wrapper i, nav a.button-collapse, nav a.button-collapse i {\r\n    height: 64px;\r\n    line-height: 64px;\r\n  }\r\n  .navbar-fixed {\r\n    height: 64px;\r\n  }\r\n}\r\n\r\na {\r\n  text-decoration: none;\r\n}\r\n\r\nhtml {\r\n  line-height: 1.5;\r\n  font-family: \"Roboto\", sans-serif;\r\n  font-weight: normal;\r\n  color: rgba(0, 0, 0, 0.87);\r\n}\r\n\r\n@media only screen and (min-width: 0) {\r\n  html {\r\n    font-size: 14px;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 992px) {\r\n  html {\r\n    font-size: 14.5px;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 1200px) {\r\n  html {\r\n    font-size: 15px;\r\n  }\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  font-weight: 400;\r\n  line-height: 1.1;\r\n}\r\n\r\nh1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\r\n  font-weight: inherit;\r\n}\r\n\r\nh1 {\r\n  font-size: 4.2rem;\r\n  line-height: 110%;\r\n  margin: 2.1rem 0 1.68rem 0;\r\n}\r\n\r\nh2 {\r\n  font-size: 3.56rem;\r\n  line-height: 110%;\r\n  margin: 1.78rem 0 1.424rem 0;\r\n}\r\n\r\nh3 {\r\n  font-size: 2.92rem;\r\n  line-height: 110%;\r\n  margin: 1.46rem 0 1.168rem 0;\r\n}\r\n\r\nh4 {\r\n  font-size: 2.28rem;\r\n  line-height: 110%;\r\n  margin: 1.14rem 0 0.912rem 0;\r\n}\r\n\r\nh5 {\r\n  font-size: 1.64rem;\r\n  line-height: 110%;\r\n  margin: 0.82rem 0 0.656rem 0;\r\n}\r\n\r\nh6 {\r\n  font-size: 1rem;\r\n  line-height: 110%;\r\n  margin: 0.5rem 0 0.4rem 0;\r\n}\r\n\r\nem {\r\n  font-style: italic;\r\n}\r\n\r\nstrong {\r\n  font-weight: 500;\r\n}\r\n\r\nsmall {\r\n  font-size: 75%;\r\n}\r\n\r\n.light, footer.page-footer .footer-copyright {\r\n  font-weight: 300;\r\n}\r\n\r\n.thin {\r\n  font-weight: 200;\r\n}\r\n\r\n.flow-text {\r\n  font-weight: 300;\r\n}\r\n\r\n@media only screen and (min-width: 360px) {\r\n  .flow-text {\r\n    font-size: 1.2rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 390px) {\r\n  .flow-text {\r\n    font-size: 1.224rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 420px) {\r\n  .flow-text {\r\n    font-size: 1.248rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 450px) {\r\n  .flow-text {\r\n    font-size: 1.272rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 480px) {\r\n  .flow-text {\r\n    font-size: 1.296rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 510px) {\r\n  .flow-text {\r\n    font-size: 1.32rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 540px) {\r\n  .flow-text {\r\n    font-size: 1.344rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 570px) {\r\n  .flow-text {\r\n    font-size: 1.368rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 600px) {\r\n  .flow-text {\r\n    font-size: 1.392rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 630px) {\r\n  .flow-text {\r\n    font-size: 1.416rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 660px) {\r\n  .flow-text {\r\n    font-size: 1.44rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 690px) {\r\n  .flow-text {\r\n    font-size: 1.464rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 720px) {\r\n  .flow-text {\r\n    font-size: 1.488rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 750px) {\r\n  .flow-text {\r\n    font-size: 1.512rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 780px) {\r\n  .flow-text {\r\n    font-size: 1.536rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 810px) {\r\n  .flow-text {\r\n    font-size: 1.56rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 840px) {\r\n  .flow-text {\r\n    font-size: 1.584rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 870px) {\r\n  .flow-text {\r\n    font-size: 1.608rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 900px) {\r\n  .flow-text {\r\n    font-size: 1.632rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 930px) {\r\n  .flow-text {\r\n    font-size: 1.656rem;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 960px) {\r\n  .flow-text {\r\n    font-size: 1.68rem;\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 360px) {\r\n  .flow-text {\r\n    font-size: 1.2rem;\r\n  }\r\n}\r\n\r\n.card-panel {\r\n  transition: box-shadow .25s;\r\n  padding: 20px;\r\n  margin: 0.5rem 0 1rem 0;\r\n  border-radius: 2px;\r\n  background-color: #fff;\r\n}\r\n\r\n.card {\r\n  position: relative;\r\n  margin: 0.5rem 0 1rem 0;\r\n  background-color: #fff;\r\n  transition: box-shadow .25s;\r\n  border-radius: 2px;\r\n}\r\n\r\n.card .card-title {\r\n  font-size: 24px;\r\n  font-weight: 300;\r\n}\r\n\r\n.card .card-title.activator {\r\n  cursor: pointer;\r\n}\r\n\r\n.card.small, .card.medium, .card.large {\r\n  position: relative;\r\n}\r\n\r\n.card.small .card-image, .card.medium .card-image, .card.large .card-image {\r\n  max-height: 60%;\r\n  overflow: hidden;\r\n}\r\n\r\n.card.small .card-image + .card-content, .card.medium .card-image + .card-content, .card.large .card-image + .card-content {\r\n  max-height: 40%;\r\n}\r\n\r\n.card.small .card-content, .card.medium .card-content, .card.large .card-content {\r\n  max-height: 100%;\r\n  overflow: hidden;\r\n}\r\n\r\n.card.small .card-action, .card.medium .card-action, .card.large .card-action {\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n}\r\n\r\n.card.small {\r\n  height: 300px;\r\n}\r\n\r\n.card.medium {\r\n  height: 400px;\r\n}\r\n\r\n.card.large {\r\n  height: 500px;\r\n}\r\n\r\n.card.horizontal {\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n\r\n.card.horizontal.small .card-image, .card.horizontal.medium .card-image, .card.horizontal.large .card-image {\r\n  height: 100%;\r\n  max-height: none;\r\n  overflow: visible;\r\n}\r\n\r\n.card.horizontal.small .card-image img, .card.horizontal.medium .card-image img, .card.horizontal.large .card-image img {\r\n  height: 100%;\r\n}\r\n\r\n.card.horizontal .card-image {\r\n  max-width: 50%;\r\n}\r\n\r\n.card.horizontal .card-image img {\r\n  border-radius: 2px 0 0 2px;\r\n  max-width: 100%;\r\n  width: auto;\r\n}\r\n\r\n.card.horizontal .card-stacked {\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-flex-direction: column;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n  position: relative;\r\n}\r\n\r\n.card.horizontal .card-stacked .card-content {\r\n  -webkit-flex-grow: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1;\r\n}\r\n\r\n.card.sticky-action .card-action {\r\n  z-index: 2;\r\n}\r\n\r\n.card.sticky-action .card-reveal {\r\n  z-index: 1;\r\n  padding-bottom: 64px;\r\n}\r\n\r\n.card .card-image {\r\n  position: relative;\r\n}\r\n\r\n.card .card-image img {\r\n  display: block;\r\n  border-radius: 2px 2px 0 0;\r\n  position: relative;\r\n  left: 0;\r\n  right: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 100%;\r\n}\r\n\r\n.card .card-image .card-title {\r\n  color: #fff;\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 0;\r\n  padding: 20px;\r\n}\r\n\r\n.card .card-content {\r\n  padding: 20px;\r\n  border-radius: 0 0 2px 2px;\r\n}\r\n\r\n.card .card-content p {\r\n  margin: 0;\r\n  color: inherit;\r\n}\r\n\r\n.card .card-content .card-title {\r\n  line-height: 48px;\r\n}\r\n\r\n.card .card-action {\r\n  position: relative;\r\n  background-color: inherit;\r\n  border-top: 1px solid rgba(160, 160, 160, 0.2);\r\n  padding: 20px;\r\n}\r\n\r\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-floating) {\r\n  color: #ffab40;\r\n  margin-right: 20px;\r\n  transition: color .3s ease;\r\n  text-transform: uppercase;\r\n}\r\n\r\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-floating):hover {\r\n  color: #ffd8a6;\r\n}\r\n\r\n.card .card-reveal {\r\n  padding: 20px;\r\n  position: absolute;\r\n  background-color: #fff;\r\n  width: 100%;\r\n  overflow-y: auto;\r\n  left: 0;\r\n  top: 100%;\r\n  height: 100%;\r\n  z-index: 3;\r\n  display: none;\r\n}\r\n\r\n.card .card-reveal .card-title {\r\n  cursor: pointer;\r\n  display: block;\r\n}\r\n\r\n#toast-container {\r\n  display: block;\r\n  position: fixed;\r\n  z-index: 10000;\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  #toast-container {\r\n    min-width: 100%;\r\n    bottom: 0%;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 601px) and (max-width: 992px) {\r\n  #toast-container {\r\n    left: 5%;\r\n    bottom: 7%;\r\n    max-width: 90%;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  #toast-container {\r\n    top: 10%;\r\n    right: 7%;\r\n    max-width: 86%;\r\n  }\r\n}\r\n\r\n.toast {\r\n  border-radius: 2px;\r\n  top: 0;\r\n  width: auto;\r\n  clear: both;\r\n  margin-top: 10px;\r\n  position: relative;\r\n  max-width: 100%;\r\n  height: auto;\r\n  min-height: 48px;\r\n  line-height: 1.5em;\r\n  word-break: break-all;\r\n  background-color: #323232;\r\n  padding: 10px 25px;\r\n  font-size: 1.1rem;\r\n  font-weight: 300;\r\n  color: #fff;\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-align-items: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-justify-content: space-between;\r\n      -ms-flex-pack: justify;\r\n          justify-content: space-between;\r\n}\r\n\r\n.toast .btn, .toast .btn-large, .toast .btn-flat {\r\n  margin: 0;\r\n  margin-left: 3rem;\r\n}\r\n\r\n.toast.rounded {\r\n  border-radius: 24px;\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  .toast {\r\n    width: 100%;\r\n    border-radius: 0;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 601px) and (max-width: 992px) {\r\n  .toast {\r\n    float: left;\r\n  }\r\n}\r\n\r\n@media only screen and (min-width: 993px) {\r\n  .toast {\r\n    float: right;\r\n  }\r\n}\r\n\r\n.tabs {\r\n  position: relative;\r\n  overflow-x: auto;\r\n  overflow-y: hidden;\r\n  height: 48px;\r\n  width: 100%;\r\n  background-color: #fff;\r\n  margin: 0 auto;\r\n  white-space: nowrap;\r\n}\r\n\r\n.tabs.tabs-transparent {\r\n  background-color: transparent;\r\n}\r\n\r\n.tabs.tabs-transparent .tab a,\r\n.tabs.tabs-transparent .tab.disabled a,\r\n.tabs.tabs-transparent .tab.disabled a:hover {\r\n  color: rgba(255, 255, 255, 0.7);\r\n}\r\n\r\n.tabs.tabs-transparent .tab a:hover,\r\n.tabs.tabs-transparent .tab a.active {\r\n  color: #fff;\r\n}\r\n\r\n.tabs.tabs-transparent .indicator {\r\n  background-color: #fff;\r\n}\r\n\r\n.tabs.tabs-fixed-width {\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n\r\n.tabs.tabs-fixed-width .tab {\r\n  -webkit-box-flex: 1;\r\n  -webkit-flex-grow: 1;\r\n  -ms-flex-positive: 1;\r\n  flex-grow: 1;\r\n}\r\n\r\n.tabs .tab {\r\n  display: inline-block;\r\n  text-align: center;\r\n  line-height: 48px;\r\n  height: 48px;\r\n  padding: 0;\r\n  margin: 0;\r\n  text-transform: uppercase;\r\n}\r\n\r\n.tabs .tab a {\r\n  color: rgba(238, 110, 115, 0.7);\r\n  display: block;\r\n  width: 100%;\r\n  height: 100%;\r\n  padding: 0 24px;\r\n  font-size: 14px;\r\n  text-overflow: ellipsis;\r\n  overflow: hidden;\r\n  transition: color .28s ease;\r\n}\r\n\r\n.tabs .tab a:hover, .tabs .tab a.active {\r\n  background-color: transparent;\r\n  color: #ee6e73;\r\n}\r\n\r\n.tabs .tab.disabled a,\r\n.tabs .tab.disabled a:hover {\r\n  color: rgba(238, 110, 115, 0.7);\r\n  cursor: default;\r\n}\r\n\r\n.tabs .indicator {\r\n  position: absolute;\r\n  bottom: 0;\r\n  height: 2px;\r\n  background-color: #f6b2b5;\r\n  will-change: left, right;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .tabs {\r\n    display: -webkit-flex;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n  }\r\n  .tabs .tab {\r\n    -webkit-box-flex: 1;\r\n    -webkit-flex-grow: 1;\r\n    -ms-flex-positive: 1;\r\n    flex-grow: 1;\r\n  }\r\n  .tabs .tab a {\r\n    padding: 0 12px;\r\n  }\r\n}\r\n\r\n.material-tooltip {\r\n  padding: 10px 8px;\r\n  font-size: 1rem;\r\n  z-index: 2000;\r\n  background-color: transparent;\r\n  border-radius: 2px;\r\n  color: #fff;\r\n  min-height: 36px;\r\n  line-height: 120%;\r\n  opacity: 0;\r\n  display: none;\r\n  position: absolute;\r\n  text-align: center;\r\n  max-width: calc(100% - 4px);\r\n  overflow: hidden;\r\n  left: 0;\r\n  top: 0;\r\n  pointer-events: none;\r\n}\r\n\r\n.backdrop {\r\n  position: absolute;\r\n  opacity: 0;\r\n  display: none;\r\n  height: 7px;\r\n  width: 14px;\r\n  border-radius: 0 0 50% 50%;\r\n  background-color: #323232;\r\n  z-index: -1;\r\n  -webkit-transform-origin: 50% 0%;\r\n          transform-origin: 50% 0%;\r\n  -webkit-transform: translate3d(0, 0, 0);\r\n          transform: translate3d(0, 0, 0);\r\n}\r\n\r\n.btn, .btn-large,\r\n.btn-flat {\r\n  border: none;\r\n  border-radius: 2px;\r\n  display: inline-block;\r\n  height: 36px;\r\n  line-height: 36px;\r\n  padding: 0 2rem;\r\n  text-transform: uppercase;\r\n  vertical-align: middle;\r\n  -webkit-tap-highlight-color: transparent;\r\n}\r\n\r\n.btn.disabled, .disabled.btn-large,\r\n.btn-floating.disabled,\r\n.btn-large.disabled,\r\n.btn-flat.disabled,\r\n.btn:disabled,\r\n.btn-large:disabled,\r\n.btn-floating:disabled,\r\n.btn-large:disabled,\r\n.btn-flat:disabled,\r\n.btn[disabled],\r\n[disabled].btn-large,\r\n.btn-floating[disabled],\r\n.btn-large[disabled],\r\n.btn-flat[disabled] {\r\n  pointer-events: none;\r\n  background-color: #DFDFDF !important;\r\n  box-shadow: none;\r\n  color: #9F9F9F !important;\r\n  cursor: default;\r\n}\r\n\r\n.btn.disabled:hover, .disabled.btn-large:hover,\r\n.btn-floating.disabled:hover,\r\n.btn-large.disabled:hover,\r\n.btn-flat.disabled:hover,\r\n.btn:disabled:hover,\r\n.btn-large:disabled:hover,\r\n.btn-floating:disabled:hover,\r\n.btn-large:disabled:hover,\r\n.btn-flat:disabled:hover,\r\n.btn[disabled]:hover,\r\n[disabled].btn-large:hover,\r\n.btn-floating[disabled]:hover,\r\n.btn-large[disabled]:hover,\r\n.btn-flat[disabled]:hover {\r\n  background-color: #DFDFDF !important;\r\n  color: #9F9F9F !important;\r\n}\r\n\r\n.btn, .btn-large,\r\n.btn-floating,\r\n.btn-large,\r\n.btn-flat {\r\n  outline: 0;\r\n}\r\n\r\n.btn i, .btn-large i,\r\n.btn-floating i,\r\n.btn-large i,\r\n.btn-flat i {\r\n  font-size: 1.3rem;\r\n  line-height: inherit;\r\n}\r\n\r\n.btn:focus, .btn-large:focus,\r\n.btn-floating:focus {\r\n  background-color: #1d7d74;\r\n}\r\n\r\n.btn, .btn-large {\r\n  text-decoration: none;\r\n  color: #fff;\r\n  background-color: #26a69a;\r\n  text-align: center;\r\n  letter-spacing: .5px;\r\n  transition: .2s ease-out;\r\n  cursor: pointer;\r\n}\r\n\r\n.btn:hover, .btn-large:hover {\r\n  background-color: #2bbbad;\r\n}\r\n\r\n.btn-floating {\r\n  display: inline-block;\r\n  color: #fff;\r\n  position: relative;\r\n  overflow: hidden;\r\n  z-index: 1;\r\n  width: 40px;\r\n  height: 40px;\r\n  line-height: 40px;\r\n  padding: 0;\r\n  background-color: #26a69a;\r\n  border-radius: 50%;\r\n  transition: .3s;\r\n  cursor: pointer;\r\n  vertical-align: middle;\r\n}\r\n\r\n.btn-floating i {\r\n  width: inherit;\r\n  display: inline-block;\r\n  text-align: center;\r\n  color: #fff;\r\n  font-size: 1.6rem;\r\n  line-height: 40px;\r\n}\r\n\r\n.btn-floating:hover {\r\n  background-color: #26a69a;\r\n}\r\n\r\n.btn-floating:before {\r\n  border-radius: 0;\r\n}\r\n\r\n.btn-floating.btn-large {\r\n  width: 56px;\r\n  height: 56px;\r\n}\r\n\r\n.btn-floating.btn-large i {\r\n  line-height: 56px;\r\n}\r\n\r\nbutton.btn-floating {\r\n  border: none;\r\n}\r\n\r\n.fixed-action-btn {\r\n  position: fixed;\r\n  right: 23px;\r\n  bottom: 23px;\r\n  padding-top: 15px;\r\n  margin-bottom: 0;\r\n  z-index: 998;\r\n}\r\n\r\n.fixed-action-btn.active ul {\r\n  visibility: visible;\r\n}\r\n\r\n.fixed-action-btn.horizontal {\r\n  padding: 0 0 0 15px;\r\n}\r\n\r\n.fixed-action-btn.horizontal ul {\r\n  text-align: right;\r\n  right: 64px;\r\n  top: 50%;\r\n  -webkit-transform: translateY(-50%);\r\n          transform: translateY(-50%);\r\n  height: 100%;\r\n  left: auto;\r\n  width: 500px;\r\n  /*width 100% only goes to width of button container */\r\n}\r\n\r\n.fixed-action-btn.horizontal ul li {\r\n  display: inline-block;\r\n  margin: 15px 15px 0 0;\r\n}\r\n\r\n.fixed-action-btn.toolbar {\r\n  padding: 0;\r\n  height: 56px;\r\n}\r\n\r\n.fixed-action-btn.toolbar.active > a i {\r\n  opacity: 0;\r\n}\r\n\r\n.fixed-action-btn.toolbar ul {\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  top: 0;\r\n  bottom: 0;\r\n}\r\n\r\n.fixed-action-btn.toolbar ul li {\r\n  -webkit-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n  display: inline-block;\r\n  margin: 0;\r\n  height: 100%;\r\n  transition: none;\r\n}\r\n\r\n.fixed-action-btn.toolbar ul li a {\r\n  display: block;\r\n  overflow: hidden;\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: transparent;\r\n  box-shadow: none;\r\n  color: #fff;\r\n  line-height: 56px;\r\n  z-index: 1;\r\n}\r\n\r\n.fixed-action-btn.toolbar ul li a i {\r\n  line-height: inherit;\r\n}\r\n\r\n.fixed-action-btn ul {\r\n  left: 0;\r\n  right: 0;\r\n  text-align: center;\r\n  position: absolute;\r\n  bottom: 64px;\r\n  margin: 0;\r\n  visibility: hidden;\r\n}\r\n\r\n.fixed-action-btn ul li {\r\n  margin-bottom: 15px;\r\n}\r\n\r\n.fixed-action-btn ul a.btn-floating {\r\n  opacity: 0;\r\n}\r\n\r\n.fixed-action-btn .fab-backdrop {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: -1;\r\n  width: 40px;\r\n  height: 40px;\r\n  background-color: #26a69a;\r\n  border-radius: 50%;\r\n  -webkit-transform: scale(0);\r\n          transform: scale(0);\r\n}\r\n\r\n.btn-flat {\r\n  box-shadow: none;\r\n  background-color: transparent;\r\n  color: #343434;\r\n  cursor: pointer;\r\n  transition: background-color .2s;\r\n}\r\n\r\n.btn-flat:focus, .btn-flat:active {\r\n  background-color: transparent;\r\n}\r\n\r\n.btn-flat:focus, .btn-flat:hover {\r\n  background-color: rgba(0, 0, 0, 0.1);\r\n  box-shadow: none;\r\n}\r\n\r\n.btn-flat:active {\r\n  background-color: rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.btn-flat.disabled {\r\n  background-color: transparent !important;\r\n  color: #b3b3b3 !important;\r\n  cursor: default;\r\n}\r\n\r\n.btn-large {\r\n  height: 54px;\r\n  line-height: 54px;\r\n}\r\n\r\n.btn-large i {\r\n  font-size: 1.6rem;\r\n}\r\n\r\n.btn-block {\r\n  display: block;\r\n}\r\n\r\n.dropdown-content {\r\n  background-color: #fff;\r\n  margin: 0;\r\n  display: none;\r\n  min-width: 100px;\r\n  max-height: 650px;\r\n  overflow-y: auto;\r\n  opacity: 0;\r\n  position: absolute;\r\n  z-index: 999;\r\n  will-change: width, height;\r\n}\r\n\r\n.dropdown-content li {\r\n  clear: both;\r\n  color: rgba(0, 0, 0, 0.87);\r\n  cursor: pointer;\r\n  min-height: 50px;\r\n  line-height: 1.5rem;\r\n  width: 100%;\r\n  text-align: left;\r\n  text-transform: none;\r\n}\r\n\r\n.dropdown-content li:hover, .dropdown-content li.active, .dropdown-content li.selected {\r\n  background-color: #eee;\r\n}\r\n\r\n.dropdown-content li.active.selected {\r\n  background-color: #e1e1e1;\r\n}\r\n\r\n.dropdown-content li.divider {\r\n  min-height: 0;\r\n  height: 1px;\r\n}\r\n\r\n.dropdown-content li > a, .dropdown-content li > span {\r\n  font-size: 16px;\r\n  color: #26a69a;\r\n  display: block;\r\n  line-height: 22px;\r\n  padding: 14px 16px;\r\n}\r\n\r\n.dropdown-content li > span > label {\r\n  top: 1px;\r\n  left: 0;\r\n  height: 18px;\r\n}\r\n\r\n.dropdown-content li > a > i {\r\n  height: inherit;\r\n  line-height: inherit;\r\n}\r\n\r\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\r\n  top: 1px;\r\n  left: 0;\r\n  height: 18px;\r\n}\r\n\r\n/*!\r\n * Waves v0.6.0\r\n * http://fian.my.id/Waves\r\n *\r\n * Copyright 2014 Alfiana E. Sibuea and other contributors\r\n * Released under the MIT license\r\n * https://github.com/fians/Waves/blob/master/LICENSE\r\n */\r\n.waves-effect {\r\n  position: relative;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  overflow: hidden;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  -webkit-tap-highlight-color: transparent;\r\n  vertical-align: middle;\r\n  z-index: 1;\r\n  will-change: opacity, transform;\r\n  transition: .3s ease-out;\r\n}\r\n\r\n.waves-effect .waves-ripple {\r\n  position: absolute;\r\n  border-radius: 50%;\r\n  width: 20px;\r\n  height: 20px;\r\n  margin-top: -10px;\r\n  margin-left: -10px;\r\n  opacity: 0;\r\n  background: rgba(0, 0, 0, 0.2);\r\n  transition: all 0.7s ease-out;\r\n  transition-property: opacity, -webkit-transform;\r\n  transition-property: transform, opacity;\r\n  transition-property: transform, opacity, -webkit-transform;\r\n  -webkit-transform: scale(0);\r\n          transform: scale(0);\r\n  pointer-events: none;\r\n}\r\n\r\n.waves-effect.waves-light .waves-ripple {\r\n  background-color: rgba(255, 255, 255, 0.45);\r\n}\r\n\r\n.waves-effect.waves-red .waves-ripple {\r\n  background-color: rgba(244, 67, 54, 0.7);\r\n}\r\n\r\n.waves-effect.waves-yellow .waves-ripple {\r\n  background-color: rgba(255, 235, 59, 0.7);\r\n}\r\n\r\n.waves-effect.waves-orange .waves-ripple {\r\n  background-color: rgba(255, 152, 0, 0.7);\r\n}\r\n\r\n.waves-effect.waves-purple .waves-ripple {\r\n  background-color: rgba(156, 39, 176, 0.7);\r\n}\r\n\r\n.waves-effect.waves-green .waves-ripple {\r\n  background-color: rgba(76, 175, 80, 0.7);\r\n}\r\n\r\n.waves-effect.waves-teal .waves-ripple {\r\n  background-color: rgba(0, 150, 136, 0.7);\r\n}\r\n\r\n.waves-effect input[type=\"button\"], .waves-effect input[type=\"reset\"], .waves-effect input[type=\"submit\"] {\r\n  border: 0;\r\n  font-style: normal;\r\n  font-size: inherit;\r\n  text-transform: inherit;\r\n  background: none;\r\n}\r\n\r\n.waves-effect img {\r\n  position: relative;\r\n  z-index: -1;\r\n}\r\n\r\n.waves-notransition {\r\n  transition: none !important;\r\n}\r\n\r\n.waves-circle {\r\n  -webkit-transform: translateZ(0);\r\n          transform: translateZ(0);\r\n  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);\r\n}\r\n\r\n.waves-input-wrapper {\r\n  border-radius: 0.2em;\r\n  vertical-align: bottom;\r\n}\r\n\r\n.waves-input-wrapper .waves-button-input {\r\n  position: relative;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 1;\r\n}\r\n\r\n.waves-circle {\r\n  text-align: center;\r\n  width: 2.5em;\r\n  height: 2.5em;\r\n  line-height: 2.5em;\r\n  border-radius: 50%;\r\n  -webkit-mask-image: none;\r\n}\r\n\r\n.waves-block {\r\n  display: block;\r\n}\r\n\r\n/* Firefox Bug: link not triggered */\r\n.waves-effect .waves-ripple {\r\n  z-index: -1;\r\n}\r\n\r\n.modal {\r\n  display: none;\r\n  position: fixed;\r\n  left: 0;\r\n  right: 0;\r\n  background-color: #fafafa;\r\n  padding: 0;\r\n  max-height: 70%;\r\n  width: 55%;\r\n  margin: auto;\r\n  overflow-y: auto;\r\n  border-radius: 2px;\r\n  will-change: top, opacity;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .modal {\r\n    width: 80%;\r\n  }\r\n}\r\n\r\n.modal h1, .modal h2, .modal h3, .modal h4 {\r\n  margin-top: 0;\r\n}\r\n\r\n.modal .modal-content {\r\n  padding: 24px;\r\n}\r\n\r\n.modal .modal-close {\r\n  cursor: pointer;\r\n}\r\n\r\n.modal .modal-footer {\r\n  border-radius: 0 0 2px 2px;\r\n  background-color: #fafafa;\r\n  padding: 4px 6px;\r\n  height: 56px;\r\n  width: 100%;\r\n}\r\n\r\n.modal .modal-footer .btn, .modal .modal-footer .btn-large, .modal .modal-footer .btn-flat {\r\n  float: right;\r\n  margin: 6px 0;\r\n}\r\n\r\n.modal-overlay {\r\n  position: fixed;\r\n  z-index: 999;\r\n  top: -100px;\r\n  left: 0;\r\n  bottom: 0;\r\n  right: 0;\r\n  height: 125%;\r\n  width: 100%;\r\n  background: #000;\r\n  display: none;\r\n  will-change: opacity;\r\n}\r\n\r\n.modal.modal-fixed-footer {\r\n  padding: 0;\r\n  height: 70%;\r\n}\r\n\r\n.modal.modal-fixed-footer .modal-content {\r\n  position: absolute;\r\n  height: calc(100% - 56px);\r\n  max-height: 100%;\r\n  width: 100%;\r\n  overflow-y: auto;\r\n}\r\n\r\n.modal.modal-fixed-footer .modal-footer {\r\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\r\n  position: absolute;\r\n  bottom: 0;\r\n}\r\n\r\n.modal.bottom-sheet {\r\n  top: auto;\r\n  bottom: -100%;\r\n  margin: 0;\r\n  width: 100%;\r\n  max-height: 45%;\r\n  border-radius: 0;\r\n  will-change: bottom, opacity;\r\n}\r\n\r\n.collapsible {\r\n  border-top: 1px solid #ddd;\r\n  border-right: 1px solid #ddd;\r\n  border-left: 1px solid #ddd;\r\n  margin: 0.5rem 0 1rem 0;\r\n}\r\n\r\n.collapsible-header {\r\n  display: block;\r\n  cursor: pointer;\r\n  min-height: 3rem;\r\n  line-height: 3rem;\r\n  padding: 0 1rem;\r\n  background-color: #fff;\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n\r\n.collapsible-header i {\r\n  width: 2rem;\r\n  font-size: 1.6rem;\r\n  line-height: 3rem;\r\n  display: block;\r\n  float: left;\r\n  text-align: center;\r\n  margin-right: 1rem;\r\n}\r\n\r\n.collapsible-body {\r\n  display: none;\r\n  border-bottom: 1px solid #ddd;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.collapsible-body p {\r\n  margin: 0;\r\n  padding: 2rem;\r\n}\r\n\r\n.side-nav .collapsible,\r\n.side-nav.fixed .collapsible {\r\n  border: none;\r\n  box-shadow: none;\r\n}\r\n\r\n.side-nav .collapsible li,\r\n.side-nav.fixed .collapsible li {\r\n  padding: 0;\r\n}\r\n\r\n.side-nav .collapsible-header,\r\n.side-nav.fixed .collapsible-header {\r\n  background-color: transparent;\r\n  border: none;\r\n  line-height: inherit;\r\n  height: inherit;\r\n  padding: 0 16px;\r\n}\r\n\r\n.side-nav .collapsible-header:hover,\r\n.side-nav.fixed .collapsible-header:hover {\r\n  background-color: rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n.side-nav .collapsible-header i,\r\n.side-nav.fixed .collapsible-header i {\r\n  line-height: inherit;\r\n}\r\n\r\n.side-nav .collapsible-body,\r\n.side-nav.fixed .collapsible-body {\r\n  border: 0;\r\n  background-color: #fff;\r\n}\r\n\r\n.side-nav .collapsible-body li a,\r\n.side-nav.fixed .collapsible-body li a {\r\n  padding: 0 23.5px 0 31px;\r\n}\r\n\r\n.collapsible.popout {\r\n  border: none;\r\n  box-shadow: none;\r\n}\r\n\r\n.collapsible.popout > li {\r\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\r\n  margin: 0 24px;\r\n  transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\r\n}\r\n\r\n.collapsible.popout > li.active {\r\n  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\r\n  margin: 16px 0;\r\n}\r\n\r\n.chip {\r\n  display: inline-block;\r\n  height: 32px;\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  color: rgba(0, 0, 0, 0.6);\r\n  line-height: 32px;\r\n  padding: 0 12px;\r\n  border-radius: 16px;\r\n  background-color: #e4e4e4;\r\n  margin-bottom: 5px;\r\n  margin-right: 5px;\r\n}\r\n\r\n.chip img {\r\n  float: left;\r\n  margin: 0 8px 0 -12px;\r\n  height: 32px;\r\n  width: 32px;\r\n  border-radius: 50%;\r\n}\r\n\r\n.chip .close {\r\n  cursor: pointer;\r\n  float: right;\r\n  font-size: 16px;\r\n  line-height: 32px;\r\n  padding-left: 8px;\r\n}\r\n\r\n.chips {\r\n  border: none;\r\n  border-bottom: 1px solid #9e9e9e;\r\n  box-shadow: none;\r\n  margin: 0 0 20px 0;\r\n  min-height: 45px;\r\n  outline: none;\r\n  transition: all .3s;\r\n}\r\n\r\n.chips.focus {\r\n  border-bottom: 1px solid #26a69a;\r\n  box-shadow: 0 1px 0 0 #26a69a;\r\n}\r\n\r\n.chips:hover {\r\n  cursor: text;\r\n}\r\n\r\n.chips .chip.selected {\r\n  background-color: #26a69a;\r\n  color: #fff;\r\n}\r\n\r\n.chips .input {\r\n  background: none;\r\n  border: 0;\r\n  color: rgba(0, 0, 0, 0.6);\r\n  display: inline-block;\r\n  font-size: 1rem;\r\n  height: 3rem;\r\n  line-height: 32px;\r\n  outline: 0;\r\n  margin: 0;\r\n  padding: 0 !important;\r\n  width: 120px !important;\r\n}\r\n\r\n.chips .input:focus {\r\n  border: 0 !important;\r\n  box-shadow: none !important;\r\n}\r\n\r\n.prefix ~ .chips {\r\n  margin-left: 3rem;\r\n  width: 92%;\r\n  width: calc(100% - 3rem);\r\n}\r\n\r\n.chips:empty ~ label {\r\n  font-size: 0.8rem;\r\n  -webkit-transform: translateY(-140%);\r\n          transform: translateY(-140%);\r\n}\r\n\r\n.materialboxed {\r\n  display: block;\r\n  cursor: -webkit-zoom-in;\r\n  cursor: zoom-in;\r\n  position: relative;\r\n  transition: opacity .4s;\r\n}\r\n\r\n.materialboxed:hover {\r\n  will-change: left, top, width, height;\r\n}\r\n\r\n.materialboxed:hover:not(.active) {\r\n  opacity: .8;\r\n}\r\n\r\n.materialboxed.active {\r\n  cursor: -webkit-zoom-out;\r\n  cursor: zoom-out;\r\n}\r\n\r\n#materialbox-overlay {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background-color: #292929;\r\n  z-index: 1000;\r\n  will-change: opacity;\r\n}\r\n\r\n.materialbox-caption {\r\n  position: fixed;\r\n  display: none;\r\n  color: #fff;\r\n  line-height: 50px;\r\n  bottom: 0;\r\n  width: 100%;\r\n  text-align: center;\r\n  padding: 0% 15%;\r\n  height: 50px;\r\n  z-index: 1000;\r\n  -webkit-font-smoothing: antialiased;\r\n}\r\n\r\nselect:focus {\r\n  outline: 1px solid #c9f3ef;\r\n}\r\n\r\nbutton:focus {\r\n  outline: none;\r\n  background-color: #2ab7a9;\r\n}\r\n\r\nlabel {\r\n  font-size: 0.8rem;\r\n  color: #9e9e9e;\r\n}\r\n\r\n/* Text Inputs + Textarea\r\n   ========================================================================== */\r\n/* Style Placeholders */\r\n::-webkit-input-placeholder {\r\n  color: #d1d1d1;\r\n}\r\n\r\n:-moz-placeholder {\r\n  /* Firefox 18- */\r\n  color: #d1d1d1;\r\n}\r\n\r\n::-moz-placeholder {\r\n  /* Firefox 19+ */\r\n  color: #d1d1d1;\r\n}\r\n\r\n:-ms-input-placeholder {\r\n  color: #d1d1d1;\r\n}\r\n\r\n/* Text inputs */\r\ninput:not([type]),\r\ninput[type=text],\r\ninput[type=password],\r\ninput[type=email],\r\ninput[type=url],\r\ninput[type=time],\r\ninput[type=date],\r\ninput[type=datetime],\r\ninput[type=datetime-local],\r\ninput[type=tel],\r\ninput[type=number],\r\ninput[type=search],\r\ntextarea.materialize-textarea {\r\n  background-color: transparent;\r\n  border: none;\r\n  border-bottom: 1px solid #9e9e9e;\r\n  border-radius: 0;\r\n  outline: none;\r\n  height: 3rem;\r\n  width: 100%;\r\n  font-size: 1rem;\r\n  margin: 0 0 20px 0;\r\n  padding: 0;\r\n  box-shadow: none;\r\n  box-sizing: content-box;\r\n  transition: all 0.3s;\r\n}\r\n\r\ninput:not([type]):disabled, input:not([type])[readonly=\"readonly\"],\r\ninput[type=text]:disabled,\r\ninput[type=text][readonly=\"readonly\"],\r\ninput[type=password]:disabled,\r\ninput[type=password][readonly=\"readonly\"],\r\ninput[type=email]:disabled,\r\ninput[type=email][readonly=\"readonly\"],\r\ninput[type=url]:disabled,\r\ninput[type=url][readonly=\"readonly\"],\r\ninput[type=time]:disabled,\r\ninput[type=time][readonly=\"readonly\"],\r\ninput[type=date]:disabled,\r\ninput[type=date][readonly=\"readonly\"],\r\ninput[type=datetime]:disabled,\r\ninput[type=datetime][readonly=\"readonly\"],\r\ninput[type=datetime-local]:disabled,\r\ninput[type=datetime-local][readonly=\"readonly\"],\r\ninput[type=tel]:disabled,\r\ninput[type=tel][readonly=\"readonly\"],\r\ninput[type=number]:disabled,\r\ninput[type=number][readonly=\"readonly\"],\r\ninput[type=search]:disabled,\r\ninput[type=search][readonly=\"readonly\"],\r\ntextarea.materialize-textarea:disabled,\r\ntextarea.materialize-textarea[readonly=\"readonly\"] {\r\n  color: rgba(0, 0, 0, 0.26);\r\n  border-bottom: 1px dotted rgba(0, 0, 0, 0.26);\r\n}\r\n\r\ninput:not([type]):disabled + label,\r\ninput:not([type])[readonly=\"readonly\"] + label,\r\ninput[type=text]:disabled + label,\r\ninput[type=text][readonly=\"readonly\"] + label,\r\ninput[type=password]:disabled + label,\r\ninput[type=password][readonly=\"readonly\"] + label,\r\ninput[type=email]:disabled + label,\r\ninput[type=email][readonly=\"readonly\"] + label,\r\ninput[type=url]:disabled + label,\r\ninput[type=url][readonly=\"readonly\"] + label,\r\ninput[type=time]:disabled + label,\r\ninput[type=time][readonly=\"readonly\"] + label,\r\ninput[type=date]:disabled + label,\r\ninput[type=date][readonly=\"readonly\"] + label,\r\ninput[type=datetime]:disabled + label,\r\ninput[type=datetime][readonly=\"readonly\"] + label,\r\ninput[type=datetime-local]:disabled + label,\r\ninput[type=datetime-local][readonly=\"readonly\"] + label,\r\ninput[type=tel]:disabled + label,\r\ninput[type=tel][readonly=\"readonly\"] + label,\r\ninput[type=number]:disabled + label,\r\ninput[type=number][readonly=\"readonly\"] + label,\r\ninput[type=search]:disabled + label,\r\ninput[type=search][readonly=\"readonly\"] + label,\r\ntextarea.materialize-textarea:disabled + label,\r\ntextarea.materialize-textarea[readonly=\"readonly\"] + label {\r\n  color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\ninput:not([type]):focus:not([readonly]),\r\ninput[type=text]:focus:not([readonly]),\r\ninput[type=password]:focus:not([readonly]),\r\ninput[type=email]:focus:not([readonly]),\r\ninput[type=url]:focus:not([readonly]),\r\ninput[type=time]:focus:not([readonly]),\r\ninput[type=date]:focus:not([readonly]),\r\ninput[type=datetime]:focus:not([readonly]),\r\ninput[type=datetime-local]:focus:not([readonly]),\r\ninput[type=tel]:focus:not([readonly]),\r\ninput[type=number]:focus:not([readonly]),\r\ninput[type=search]:focus:not([readonly]),\r\ntextarea.materialize-textarea:focus:not([readonly]) {\r\n  border-bottom: 1px solid #26a69a;\r\n  box-shadow: 0 1px 0 0 #26a69a;\r\n}\r\n\r\ninput:not([type]):focus:not([readonly]) + label,\r\ninput[type=text]:focus:not([readonly]) + label,\r\ninput[type=password]:focus:not([readonly]) + label,\r\ninput[type=email]:focus:not([readonly]) + label,\r\ninput[type=url]:focus:not([readonly]) + label,\r\ninput[type=time]:focus:not([readonly]) + label,\r\ninput[type=date]:focus:not([readonly]) + label,\r\ninput[type=datetime]:focus:not([readonly]) + label,\r\ninput[type=datetime-local]:focus:not([readonly]) + label,\r\ninput[type=tel]:focus:not([readonly]) + label,\r\ninput[type=number]:focus:not([readonly]) + label,\r\ninput[type=search]:focus:not([readonly]) + label,\r\ntextarea.materialize-textarea:focus:not([readonly]) + label {\r\n  color: #26a69a;\r\n}\r\n\r\ninput:not([type]).valid, input:not([type]):focus.valid,\r\ninput[type=text].valid,\r\ninput[type=text]:focus.valid,\r\ninput[type=password].valid,\r\ninput[type=password]:focus.valid,\r\ninput[type=email].valid,\r\ninput[type=email]:focus.valid,\r\ninput[type=url].valid,\r\ninput[type=url]:focus.valid,\r\ninput[type=time].valid,\r\ninput[type=time]:focus.valid,\r\ninput[type=date].valid,\r\ninput[type=date]:focus.valid,\r\ninput[type=datetime].valid,\r\ninput[type=datetime]:focus.valid,\r\ninput[type=datetime-local].valid,\r\ninput[type=datetime-local]:focus.valid,\r\ninput[type=tel].valid,\r\ninput[type=tel]:focus.valid,\r\ninput[type=number].valid,\r\ninput[type=number]:focus.valid,\r\ninput[type=search].valid,\r\ninput[type=search]:focus.valid,\r\ntextarea.materialize-textarea.valid,\r\ntextarea.materialize-textarea:focus.valid {\r\n  border-bottom: 1px solid #4CAF50;\r\n  box-shadow: 0 1px 0 0 #4CAF50;\r\n}\r\n\r\ninput:not([type]).valid + label:after,\r\ninput:not([type]):focus.valid + label:after,\r\ninput[type=text].valid + label:after,\r\ninput[type=text]:focus.valid + label:after,\r\ninput[type=password].valid + label:after,\r\ninput[type=password]:focus.valid + label:after,\r\ninput[type=email].valid + label:after,\r\ninput[type=email]:focus.valid + label:after,\r\ninput[type=url].valid + label:after,\r\ninput[type=url]:focus.valid + label:after,\r\ninput[type=time].valid + label:after,\r\ninput[type=time]:focus.valid + label:after,\r\ninput[type=date].valid + label:after,\r\ninput[type=date]:focus.valid + label:after,\r\ninput[type=datetime].valid + label:after,\r\ninput[type=datetime]:focus.valid + label:after,\r\ninput[type=datetime-local].valid + label:after,\r\ninput[type=datetime-local]:focus.valid + label:after,\r\ninput[type=tel].valid + label:after,\r\ninput[type=tel]:focus.valid + label:after,\r\ninput[type=number].valid + label:after,\r\ninput[type=number]:focus.valid + label:after,\r\ninput[type=search].valid + label:after,\r\ninput[type=search]:focus.valid + label:after,\r\ntextarea.materialize-textarea.valid + label:after,\r\ntextarea.materialize-textarea:focus.valid + label:after {\r\n  content: attr(data-success);\r\n  color: #4CAF50;\r\n  opacity: 1;\r\n}\r\n\r\ninput:not([type]).invalid, input:not([type]):focus.invalid,\r\ninput[type=text].invalid,\r\ninput[type=text]:focus.invalid,\r\ninput[type=password].invalid,\r\ninput[type=password]:focus.invalid,\r\ninput[type=email].invalid,\r\ninput[type=email]:focus.invalid,\r\ninput[type=url].invalid,\r\ninput[type=url]:focus.invalid,\r\ninput[type=time].invalid,\r\ninput[type=time]:focus.invalid,\r\ninput[type=date].invalid,\r\ninput[type=date]:focus.invalid,\r\ninput[type=datetime].invalid,\r\ninput[type=datetime]:focus.invalid,\r\ninput[type=datetime-local].invalid,\r\ninput[type=datetime-local]:focus.invalid,\r\ninput[type=tel].invalid,\r\ninput[type=tel]:focus.invalid,\r\ninput[type=number].invalid,\r\ninput[type=number]:focus.invalid,\r\ninput[type=search].invalid,\r\ninput[type=search]:focus.invalid,\r\ntextarea.materialize-textarea.invalid,\r\ntextarea.materialize-textarea:focus.invalid {\r\n  border-bottom: 1px solid #F44336;\r\n  box-shadow: 0 1px 0 0 #F44336;\r\n}\r\n\r\ninput:not([type]).invalid + label:after,\r\ninput:not([type]):focus.invalid + label:after,\r\ninput[type=text].invalid + label:after,\r\ninput[type=text]:focus.invalid + label:after,\r\ninput[type=password].invalid + label:after,\r\ninput[type=password]:focus.invalid + label:after,\r\ninput[type=email].invalid + label:after,\r\ninput[type=email]:focus.invalid + label:after,\r\ninput[type=url].invalid + label:after,\r\ninput[type=url]:focus.invalid + label:after,\r\ninput[type=time].invalid + label:after,\r\ninput[type=time]:focus.invalid + label:after,\r\ninput[type=date].invalid + label:after,\r\ninput[type=date]:focus.invalid + label:after,\r\ninput[type=datetime].invalid + label:after,\r\ninput[type=datetime]:focus.invalid + label:after,\r\ninput[type=datetime-local].invalid + label:after,\r\ninput[type=datetime-local]:focus.invalid + label:after,\r\ninput[type=tel].invalid + label:after,\r\ninput[type=tel]:focus.invalid + label:after,\r\ninput[type=number].invalid + label:after,\r\ninput[type=number]:focus.invalid + label:after,\r\ninput[type=search].invalid + label:after,\r\ninput[type=search]:focus.invalid + label:after,\r\ntextarea.materialize-textarea.invalid + label:after,\r\ntextarea.materialize-textarea:focus.invalid + label:after {\r\n  content: attr(data-error);\r\n  color: #F44336;\r\n  opacity: 1;\r\n}\r\n\r\ninput:not([type]).validate + label,\r\ninput[type=text].validate + label,\r\ninput[type=password].validate + label,\r\ninput[type=email].validate + label,\r\ninput[type=url].validate + label,\r\ninput[type=time].validate + label,\r\ninput[type=date].validate + label,\r\ninput[type=datetime].validate + label,\r\ninput[type=datetime-local].validate + label,\r\ninput[type=tel].validate + label,\r\ninput[type=number].validate + label,\r\ninput[type=search].validate + label,\r\ntextarea.materialize-textarea.validate + label {\r\n  width: 100%;\r\n  pointer-events: none;\r\n}\r\n\r\ninput:not([type]) + label:after,\r\ninput[type=text] + label:after,\r\ninput[type=password] + label:after,\r\ninput[type=email] + label:after,\r\ninput[type=url] + label:after,\r\ninput[type=time] + label:after,\r\ninput[type=date] + label:after,\r\ninput[type=datetime] + label:after,\r\ninput[type=datetime-local] + label:after,\r\ninput[type=tel] + label:after,\r\ninput[type=number] + label:after,\r\ninput[type=search] + label:after,\r\ntextarea.materialize-textarea + label:after {\r\n  display: block;\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 60px;\r\n  opacity: 0;\r\n  transition: .2s opacity ease-out, .2s color ease-out;\r\n}\r\n\r\n.input-field {\r\n  position: relative;\r\n  margin-top: 1rem;\r\n}\r\n\r\n.input-field.inline {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  margin-left: 5px;\r\n}\r\n\r\n.input-field.inline input,\r\n.input-field.inline .select-dropdown {\r\n  margin-bottom: 1rem;\r\n}\r\n\r\n.input-field.col label {\r\n  left: 0.75rem;\r\n}\r\n\r\n.input-field.col .prefix ~ label,\r\n.input-field.col .prefix ~ .validate ~ label {\r\n  width: calc(100% - 3rem - 1.5rem);\r\n}\r\n\r\n.input-field label {\r\n  color: #9e9e9e;\r\n  position: absolute;\r\n  top: 0.8rem;\r\n  left: 0;\r\n  font-size: 1rem;\r\n  cursor: text;\r\n  transition: .2s ease-out;\r\n}\r\n\r\n.input-field label.active {\r\n  font-size: 0.8rem;\r\n  -webkit-transform: translateY(-140%);\r\n          transform: translateY(-140%);\r\n}\r\n\r\n.input-field .prefix {\r\n  position: absolute;\r\n  width: 3rem;\r\n  font-size: 2rem;\r\n  transition: color .2s;\r\n}\r\n\r\n.input-field .prefix.active {\r\n  color: #26a69a;\r\n}\r\n\r\n.input-field .prefix ~ input,\r\n.input-field .prefix ~ textarea,\r\n.input-field .prefix ~ label,\r\n.input-field .prefix ~ .validate ~ label,\r\n.input-field .prefix ~ .autocomplete-content {\r\n  margin-left: 3rem;\r\n  width: 92%;\r\n  width: calc(100% - 3rem);\r\n}\r\n\r\n.input-field .prefix ~ label {\r\n  margin-left: 3rem;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .input-field .prefix ~ input {\r\n    width: 86%;\r\n    width: calc(100% - 3rem);\r\n  }\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  .input-field .prefix ~ input {\r\n    width: 80%;\r\n    width: calc(100% - 3rem);\r\n  }\r\n}\r\n\r\n/* Search Field */\r\n.input-field input[type=search] {\r\n  display: block;\r\n  line-height: inherit;\r\n  padding-left: 4rem;\r\n  width: calc(100% - 4rem);\r\n}\r\n\r\n.input-field input[type=search]:focus {\r\n  background-color: #fff;\r\n  border: 0;\r\n  box-shadow: none;\r\n  color: #444;\r\n}\r\n\r\n.input-field input[type=search]:focus + label i,\r\n.input-field input[type=search]:focus ~ .mdi-navigation-close,\r\n.input-field input[type=search]:focus ~ .material-icons {\r\n  color: #444;\r\n}\r\n\r\n.input-field input[type=search] + label {\r\n  left: 1rem;\r\n}\r\n\r\n.input-field input[type=search] ~ .mdi-navigation-close,\r\n.input-field input[type=search] ~ .material-icons {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 1rem;\r\n  color: transparent;\r\n  cursor: pointer;\r\n  font-size: 2rem;\r\n  transition: .3s color;\r\n}\r\n\r\n/* Textarea */\r\ntextarea {\r\n  width: 100%;\r\n  height: 3rem;\r\n  background-color: transparent;\r\n}\r\n\r\ntextarea.materialize-textarea {\r\n  overflow-y: hidden;\r\n  /* prevents scroll bar flash */\r\n  padding: .8rem 0 1.6rem 0;\r\n  /* prevents text jump on Enter keypress */\r\n  resize: none;\r\n  min-height: 3rem;\r\n}\r\n\r\n.hiddendiv {\r\n  display: none;\r\n  white-space: pre-wrap;\r\n  word-wrap: break-word;\r\n  overflow-wrap: break-word;\r\n  /* future version of deprecated 'word-wrap' */\r\n  padding-top: 1.2rem;\r\n  /* prevents text jump on Enter keypress */\r\n}\r\n\r\n/* Autocomplete */\r\n.autocomplete-content {\r\n  margin-top: -15px;\r\n  display: block;\r\n  opacity: 1;\r\n  position: static;\r\n}\r\n\r\n.autocomplete-content li .highlight {\r\n  color: #444;\r\n}\r\n\r\n.autocomplete-content li img {\r\n  height: 40px;\r\n  width: 40px;\r\n  margin: 5px 15px;\r\n}\r\n\r\n/* Radio Buttons\r\n   ========================================================================== */\r\n[type=\"radio\"]:not(:checked),\r\n[type=\"radio\"]:checked {\r\n  position: absolute;\r\n  left: -9999px;\r\n  opacity: 0;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label,\r\n[type=\"radio\"]:checked + label {\r\n  position: relative;\r\n  padding-left: 35px;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  height: 25px;\r\n  line-height: 25px;\r\n  font-size: 1rem;\r\n  transition: .28s ease;\r\n  /* webkit (konqueror) browsers */\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n}\r\n\r\n[type=\"radio\"] + label:before,\r\n[type=\"radio\"] + label:after {\r\n  content: '';\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  margin: 4px;\r\n  width: 16px;\r\n  height: 16px;\r\n  z-index: 0;\r\n  transition: .28s ease;\r\n}\r\n\r\n/* Unchecked styles */\r\n[type=\"radio\"]:not(:checked) + label:before,\r\n[type=\"radio\"]:not(:checked) + label:after,\r\n[type=\"radio\"]:checked + label:before,\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:before,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  border-radius: 50%;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label:before,\r\n[type=\"radio\"]:not(:checked) + label:after {\r\n  border: 2px solid #5a5a5a;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label:after {\r\n  -webkit-transform: scale(0);\r\n          transform: scale(0);\r\n}\r\n\r\n/* Checked styles */\r\n[type=\"radio\"]:checked + label:before {\r\n  border: 2px solid transparent;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:before,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  border: 2px solid #26a69a;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  background-color: #26a69a;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after {\r\n  -webkit-transform: scale(1.02);\r\n          transform: scale(1.02);\r\n}\r\n\r\n/* Radio With gap */\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  -webkit-transform: scale(0.5);\r\n          transform: scale(0.5);\r\n}\r\n\r\n/* Focused styles */\r\n[type=\"radio\"].tabbed:focus + label:before {\r\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n/* Disabled Radio With gap */\r\n[type=\"radio\"].with-gap:disabled:checked + label:before {\r\n  border: 2px solid rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n[type=\"radio\"].with-gap:disabled:checked + label:after {\r\n  border: none;\r\n  background-color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n/* Disabled style */\r\n[type=\"radio\"]:disabled:not(:checked) + label:before,\r\n[type=\"radio\"]:disabled:checked + label:before {\r\n  background-color: transparent;\r\n  border-color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n[type=\"radio\"]:disabled + label {\r\n  color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n[type=\"radio\"]:disabled:not(:checked) + label:before {\r\n  border-color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n[type=\"radio\"]:disabled:checked + label:after {\r\n  background-color: rgba(0, 0, 0, 0.26);\r\n  border-color: #BDBDBD;\r\n}\r\n\r\n/* Checkboxes\r\n   ========================================================================== */\r\n/* CUSTOM CSS CHECKBOXES */\r\nform p {\r\n  margin-bottom: 10px;\r\n  text-align: left;\r\n}\r\n\r\nform p:last-child {\r\n  margin-bottom: 0;\r\n}\r\n\r\n/* Remove default checkbox */\r\n[type=\"checkbox\"]:not(:checked),\r\n[type=\"checkbox\"]:checked {\r\n  position: absolute;\r\n  left: -9999px;\r\n  opacity: 0;\r\n}\r\n\r\n[type=\"checkbox\"] {\r\n  /* checkbox aspect */\r\n}\r\n\r\n[type=\"checkbox\"] + label {\r\n  position: relative;\r\n  padding-left: 35px;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  height: 25px;\r\n  line-height: 25px;\r\n  font-size: 1rem;\r\n  -webkit-user-select: none;\r\n  /* webkit (safari, chrome) browsers */\r\n  -moz-user-select: none;\r\n  /* mozilla browsers */\r\n  -khtml-user-select: none;\r\n  /* webkit (konqueror) browsers */\r\n  -ms-user-select: none;\r\n  /* IE10+ */\r\n}\r\n\r\n[type=\"checkbox\"] + label:before,\r\n[type=\"checkbox\"]:not(.filled-in) + label:after {\r\n  content: '';\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 18px;\r\n  height: 18px;\r\n  z-index: 0;\r\n  border: 2px solid #5a5a5a;\r\n  border-radius: 1px;\r\n  margin-top: 2px;\r\n  transition: .2s;\r\n}\r\n\r\n[type=\"checkbox\"]:not(.filled-in) + label:after {\r\n  border: 0;\r\n  -webkit-transform: scale(0);\r\n          transform: scale(0);\r\n}\r\n\r\n[type=\"checkbox\"]:not(:checked):disabled + label:before {\r\n  border: none;\r\n  background-color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n[type=\"checkbox\"].tabbed:focus + label:after {\r\n  -webkit-transform: scale(1);\r\n          transform: scale(1);\r\n  border: 0;\r\n  border-radius: 50%;\r\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\r\n  background-color: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n[type=\"checkbox\"]:checked + label:before {\r\n  top: -4px;\r\n  left: -5px;\r\n  width: 12px;\r\n  height: 22px;\r\n  border-top: 2px solid transparent;\r\n  border-left: 2px solid transparent;\r\n  border-right: 2px solid #26a69a;\r\n  border-bottom: 2px solid #26a69a;\r\n  -webkit-transform: rotate(40deg);\r\n          transform: rotate(40deg);\r\n  -webkit-backface-visibility: hidden;\r\n          backface-visibility: hidden;\r\n  -webkit-transform-origin: 100% 100%;\r\n          transform-origin: 100% 100%;\r\n}\r\n\r\n[type=\"checkbox\"]:checked:disabled + label:before {\r\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\r\n  border-bottom: 2px solid rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n/* Indeterminate checkbox */\r\n[type=\"checkbox\"]:indeterminate + label:before {\r\n  top: -11px;\r\n  left: -12px;\r\n  width: 10px;\r\n  height: 22px;\r\n  border-top: none;\r\n  border-left: none;\r\n  border-right: 2px solid #26a69a;\r\n  border-bottom: none;\r\n  -webkit-transform: rotate(90deg);\r\n          transform: rotate(90deg);\r\n  -webkit-backface-visibility: hidden;\r\n          backface-visibility: hidden;\r\n  -webkit-transform-origin: 100% 100%;\r\n          transform-origin: 100% 100%;\r\n}\r\n\r\n[type=\"checkbox\"]:indeterminate:disabled + label:before {\r\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\r\n  background-color: transparent;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in + label:after {\r\n  border-radius: 2px;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in + label:before,\r\n[type=\"checkbox\"].filled-in + label:after {\r\n  content: '';\r\n  left: 0;\r\n  position: absolute;\r\n  /* .1s delay is for check animation */\r\n  transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\r\n  z-index: 1;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:not(:checked) + label:before {\r\n  width: 0;\r\n  height: 0;\r\n  border: 3px solid transparent;\r\n  left: 6px;\r\n  top: 10px;\r\n  -webkit-transform: rotateZ(37deg);\r\n  transform: rotateZ(37deg);\r\n  -webkit-transform-origin: 20% 40%;\r\n  transform-origin: 100% 100%;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:not(:checked) + label:after {\r\n  height: 20px;\r\n  width: 20px;\r\n  background-color: transparent;\r\n  border: 2px solid #5a5a5a;\r\n  top: 0px;\r\n  z-index: 0;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:checked + label:before {\r\n  top: 0;\r\n  left: 1px;\r\n  width: 8px;\r\n  height: 13px;\r\n  border-top: 2px solid transparent;\r\n  border-left: 2px solid transparent;\r\n  border-right: 2px solid #fff;\r\n  border-bottom: 2px solid #fff;\r\n  -webkit-transform: rotateZ(37deg);\r\n  transform: rotateZ(37deg);\r\n  -webkit-transform-origin: 100% 100%;\r\n  transform-origin: 100% 100%;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:checked + label:after {\r\n  top: 0;\r\n  width: 20px;\r\n  height: 20px;\r\n  border: 2px solid #26a69a;\r\n  background-color: #26a69a;\r\n  z-index: 0;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in.tabbed:focus + label:after {\r\n  border-radius: 2px;\r\n  border-color: #5a5a5a;\r\n  background-color: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n[type=\"checkbox\"].filled-in.tabbed:checked:focus + label:after {\r\n  border-radius: 2px;\r\n  background-color: #26a69a;\r\n  border-color: #26a69a;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:before {\r\n  background-color: transparent;\r\n  border: 2px solid transparent;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:after {\r\n  border-color: transparent;\r\n  background-color: #BDBDBD;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:disabled:checked + label:before {\r\n  background-color: transparent;\r\n}\r\n\r\n[type=\"checkbox\"].filled-in:disabled:checked + label:after {\r\n  background-color: #BDBDBD;\r\n  border-color: #BDBDBD;\r\n}\r\n\r\n/* Switch\r\n   ========================================================================== */\r\n.switch,\r\n.switch * {\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -khtml-user-select: none;\r\n  -ms-user-select: none;\r\n}\r\n\r\n.switch label {\r\n  cursor: pointer;\r\n}\r\n\r\n.switch label input[type=checkbox] {\r\n  opacity: 0;\r\n  width: 0;\r\n  height: 0;\r\n}\r\n\r\n.switch label input[type=checkbox]:checked + .lever {\r\n  background-color: #84c7c1;\r\n}\r\n\r\n.switch label input[type=checkbox]:checked + .lever:after {\r\n  background-color: #26a69a;\r\n  left: 24px;\r\n}\r\n\r\n.switch label .lever {\r\n  content: \"\";\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 40px;\r\n  height: 15px;\r\n  background-color: #818181;\r\n  border-radius: 15px;\r\n  margin-right: 10px;\r\n  transition: background 0.3s ease;\r\n  vertical-align: middle;\r\n  margin: 0 16px;\r\n}\r\n\r\n.switch label .lever:after {\r\n  content: \"\";\r\n  position: absolute;\r\n  display: inline-block;\r\n  width: 21px;\r\n  height: 21px;\r\n  background-color: #F1F1F1;\r\n  border-radius: 21px;\r\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4);\r\n  left: -5px;\r\n  top: -3px;\r\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease;\r\n}\r\n\r\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::after,\r\ninput[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::after {\r\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(38, 166, 154, 0.1);\r\n}\r\n\r\ninput[type=checkbox]:not(:disabled) ~ .lever:active:after,\r\ninput[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::after {\r\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(0, 0, 0, 0.08);\r\n}\r\n\r\n.switch input[type=checkbox][disabled] + .lever {\r\n  cursor: default;\r\n}\r\n\r\n.switch label input[type=checkbox][disabled] + .lever:after,\r\n.switch label input[type=checkbox][disabled]:checked + .lever:after {\r\n  background-color: #BDBDBD;\r\n}\r\n\r\n/* Select Field\r\n   ========================================================================== */\r\nselect {\r\n  display: none;\r\n}\r\n\r\nselect.browser-default {\r\n  display: block;\r\n}\r\n\r\nselect {\r\n  background-color: rgba(255, 255, 255, 0.9);\r\n  width: 100%;\r\n  padding: 5px;\r\n  border: 1px solid #f2f2f2;\r\n  border-radius: 2px;\r\n  height: 3rem;\r\n}\r\n\r\n.select-label {\r\n  position: absolute;\r\n}\r\n\r\n.select-wrapper {\r\n  position: relative;\r\n}\r\n\r\n.select-wrapper input.select-dropdown {\r\n  position: relative;\r\n  cursor: pointer;\r\n  background-color: transparent;\r\n  border: none;\r\n  border-bottom: 1px solid #9e9e9e;\r\n  outline: none;\r\n  height: 3rem;\r\n  line-height: 3rem;\r\n  width: 100%;\r\n  font-size: 1rem;\r\n  margin: 0 0 20px 0;\r\n  padding: 0;\r\n  display: block;\r\n}\r\n\r\n.select-wrapper span.caret {\r\n  color: initial;\r\n  position: absolute;\r\n  right: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  height: 10px;\r\n  margin: auto 0;\r\n  font-size: 10px;\r\n  line-height: 10px;\r\n}\r\n\r\n.select-wrapper span.caret.disabled {\r\n  color: rgba(0, 0, 0, 0.26);\r\n}\r\n\r\n.select-wrapper + label {\r\n  position: absolute;\r\n  top: -14px;\r\n  font-size: 0.8rem;\r\n}\r\n\r\nselect:disabled {\r\n  color: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.select-wrapper input.select-dropdown:disabled {\r\n  color: rgba(0, 0, 0, 0.3);\r\n  cursor: default;\r\n  -webkit-user-select: none;\r\n  /* webkit (safari, chrome) browsers */\r\n  -moz-user-select: none;\r\n  /* mozilla browsers */\r\n  -ms-user-select: none;\r\n  /* IE10+ */\r\n  border-bottom: 1px solid rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.select-wrapper i {\r\n  color: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.select-dropdown li.disabled,\r\n.select-dropdown li.disabled > span,\r\n.select-dropdown li.optgroup {\r\n  color: rgba(0, 0, 0, 0.3);\r\n  background-color: transparent;\r\n}\r\n\r\n.prefix ~ .select-wrapper {\r\n  margin-left: 3rem;\r\n  width: 92%;\r\n  width: calc(100% - 3rem);\r\n}\r\n\r\n.prefix ~ label {\r\n  margin-left: 3rem;\r\n}\r\n\r\n.select-dropdown li img {\r\n  height: 40px;\r\n  width: 40px;\r\n  margin: 5px 15px;\r\n  float: right;\r\n}\r\n\r\n.select-dropdown li.optgroup {\r\n  border-top: 1px solid #eee;\r\n}\r\n\r\n.select-dropdown li.optgroup.selected > span {\r\n  color: rgba(0, 0, 0, 0.7);\r\n}\r\n\r\n.select-dropdown li.optgroup > span {\r\n  color: rgba(0, 0, 0, 0.4);\r\n}\r\n\r\n.select-dropdown li.optgroup ~ li.optgroup-option {\r\n  padding-left: 1rem;\r\n}\r\n\r\n/* File Input\r\n   ========================================================================== */\r\n.file-field {\r\n  position: relative;\r\n}\r\n\r\n.file-field .file-path-wrapper {\r\n  overflow: hidden;\r\n  padding-left: 10px;\r\n}\r\n\r\n.file-field input.file-path {\r\n  width: 100%;\r\n}\r\n\r\n.file-field .btn, .file-field .btn-large {\r\n  float: left;\r\n  height: 3rem;\r\n  line-height: 3rem;\r\n}\r\n\r\n.file-field span {\r\n  cursor: pointer;\r\n}\r\n\r\n.file-field input[type=file] {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  width: 100%;\r\n  margin: 0;\r\n  padding: 0;\r\n  font-size: 20px;\r\n  cursor: pointer;\r\n  opacity: 0;\r\n  filter: alpha(opacity=0);\r\n}\r\n\r\n/* Range\r\n   ========================================================================== */\r\n.range-field {\r\n  position: relative;\r\n}\r\n\r\ninput[type=range],\r\ninput[type=range] + .thumb {\r\n  cursor: pointer;\r\n}\r\n\r\ninput[type=range] {\r\n  position: relative;\r\n  background-color: transparent;\r\n  border: none;\r\n  outline: none;\r\n  width: 100%;\r\n  margin: 15px 0;\r\n  padding: 0;\r\n}\r\n\r\ninput[type=range]:focus {\r\n  outline: none;\r\n}\r\n\r\ninput[type=range] + .thumb {\r\n  position: absolute;\r\n  border: none;\r\n  height: 0;\r\n  width: 0;\r\n  border-radius: 50%;\r\n  background-color: #26a69a;\r\n  top: 10px;\r\n  margin-left: -6px;\r\n  -webkit-transform-origin: 50% 50%;\r\n          transform-origin: 50% 50%;\r\n  -webkit-transform: rotate(-45deg);\r\n          transform: rotate(-45deg);\r\n}\r\n\r\ninput[type=range] + .thumb .value {\r\n  display: block;\r\n  width: 30px;\r\n  text-align: center;\r\n  color: #26a69a;\r\n  font-size: 0;\r\n  -webkit-transform: rotate(45deg);\r\n          transform: rotate(45deg);\r\n}\r\n\r\ninput[type=range] + .thumb.active {\r\n  border-radius: 50% 50% 50% 0;\r\n}\r\n\r\ninput[type=range] + .thumb.active .value {\r\n  color: #fff;\r\n  margin-left: -1px;\r\n  margin-top: 8px;\r\n  font-size: 10px;\r\n}\r\n\r\ninput[type=range] {\r\n  -webkit-appearance: none;\r\n}\r\n\r\ninput[type=range]::-webkit-slider-runnable-track {\r\n  height: 3px;\r\n  background: #c2c0c2;\r\n  border: none;\r\n}\r\n\r\ninput[type=range]::-webkit-slider-thumb {\r\n  -webkit-appearance: none;\r\n  border: none;\r\n  height: 14px;\r\n  width: 14px;\r\n  border-radius: 50%;\r\n  background-color: #26a69a;\r\n  -webkit-transform-origin: 50% 50%;\r\n          transform-origin: 50% 50%;\r\n  margin: -5px 0 0 0;\r\n  transition: .3s;\r\n}\r\n\r\ninput[type=range]:focus::-webkit-slider-runnable-track {\r\n  background: #ccc;\r\n}\r\n\r\ninput[type=range] {\r\n  /* fix for FF unable to apply focus style bug  */\r\n  border: 1px solid white;\r\n  /*required for proper track sizing in FF*/\r\n}\r\n\r\ninput[type=range]::-moz-range-track {\r\n  height: 3px;\r\n  background: #ddd;\r\n  border: none;\r\n}\r\n\r\ninput[type=range]::-moz-range-thumb {\r\n  border: none;\r\n  height: 14px;\r\n  width: 14px;\r\n  border-radius: 50%;\r\n  background: #26a69a;\r\n  margin-top: -5px;\r\n}\r\n\r\ninput[type=range]:-moz-focusring {\r\n  outline: 1px solid #fff;\r\n  outline-offset: -1px;\r\n}\r\n\r\ninput[type=range]:focus::-moz-range-track {\r\n  background: #ccc;\r\n}\r\n\r\ninput[type=range]::-ms-track {\r\n  height: 3px;\r\n  background: transparent;\r\n  border-color: transparent;\r\n  border-width: 6px 0;\r\n  /*remove default tick marks*/\r\n  color: transparent;\r\n}\r\n\r\ninput[type=range]::-ms-fill-lower {\r\n  background: #777;\r\n}\r\n\r\ninput[type=range]::-ms-fill-upper {\r\n  background: #ddd;\r\n}\r\n\r\ninput[type=range]::-ms-thumb {\r\n  border: none;\r\n  height: 14px;\r\n  width: 14px;\r\n  border-radius: 50%;\r\n  background: #26a69a;\r\n}\r\n\r\ninput[type=range]:focus::-ms-fill-lower {\r\n  background: #888;\r\n}\r\n\r\ninput[type=range]:focus::-ms-fill-upper {\r\n  background: #ccc;\r\n}\r\n\r\n/***************\r\n    Nav List\r\n***************/\r\n.table-of-contents.fixed {\r\n  position: fixed;\r\n}\r\n\r\n.table-of-contents li {\r\n  padding: 2px 0;\r\n}\r\n\r\n.table-of-contents a {\r\n  display: inline-block;\r\n  font-weight: 300;\r\n  color: #757575;\r\n  padding-left: 20px;\r\n  height: 1.5rem;\r\n  line-height: 1.5rem;\r\n  letter-spacing: .4;\r\n  display: inline-block;\r\n}\r\n\r\n.table-of-contents a:hover {\r\n  color: #a8a8a8;\r\n  padding-left: 19px;\r\n  border-left: 1px solid #ea4a4f;\r\n}\r\n\r\n.table-of-contents a.active {\r\n  font-weight: 500;\r\n  padding-left: 18px;\r\n  border-left: 2px solid #ea4a4f;\r\n}\r\n\r\n.side-nav {\r\n  position: fixed;\r\n  width: 300px;\r\n  left: 0;\r\n  top: 0;\r\n  margin: 0;\r\n  -webkit-transform: translateX(-100%);\r\n          transform: translateX(-100%);\r\n  height: 100%;\r\n  height: calc(100% + 60px);\r\n  height: -moz-calc(100%);\r\n  padding-bottom: 60px;\r\n  background-color: #fff;\r\n  z-index: 999;\r\n  overflow-y: auto;\r\n  will-change: transform;\r\n  -webkit-backface-visibility: hidden;\r\n          backface-visibility: hidden;\r\n  -webkit-transform: translateX(-105%);\r\n          transform: translateX(-105%);\r\n}\r\n\r\n.side-nav.right-aligned {\r\n  right: 0;\r\n  -webkit-transform: translateX(105%);\r\n          transform: translateX(105%);\r\n  left: auto;\r\n  -webkit-transform: translateX(100%);\r\n          transform: translateX(100%);\r\n}\r\n\r\n.side-nav .collapsible {\r\n  margin: 0;\r\n}\r\n\r\n.side-nav li {\r\n  float: none;\r\n  line-height: 48px;\r\n}\r\n\r\n.side-nav li.active {\r\n  background-color: rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n.side-nav a {\r\n  color: rgba(0, 0, 0, 0.87);\r\n  display: block;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  height: 48px;\r\n  line-height: 48px;\r\n  padding: 0 32px;\r\n}\r\n\r\n.side-nav a:hover {\r\n  background-color: rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n.side-nav a.btn, .side-nav a.btn-large, .side-nav a.btn-large, .side-nav a.btn-flat, .side-nav a.btn-floating {\r\n  margin: 10px 15px;\r\n}\r\n\r\n.side-nav a.btn, .side-nav a.btn-large, .side-nav a.btn-large, .side-nav a.btn-floating {\r\n  color: #fff;\r\n}\r\n\r\n.side-nav a.btn-flat {\r\n  color: #343434;\r\n}\r\n\r\n.side-nav a.btn:hover, .side-nav a.btn-large:hover, .side-nav a.btn-large:hover {\r\n  background-color: #2bbbad;\r\n}\r\n\r\n.side-nav a.btn-floating:hover {\r\n  background-color: #26a69a;\r\n}\r\n\r\n.side-nav li > a > i,\r\n.side-nav li > a > [class^=\"mdi-\"], .side-nav li > a > [class*=\"mdi-\"],\r\n.side-nav li > a > i.material-icons {\r\n  float: left;\r\n  height: 48px;\r\n  line-height: 48px;\r\n  margin: 0 32px 0 0;\r\n  width: 24px;\r\n  color: rgba(0, 0, 0, 0.54);\r\n}\r\n\r\n.side-nav .divider {\r\n  margin: 8px 0 0 0;\r\n}\r\n\r\n.side-nav .subheader {\r\n  cursor: initial;\r\n  pointer-events: none;\r\n  color: rgba(0, 0, 0, 0.54);\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  line-height: 48px;\r\n}\r\n\r\n.side-nav .subheader:hover {\r\n  background-color: transparent;\r\n}\r\n\r\n.side-nav .userView {\r\n  position: relative;\r\n  padding: 32px 32px 0;\r\n  margin-bottom: 8px;\r\n}\r\n\r\n.side-nav .userView > a {\r\n  height: auto;\r\n  padding: 0;\r\n}\r\n\r\n.side-nav .userView > a:hover {\r\n  background-color: transparent;\r\n}\r\n\r\n.side-nav .userView .background {\r\n  overflow: hidden;\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: -1;\r\n}\r\n\r\n.side-nav .userView .circle, .side-nav .userView .name, .side-nav .userView .email {\r\n  display: block;\r\n}\r\n\r\n.side-nav .userView .circle {\r\n  height: 64px;\r\n  width: 64px;\r\n}\r\n\r\n.side-nav .userView .name,\r\n.side-nav .userView .email {\r\n  font-size: 14px;\r\n  line-height: 24px;\r\n}\r\n\r\n.side-nav .userView .name {\r\n  margin-top: 16px;\r\n  font-weight: 500;\r\n}\r\n\r\n.side-nav .userView .email {\r\n  padding-bottom: 16px;\r\n  font-weight: 400;\r\n}\r\n\r\n.drag-target {\r\n  height: 100%;\r\n  width: 10px;\r\n  position: fixed;\r\n  top: 0;\r\n  z-index: 998;\r\n}\r\n\r\n.side-nav.fixed {\r\n  left: 0;\r\n  -webkit-transform: translateX(0);\r\n          transform: translateX(0);\r\n  position: fixed;\r\n}\r\n\r\n.side-nav.fixed.right-aligned {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n\r\n@media only screen and (max-width: 992px) {\r\n  .side-nav.fixed {\r\n    -webkit-transform: translateX(-105%);\r\n            transform: translateX(-105%);\r\n  }\r\n  .side-nav.fixed.right-aligned {\r\n    -webkit-transform: translateX(105%);\r\n            transform: translateX(105%);\r\n  }\r\n  .side-nav a {\r\n    padding: 0 16px;\r\n  }\r\n  .side-nav .userView {\r\n    padding: 16px 16px 0;\r\n  }\r\n}\r\n\r\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active,\r\n.side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active {\r\n  background-color: #ee6e73;\r\n}\r\n\r\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active a,\r\n.side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active a {\r\n  color: #fff;\r\n}\r\n\r\n#sidenav-overlay {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  height: 120vh;\r\n  background-color: rgba(0, 0, 0, 0.5);\r\n  z-index: 997;\r\n  will-change: opacity;\r\n}\r\n\r\n/*\r\n    @license\r\n    Copyright (c) 2014 The Polymer Project Authors. All rights reserved.\r\n    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\r\n    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\r\n    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\r\n    Code distributed by Google as part of the polymer project is also\r\n    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\r\n */\r\n/**************************/\r\n/* STYLES FOR THE SPINNER */\r\n/**************************/\r\n/*\r\n * Constants:\r\n *      STROKEWIDTH = 3px\r\n *      ARCSIZE     = 270 degrees (amount of circle the arc takes up)\r\n *      ARCTIME     = 1333ms (time it takes to expand and contract arc)\r\n *      ARCSTARTROT = 216 degrees (how much the start location of the arc\r\n *                                should rotate each time, 216 gives us a\r\n *                                5 pointed star shape (it's 360/5 * 3).\r\n *                                For a 7 pointed star, we might do\r\n *                                360/7 * 3 = 154.286)\r\n *      CONTAINERWIDTH = 28px\r\n *      SHRINK_TIME = 400ms\r\n */\r\n.preloader-wrapper {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 48px;\r\n  height: 48px;\r\n}\r\n\r\n.preloader-wrapper.small {\r\n  width: 36px;\r\n  height: 36px;\r\n}\r\n\r\n.preloader-wrapper.big {\r\n  width: 64px;\r\n  height: 64px;\r\n}\r\n\r\n.preloader-wrapper.active {\r\n  /* duration: 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */\r\n  -webkit-animation: container-rotate 1568ms linear infinite;\r\n  animation: container-rotate 1568ms linear infinite;\r\n}\r\n\r\n@-webkit-keyframes container-rotate {\r\n  to {\r\n    -webkit-transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes container-rotate {\r\n  to {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n.spinner-layer {\r\n  position: absolute;\r\n  width: 100%;\r\n  height: 100%;\r\n  opacity: 0;\r\n  border-color: #26a69a;\r\n}\r\n\r\n.spinner-blue,\r\n.spinner-blue-only {\r\n  border-color: #4285f4;\r\n}\r\n\r\n.spinner-red,\r\n.spinner-red-only {\r\n  border-color: #db4437;\r\n}\r\n\r\n.spinner-yellow,\r\n.spinner-yellow-only {\r\n  border-color: #f4b400;\r\n}\r\n\r\n.spinner-green,\r\n.spinner-green-only {\r\n  border-color: #0f9d58;\r\n}\r\n\r\n/**\r\n * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):\r\n *\r\n * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn't\r\n * guarantee that the animation will start _exactly_ after that value. So we avoid using\r\n * animation-delay and instead set custom keyframes for each color (as redundant as it\r\n * seems).\r\n *\r\n * We write out each animation in full (instead of separating animation-name,\r\n * animation-duration, etc.) because under the polyfill, Safari does not recognize those\r\n * specific properties properly, treats them as -webkit-animation, and overrides the\r\n * other animation rules. See https://github.com/Polymer/platform/issues/53.\r\n */\r\n.active .spinner-layer.spinner-blue {\r\n  /* durations: 4 * ARCTIME */\r\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n.active .spinner-layer.spinner-red {\r\n  /* durations: 4 * ARCTIME */\r\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n.active .spinner-layer.spinner-yellow {\r\n  /* durations: 4 * ARCTIME */\r\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n.active .spinner-layer.spinner-green {\r\n  /* durations: 4 * ARCTIME */\r\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n.active .spinner-layer,\r\n.active .spinner-layer.spinner-blue-only,\r\n.active .spinner-layer.spinner-red-only,\r\n.active .spinner-layer.spinner-yellow-only,\r\n.active .spinner-layer.spinner-green-only {\r\n  /* durations: 4 * ARCTIME */\r\n  opacity: 1;\r\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n@-webkit-keyframes fill-unfill-rotate {\r\n  12.5% {\r\n    -webkit-transform: rotate(135deg);\r\n  }\r\n  /* 0.5 * ARCSIZE */\r\n  25% {\r\n    -webkit-transform: rotate(270deg);\r\n  }\r\n  /* 1   * ARCSIZE */\r\n  37.5% {\r\n    -webkit-transform: rotate(405deg);\r\n  }\r\n  /* 1.5 * ARCSIZE */\r\n  50% {\r\n    -webkit-transform: rotate(540deg);\r\n  }\r\n  /* 2   * ARCSIZE */\r\n  62.5% {\r\n    -webkit-transform: rotate(675deg);\r\n  }\r\n  /* 2.5 * ARCSIZE */\r\n  75% {\r\n    -webkit-transform: rotate(810deg);\r\n  }\r\n  /* 3   * ARCSIZE */\r\n  87.5% {\r\n    -webkit-transform: rotate(945deg);\r\n  }\r\n  /* 3.5 * ARCSIZE */\r\n  to {\r\n    -webkit-transform: rotate(1080deg);\r\n  }\r\n  /* 4   * ARCSIZE */\r\n}\r\n\r\n@keyframes fill-unfill-rotate {\r\n  12.5% {\r\n    -webkit-transform: rotate(135deg);\r\n            transform: rotate(135deg);\r\n  }\r\n  /* 0.5 * ARCSIZE */\r\n  25% {\r\n    -webkit-transform: rotate(270deg);\r\n            transform: rotate(270deg);\r\n  }\r\n  /* 1   * ARCSIZE */\r\n  37.5% {\r\n    -webkit-transform: rotate(405deg);\r\n            transform: rotate(405deg);\r\n  }\r\n  /* 1.5 * ARCSIZE */\r\n  50% {\r\n    -webkit-transform: rotate(540deg);\r\n            transform: rotate(540deg);\r\n  }\r\n  /* 2   * ARCSIZE */\r\n  62.5% {\r\n    -webkit-transform: rotate(675deg);\r\n            transform: rotate(675deg);\r\n  }\r\n  /* 2.5 * ARCSIZE */\r\n  75% {\r\n    -webkit-transform: rotate(810deg);\r\n            transform: rotate(810deg);\r\n  }\r\n  /* 3   * ARCSIZE */\r\n  87.5% {\r\n    -webkit-transform: rotate(945deg);\r\n            transform: rotate(945deg);\r\n  }\r\n  /* 3.5 * ARCSIZE */\r\n  to {\r\n    -webkit-transform: rotate(1080deg);\r\n            transform: rotate(1080deg);\r\n  }\r\n  /* 4   * ARCSIZE */\r\n}\r\n\r\n@-webkit-keyframes blue-fade-in-out {\r\n  from {\r\n    opacity: 1;\r\n  }\r\n  25% {\r\n    opacity: 1;\r\n  }\r\n  26% {\r\n    opacity: 0;\r\n  }\r\n  89% {\r\n    opacity: 0;\r\n  }\r\n  90% {\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\n@keyframes blue-fade-in-out {\r\n  from {\r\n    opacity: 1;\r\n  }\r\n  25% {\r\n    opacity: 1;\r\n  }\r\n  26% {\r\n    opacity: 0;\r\n  }\r\n  89% {\r\n    opacity: 0;\r\n  }\r\n  90% {\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\n@-webkit-keyframes red-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  15% {\r\n    opacity: 0;\r\n  }\r\n  25% {\r\n    opacity: 1;\r\n  }\r\n  50% {\r\n    opacity: 1;\r\n  }\r\n  51% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@keyframes red-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  15% {\r\n    opacity: 0;\r\n  }\r\n  25% {\r\n    opacity: 1;\r\n  }\r\n  50% {\r\n    opacity: 1;\r\n  }\r\n  51% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@-webkit-keyframes yellow-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  40% {\r\n    opacity: 0;\r\n  }\r\n  50% {\r\n    opacity: 1;\r\n  }\r\n  75% {\r\n    opacity: 1;\r\n  }\r\n  76% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@keyframes yellow-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  40% {\r\n    opacity: 0;\r\n  }\r\n  50% {\r\n    opacity: 1;\r\n  }\r\n  75% {\r\n    opacity: 1;\r\n  }\r\n  76% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@-webkit-keyframes green-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  65% {\r\n    opacity: 0;\r\n  }\r\n  75% {\r\n    opacity: 1;\r\n  }\r\n  90% {\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@keyframes green-fade-in-out {\r\n  from {\r\n    opacity: 0;\r\n  }\r\n  65% {\r\n    opacity: 0;\r\n  }\r\n  75% {\r\n    opacity: 1;\r\n  }\r\n  90% {\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n/**\r\n * Patch the gap that appear between the two adjacent div.circle-clipper while the\r\n * spinner is rotating (appears on Chrome 38, Safari 7.1, and IE 11).\r\n */\r\n.gap-patch {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 45%;\r\n  width: 10%;\r\n  height: 100%;\r\n  overflow: hidden;\r\n  border-color: inherit;\r\n}\r\n\r\n.gap-patch .circle {\r\n  width: 1000%;\r\n  left: -450%;\r\n}\r\n\r\n.circle-clipper {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 50%;\r\n  height: 100%;\r\n  overflow: hidden;\r\n  border-color: inherit;\r\n}\r\n\r\n.circle-clipper .circle {\r\n  width: 200%;\r\n  height: 100%;\r\n  border-width: 3px;\r\n  /* STROKEWIDTH */\r\n  border-style: solid;\r\n  border-color: inherit;\r\n  border-bottom-color: transparent !important;\r\n  border-radius: 50%;\r\n  -webkit-animation: none;\r\n  animation: none;\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n}\r\n\r\n.circle-clipper.left .circle {\r\n  left: 0;\r\n  border-right-color: transparent !important;\r\n  -webkit-transform: rotate(129deg);\r\n  transform: rotate(129deg);\r\n}\r\n\r\n.circle-clipper.right .circle {\r\n  left: -100%;\r\n  border-left-color: transparent !important;\r\n  -webkit-transform: rotate(-129deg);\r\n  transform: rotate(-129deg);\r\n}\r\n\r\n.active .circle-clipper.left .circle {\r\n  /* duration: ARCTIME */\r\n  -webkit-animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n.active .circle-clipper.right .circle {\r\n  /* duration: ARCTIME */\r\n  -webkit-animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n  animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\r\n}\r\n\r\n@-webkit-keyframes left-spin {\r\n  from {\r\n    -webkit-transform: rotate(130deg);\r\n  }\r\n  50% {\r\n    -webkit-transform: rotate(-5deg);\r\n  }\r\n  to {\r\n    -webkit-transform: rotate(130deg);\r\n  }\r\n}\r\n\r\n@keyframes left-spin {\r\n  from {\r\n    -webkit-transform: rotate(130deg);\r\n            transform: rotate(130deg);\r\n  }\r\n  50% {\r\n    -webkit-transform: rotate(-5deg);\r\n            transform: rotate(-5deg);\r\n  }\r\n  to {\r\n    -webkit-transform: rotate(130deg);\r\n            transform: rotate(130deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes right-spin {\r\n  from {\r\n    -webkit-transform: rotate(-130deg);\r\n  }\r\n  50% {\r\n    -webkit-transform: rotate(5deg);\r\n  }\r\n  to {\r\n    -webkit-transform: rotate(-130deg);\r\n  }\r\n}\r\n\r\n@keyframes right-spin {\r\n  from {\r\n    -webkit-transform: rotate(-130deg);\r\n            transform: rotate(-130deg);\r\n  }\r\n  50% {\r\n    -webkit-transform: rotate(5deg);\r\n            transform: rotate(5deg);\r\n  }\r\n  to {\r\n    -webkit-transform: rotate(-130deg);\r\n            transform: rotate(-130deg);\r\n  }\r\n}\r\n\r\n#spinnerContainer.cooldown {\r\n  /* duration: SHRINK_TIME */\r\n  -webkit-animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);\r\n  animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);\r\n}\r\n\r\n@-webkit-keyframes fade-out {\r\n  from {\r\n    opacity: 1;\r\n  }\r\n  to {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@keyframes fade-out {\r\n  from {\r\n    opacity: 1;\r\n  }\r\n  to {\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n.slider {\r\n  position: relative;\r\n  height: 400px;\r\n  width: 100%;\r\n}\r\n\r\n.slider.fullscreen {\r\n  height: 100%;\r\n  width: 100%;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n}\r\n\r\n.slider.fullscreen ul.slides {\r\n  height: 100%;\r\n}\r\n\r\n.slider.fullscreen ul.indicators {\r\n  z-index: 2;\r\n  bottom: 30px;\r\n}\r\n\r\n.slider .slides {\r\n  background-color: #9e9e9e;\r\n  margin: 0;\r\n  height: 400px;\r\n}\r\n\r\n.slider .slides li {\r\n  opacity: 0;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 1;\r\n  width: 100%;\r\n  height: inherit;\r\n  overflow: hidden;\r\n}\r\n\r\n.slider .slides li img {\r\n  height: 100%;\r\n  width: 100%;\r\n  background-size: cover;\r\n  background-position: center;\r\n}\r\n\r\n.slider .slides li .caption {\r\n  color: #fff;\r\n  position: absolute;\r\n  top: 15%;\r\n  left: 15%;\r\n  width: 70%;\r\n  opacity: 0;\r\n}\r\n\r\n.slider .slides li .caption p {\r\n  color: #e0e0e0;\r\n}\r\n\r\n.slider .slides li.active {\r\n  z-index: 2;\r\n}\r\n\r\n.slider .indicators {\r\n  position: absolute;\r\n  text-align: center;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  margin: 0;\r\n}\r\n\r\n.slider .indicators .indicator-item {\r\n  display: inline-block;\r\n  position: relative;\r\n  cursor: pointer;\r\n  height: 16px;\r\n  width: 16px;\r\n  margin: 0 12px;\r\n  background-color: #e0e0e0;\r\n  transition: background-color .3s;\r\n  border-radius: 50%;\r\n}\r\n\r\n.slider .indicators .indicator-item.active {\r\n  background-color: #4CAF50;\r\n}\r\n\r\n.carousel {\r\n  overflow: hidden;\r\n  position: relative;\r\n  width: 100%;\r\n  height: 400px;\r\n  -webkit-perspective: 500px;\r\n          perspective: 500px;\r\n  -webkit-transform-style: preserve-3d;\r\n          transform-style: preserve-3d;\r\n  -webkit-transform-origin: 0% 50%;\r\n          transform-origin: 0% 50%;\r\n}\r\n\r\n.carousel.carousel-slider {\r\n  top: 0;\r\n  left: 0;\r\n  height: 0;\r\n}\r\n\r\n.carousel.carousel-slider .carousel-fixed-item {\r\n  position: absolute;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 20px;\r\n  z-index: 1;\r\n}\r\n\r\n.carousel.carousel-slider .carousel-fixed-item.with-indicators {\r\n  bottom: 68px;\r\n}\r\n\r\n.carousel.carousel-slider .carousel-item {\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 400px;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n}\r\n\r\n.carousel.carousel-slider .carousel-item h2 {\r\n  font-size: 24px;\r\n  font-weight: 500;\r\n  line-height: 32px;\r\n}\r\n\r\n.carousel.carousel-slider .carousel-item p {\r\n  font-size: 15px;\r\n}\r\n\r\n.carousel .carousel-item {\r\n  display: none;\r\n  width: 200px;\r\n  height: 400px;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n}\r\n\r\n.carousel .carousel-item img {\r\n  width: 100%;\r\n}\r\n\r\n.carousel .indicators {\r\n  position: absolute;\r\n  text-align: center;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  margin: 0;\r\n}\r\n\r\n.carousel .indicators .indicator-item {\r\n  display: inline-block;\r\n  position: relative;\r\n  cursor: pointer;\r\n  height: 8px;\r\n  width: 8px;\r\n  margin: 24px 4px;\r\n  background-color: rgba(255, 255, 255, 0.5);\r\n  transition: background-color .3s;\r\n  border-radius: 50%;\r\n}\r\n\r\n.carousel .indicators .indicator-item.active {\r\n  background-color: #fff;\r\n}\r\n\r\n/* ==========================================================================\r\n   $BASE-PICKER\r\n   ========================================================================== */\r\n/**\r\n * Note: the root picker element should *NOT* be styled more than what's here.\r\n */\r\n.picker {\r\n  font-size: 16px;\r\n  text-align: left;\r\n  line-height: 1.2;\r\n  color: #000000;\r\n  position: absolute;\r\n  z-index: 10000;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n/**\r\n * The picker input element.\r\n */\r\n.picker__input {\r\n  cursor: default;\r\n}\r\n\r\n/**\r\n * When the picker is opened, the input element is \"activated\".\r\n */\r\n.picker__input.picker__input--active {\r\n  border-color: #0089ec;\r\n}\r\n\r\n/**\r\n * The holder is the only \"scrollable\" top-level container element.\r\n */\r\n.picker__holder {\r\n  width: 100%;\r\n  overflow-y: auto;\r\n  -webkit-overflow-scrolling: touch;\r\n}\r\n\r\n/*!\r\n * Default mobile-first, responsive styling for pickadate.js\r\n * Demo: http://amsul.github.io/pickadate.js\r\n */\r\n/**\r\n * Note: the root picker element should *NOT* be styled more than what's here.\r\n */\r\n/**\r\n * Make the holder and frame fullscreen.\r\n */\r\n.picker__holder,\r\n.picker__frame {\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  top: 100%;\r\n}\r\n\r\n/**\r\n * The holder should overlay the entire screen.\r\n */\r\n.picker__holder {\r\n  position: fixed;\r\n  transition: background 0.15s ease-out, top 0s 0.15s;\r\n  -webkit-backface-visibility: hidden;\r\n}\r\n\r\n/**\r\n * The frame that bounds the box contents of the picker.\r\n */\r\n.picker__frame {\r\n  position: absolute;\r\n  margin: 0 auto;\r\n  min-width: 256px;\r\n  width: 300px;\r\n  max-height: 350px;\r\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\r\n  filter: alpha(opacity=0);\r\n  -moz-opacity: 0;\r\n  opacity: 0;\r\n  transition: all 0.15s ease-out;\r\n}\r\n\r\n@media (min-height: 28.875em) {\r\n  .picker__frame {\r\n    overflow: visible;\r\n    top: auto;\r\n    bottom: -100%;\r\n    max-height: 80%;\r\n  }\r\n}\r\n\r\n@media (min-height: 40.125em) {\r\n  .picker__frame {\r\n    margin-bottom: 7.5%;\r\n  }\r\n}\r\n\r\n/**\r\n * The wrapper sets the stage to vertically align the box contents.\r\n */\r\n.picker__wrap {\r\n  display: table;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n@media (min-height: 28.875em) {\r\n  .picker__wrap {\r\n    display: block;\r\n  }\r\n}\r\n\r\n/**\r\n * The box contains all the picker contents.\r\n */\r\n.picker__box {\r\n  background: #ffffff;\r\n  display: table-cell;\r\n  vertical-align: middle;\r\n}\r\n\r\n@media (min-height: 28.875em) {\r\n  .picker__box {\r\n    display: block;\r\n    border: 1px solid #777777;\r\n    border-top-color: #898989;\r\n    border-bottom-width: 0;\r\n    border-radius: 5px 5px 0 0;\r\n    box-shadow: 0 12px 36px 16px rgba(0, 0, 0, 0.24);\r\n  }\r\n}\r\n\r\n/**\r\n * When the picker opens...\r\n */\r\n.picker--opened .picker__holder {\r\n  top: 0;\r\n  background: transparent;\r\n  -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#1E000000,endColorstr=#1E000000)\";\r\n  zoom: 1;\r\n  background: rgba(0, 0, 0, 0.32);\r\n  transition: background 0.15s ease-out;\r\n}\r\n\r\n.picker--opened .picker__frame {\r\n  top: 0;\r\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";\r\n  filter: alpha(opacity=100);\r\n  -moz-opacity: 1;\r\n  opacity: 1;\r\n}\r\n\r\n@media (min-height: 35.875em) {\r\n  .picker--opened .picker__frame {\r\n    top: 10%;\r\n    bottom: auto;\r\n  }\r\n}\r\n\r\n/**\r\n * For `large` screens, transform into an inline picker.\r\n */\r\n/* ==========================================================================\r\n   CUSTOM MATERIALIZE STYLES\r\n   ========================================================================== */\r\n.picker__input.picker__input--active {\r\n  border-color: #E3F2FD;\r\n}\r\n\r\n.picker__frame {\r\n  margin: 0 auto;\r\n  max-width: 325px;\r\n}\r\n\r\n@media (min-height: 38.875em) {\r\n  .picker--opened .picker__frame {\r\n    top: 10%;\r\n    bottom: auto;\r\n  }\r\n}\r\n\r\n/* ==========================================================================\r\n   $BASE-DATE-PICKER\r\n   ========================================================================== */\r\n/**\r\n * The picker box.\r\n */\r\n.picker__box {\r\n  padding: 0 1em;\r\n}\r\n\r\n/**\r\n * The header containing the month and year stuff.\r\n */\r\n.picker__header {\r\n  text-align: center;\r\n  position: relative;\r\n  margin-top: .75em;\r\n}\r\n\r\n/**\r\n * The month and year labels.\r\n */\r\n.picker__month,\r\n.picker__year {\r\n  display: inline-block;\r\n  margin-left: .25em;\r\n  margin-right: .25em;\r\n}\r\n\r\n/**\r\n * The month and year selectors.\r\n */\r\n.picker__select--month,\r\n.picker__select--year {\r\n  height: 2em;\r\n  padding: 0;\r\n  margin-left: .25em;\r\n  margin-right: .25em;\r\n}\r\n\r\n.picker__select--month.browser-default {\r\n  display: inline;\r\n  background-color: #FFFFFF;\r\n  width: 40%;\r\n}\r\n\r\n.picker__select--year.browser-default {\r\n  display: inline;\r\n  background-color: #FFFFFF;\r\n  width: 26%;\r\n}\r\n\r\n.picker__select--month:focus,\r\n.picker__select--year:focus {\r\n  border-color: rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n/**\r\n * The month navigation buttons.\r\n */\r\n.picker__nav--prev,\r\n.picker__nav--next {\r\n  position: absolute;\r\n  padding: .5em 1.25em;\r\n  width: 1em;\r\n  height: 1em;\r\n  box-sizing: content-box;\r\n  top: -0.25em;\r\n}\r\n\r\n.picker__nav--prev {\r\n  left: -1em;\r\n  padding-right: 1.25em;\r\n}\r\n\r\n.picker__nav--next {\r\n  right: -1em;\r\n  padding-left: 1.25em;\r\n}\r\n\r\n.picker__nav--disabled,\r\n.picker__nav--disabled:hover,\r\n.picker__nav--disabled:before,\r\n.picker__nav--disabled:before:hover {\r\n  cursor: default;\r\n  background: none;\r\n  border-right-color: #f5f5f5;\r\n  border-left-color: #f5f5f5;\r\n}\r\n\r\n/**\r\n * The calendar table of dates\r\n */\r\n.picker__table {\r\n  text-align: center;\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n  table-layout: fixed;\r\n  font-size: 1rem;\r\n  width: 100%;\r\n  margin-top: .75em;\r\n  margin-bottom: .5em;\r\n}\r\n\r\n.picker__table th, .picker__table td {\r\n  text-align: center;\r\n}\r\n\r\n.picker__table td {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n/**\r\n * The weekday labels\r\n */\r\n.picker__weekday {\r\n  width: 14.285714286%;\r\n  font-size: .75em;\r\n  padding-bottom: .25em;\r\n  color: #999999;\r\n  font-weight: 500;\r\n  /* Increase the spacing a tad */\r\n}\r\n\r\n@media (min-height: 33.875em) {\r\n  .picker__weekday {\r\n    padding-bottom: .5em;\r\n  }\r\n}\r\n\r\n/**\r\n * The days on the calendar\r\n */\r\n.picker__day--today {\r\n  position: relative;\r\n  color: #595959;\r\n  letter-spacing: -.3;\r\n  padding: .75rem 0;\r\n  font-weight: 400;\r\n  border: 1px solid transparent;\r\n}\r\n\r\n.picker__day--disabled:before {\r\n  border-top-color: #aaaaaa;\r\n}\r\n\r\n.picker__day--infocus:hover {\r\n  cursor: pointer;\r\n  color: #000;\r\n  font-weight: 500;\r\n}\r\n\r\n.picker__day--outfocus {\r\n  display: none;\r\n  padding: .75rem 0;\r\n  color: #fff;\r\n}\r\n\r\n.picker__day--outfocus:hover {\r\n  cursor: pointer;\r\n  color: #dddddd;\r\n  font-weight: 500;\r\n}\r\n\r\n.picker__day--highlighted:hover,\r\n.picker--focused .picker__day--highlighted {\r\n  cursor: pointer;\r\n}\r\n\r\n.picker__day--selected,\r\n.picker__day--selected:hover,\r\n.picker--focused .picker__day--selected {\r\n  border-radius: 50%;\r\n  -webkit-transform: scale(0.75);\r\n          transform: scale(0.75);\r\n  background: #0089ec;\r\n  color: #ffffff;\r\n}\r\n\r\n.picker__day--disabled,\r\n.picker__day--disabled:hover,\r\n.picker--focused .picker__day--disabled {\r\n  background: #f5f5f5;\r\n  border-color: #f5f5f5;\r\n  color: #dddddd;\r\n  cursor: default;\r\n}\r\n\r\n.picker__day--highlighted.picker__day--disabled,\r\n.picker__day--highlighted.picker__day--disabled:hover {\r\n  background: #bbbbbb;\r\n}\r\n\r\n/**\r\n * The footer containing the \"today\", \"clear\", and \"close\" buttons.\r\n */\r\n.picker__footer {\r\n  text-align: center;\r\n  display: -webkit-flex;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-align-items: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-justify-content: space-between;\r\n      -ms-flex-pack: justify;\r\n          justify-content: space-between;\r\n}\r\n\r\n.picker__button--today,\r\n.picker__button--clear,\r\n.picker__button--close {\r\n  border: 1px solid #ffffff;\r\n  background: #ffffff;\r\n  font-size: .8em;\r\n  padding: .66em 0;\r\n  font-weight: bold;\r\n  width: 33%;\r\n  display: inline-block;\r\n  vertical-align: bottom;\r\n}\r\n\r\n.picker__button--today:hover,\r\n.picker__button--clear:hover,\r\n.picker__button--close:hover {\r\n  cursor: pointer;\r\n  color: #000000;\r\n  background: #b1dcfb;\r\n  border-bottom-color: #b1dcfb;\r\n}\r\n\r\n.picker__button--today:focus,\r\n.picker__button--clear:focus,\r\n.picker__button--close:focus {\r\n  background: #b1dcfb;\r\n  border-color: rgba(0, 0, 0, 0.05);\r\n  outline: none;\r\n}\r\n\r\n.picker__button--today:before,\r\n.picker__button--clear:before,\r\n.picker__button--close:before {\r\n  position: relative;\r\n  display: inline-block;\r\n  height: 0;\r\n}\r\n\r\n.picker__button--today:before,\r\n.picker__button--clear:before {\r\n  content: \" \";\r\n  margin-right: .45em;\r\n}\r\n\r\n.picker__button--today:before {\r\n  top: -0.05em;\r\n  width: 0;\r\n  border-top: 0.66em solid #0059bc;\r\n  border-left: .66em solid transparent;\r\n}\r\n\r\n.picker__button--clear:before {\r\n  top: -0.25em;\r\n  width: .66em;\r\n  border-top: 3px solid #ee2200;\r\n}\r\n\r\n.picker__button--close:before {\r\n  content: \"\\D7\";\r\n  top: -0.1em;\r\n  vertical-align: top;\r\n  font-size: 1.1em;\r\n  margin-right: .35em;\r\n  color: #777777;\r\n}\r\n\r\n.picker__button--today[disabled],\r\n.picker__button--today[disabled]:hover {\r\n  background: #f5f5f5;\r\n  border-color: #f5f5f5;\r\n  color: #dddddd;\r\n  cursor: default;\r\n}\r\n\r\n.picker__button--today[disabled]:before {\r\n  border-top-color: #aaaaaa;\r\n}\r\n\r\n/* ==========================================================================\r\n   CUSTOM MATERIALIZE STYLES\r\n   ========================================================================== */\r\n.picker__box {\r\n  border-radius: 2px;\r\n  overflow: hidden;\r\n}\r\n\r\n.picker__date-display {\r\n  text-align: center;\r\n  background-color: #26a69a;\r\n  color: #fff;\r\n  padding-bottom: 15px;\r\n  font-weight: 300;\r\n}\r\n\r\n.picker__nav--prev:hover,\r\n.picker__nav--next:hover {\r\n  cursor: pointer;\r\n  color: #000000;\r\n  background: #a1ded8;\r\n}\r\n\r\n.picker__weekday-display {\r\n  background-color: #1f897f;\r\n  padding: 10px;\r\n  font-weight: 200;\r\n  letter-spacing: .5;\r\n  font-size: 1rem;\r\n  margin-bottom: 15px;\r\n}\r\n\r\n.picker__month-display {\r\n  text-transform: uppercase;\r\n  font-size: 2rem;\r\n}\r\n\r\n.picker__day-display {\r\n  font-size: 4.5rem;\r\n  font-weight: 400;\r\n}\r\n\r\n.picker__year-display {\r\n  font-size: 1.8rem;\r\n  color: rgba(255, 255, 255, 0.4);\r\n}\r\n\r\n.picker__box {\r\n  padding: 0;\r\n}\r\n\r\n.picker__calendar-container {\r\n  padding: 0 1rem;\r\n}\r\n\r\n.picker__calendar-container thead {\r\n  border: none;\r\n}\r\n\r\n.picker__table {\r\n  margin-top: 0;\r\n  margin-bottom: .5em;\r\n}\r\n\r\n.picker__day--infocus {\r\n  color: #595959;\r\n  letter-spacing: -.3;\r\n  padding: .75rem 0;\r\n  font-weight: 400;\r\n  border: 1px solid transparent;\r\n}\r\n\r\n.picker__day.picker__day--today {\r\n  color: #26a69a;\r\n}\r\n\r\n.picker__day.picker__day--today.picker__day--selected {\r\n  color: #fff;\r\n}\r\n\r\n.picker__weekday {\r\n  font-size: .9rem;\r\n}\r\n\r\n.picker__day--selected,\r\n.picker__day--selected:hover,\r\n.picker--focused .picker__day--selected {\r\n  border-radius: 50%;\r\n  -webkit-transform: scale(0.9);\r\n          transform: scale(0.9);\r\n  background-color: #26a69a;\r\n  color: #ffffff;\r\n}\r\n\r\n.picker__day--selected.picker__day--outfocus,\r\n.picker__day--selected:hover.picker__day--outfocus,\r\n.picker--focused .picker__day--selected.picker__day--outfocus {\r\n  background-color: #a1ded8;\r\n}\r\n\r\n.picker__footer {\r\n  text-align: right;\r\n  padding: 5px 10px;\r\n}\r\n\r\n.picker__close, .picker__today {\r\n  font-size: 1.1rem;\r\n  padding: 0 1rem;\r\n  color: #26a69a;\r\n}\r\n\r\n.picker__nav--prev:before,\r\n.picker__nav--next:before {\r\n  content: \" \";\r\n  border-top: .5em solid transparent;\r\n  border-bottom: .5em solid transparent;\r\n  border-right: 0.75em solid #676767;\r\n  width: 0;\r\n  height: 0;\r\n  display: block;\r\n  margin: 0 auto;\r\n}\r\n\r\n.picker__nav--next:before {\r\n  border-right: 0;\r\n  border-left: 0.75em solid #676767;\r\n}\r\n\r\nbutton.picker__today:focus, button.picker__clear:focus, button.picker__close:focus {\r\n  background-color: #a1ded8;\r\n}\r\n\r\n/* ==========================================================================\r\n   $BASE-TIME-PICKER\r\n   ========================================================================== */\r\n/**\r\n * The list of times.\r\n */\r\n.picker__list {\r\n  list-style: none;\r\n  padding: 0.75em 0 4.2em;\r\n  margin: 0;\r\n}\r\n\r\n/**\r\n * The times on the clock.\r\n */\r\n.picker__list-item {\r\n  border-bottom: 1px solid #dddddd;\r\n  border-top: 1px solid #dddddd;\r\n  margin-bottom: -1px;\r\n  position: relative;\r\n  background: #ffffff;\r\n  padding: .75em 1.25em;\r\n}\r\n\r\n@media (min-height: 46.75em) {\r\n  .picker__list-item {\r\n    padding: .5em 1em;\r\n  }\r\n}\r\n\r\n/* Hovered time */\r\n.picker__list-item:hover {\r\n  cursor: pointer;\r\n  color: #000000;\r\n  background: #b1dcfb;\r\n  border-color: #0089ec;\r\n  z-index: 10;\r\n}\r\n\r\n/* Highlighted and hovered/focused time */\r\n.picker__list-item--highlighted {\r\n  border-color: #0089ec;\r\n  z-index: 10;\r\n}\r\n\r\n.picker__list-item--highlighted:hover,\r\n.picker--focused .picker__list-item--highlighted {\r\n  cursor: pointer;\r\n  color: #000000;\r\n  background: #b1dcfb;\r\n}\r\n\r\n/* Selected and hovered/focused time */\r\n.picker__list-item--selected,\r\n.picker__list-item--selected:hover,\r\n.picker--focused .picker__list-item--selected {\r\n  background: #0089ec;\r\n  color: #ffffff;\r\n  z-index: 10;\r\n}\r\n\r\n/* Disabled time */\r\n.picker__list-item--disabled,\r\n.picker__list-item--disabled:hover,\r\n.picker--focused .picker__list-item--disabled {\r\n  background: #f5f5f5;\r\n  border-color: #f5f5f5;\r\n  color: #dddddd;\r\n  cursor: default;\r\n  border-color: #dddddd;\r\n  z-index: auto;\r\n}\r\n\r\n/**\r\n * The clear button\r\n */\r\n.picker--time .picker__button--clear {\r\n  display: block;\r\n  width: 80%;\r\n  margin: 1em auto 0;\r\n  padding: 1em 1.25em;\r\n  background: none;\r\n  border: 0;\r\n  font-weight: 500;\r\n  font-size: .67em;\r\n  text-align: center;\r\n  text-transform: uppercase;\r\n  color: #666;\r\n}\r\n\r\n.picker--time .picker__button--clear:hover,\r\n.picker--time .picker__button--clear:focus {\r\n  color: #000000;\r\n  background: #b1dcfb;\r\n  background: #ee2200;\r\n  border-color: #ee2200;\r\n  cursor: pointer;\r\n  color: #ffffff;\r\n  outline: none;\r\n}\r\n\r\n.picker--time .picker__button--clear:before {\r\n  top: -0.25em;\r\n  color: #666;\r\n  font-size: 1.25em;\r\n  font-weight: bold;\r\n}\r\n\r\n.picker--time .picker__button--clear:hover:before,\r\n.picker--time .picker__button--clear:focus:before {\r\n  color: #ffffff;\r\n}\r\n\r\n/* ==========================================================================\r\n   $DEFAULT-TIME-PICKER\r\n   ========================================================================== */\r\n/**\r\n * The frame the bounds the time picker.\r\n */\r\n.picker--time .picker__frame {\r\n  min-width: 256px;\r\n  max-width: 320px;\r\n}\r\n\r\n/**\r\n * The picker box.\r\n */\r\n.picker--time .picker__box {\r\n  font-size: 1em;\r\n  background: #f2f2f2;\r\n  padding: 0;\r\n}\r\n\r\n@media (min-height: 40.125em) {\r\n  .picker--time .picker__box {\r\n    margin-bottom: 5em;\r\n  }\r\n}\r\n", ""]);

// exports


/***/ },

/***/ 242:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)();
// imports


// module
exports.push([module.i, ".InputRange-slider {\r\n  -webkit-appearance: none;\r\n     -moz-appearance: none;\r\n          appearance: none;\r\n  background: #3f51b5;\r\n  border: 1px solid #3f51b5;\r\n  border-radius: 100%;\r\n  cursor: pointer;\r\n  display: block;\r\n  height: 1rem;\r\n  margin-left: -0.5rem;\r\n  margin-top: -0.65rem;\r\n  outline: none;\r\n  position: absolute;\r\n  top: 50%;\r\n  transition: -webkit-transform 0.3s ease-out, box-shadow 0.3s ease-out;\r\n  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;\r\n  width: 1rem; }\r\n  .InputRange-slider:active {\r\n    -webkit-transform: scale(1.3);\r\n            transform: scale(1.3); }\r\n  .InputRange-slider:focus {\r\n    box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2); }\r\n  .InputRange.is-disabled .InputRange-slider {\r\n    background: #cccccc;\r\n    border: 1px solid #cccccc;\r\n    box-shadow: none;\r\n    -webkit-transform: none;\r\n            transform: none; }\r\n\r\n.InputRange-sliderContainer {\r\n  transition: left 0.3s ease-out; }\r\n\r\n.InputRange-label {\r\n  color: #aaaaaa;\r\n  font-family: \"Helvetica Neue\", san-serif;\r\n  font-size: 0.8rem;\r\n  white-space: nowrap; }\r\n\r\n.InputRange-label--min,\r\n.InputRange-label--max {\r\n  bottom: -1.4rem;\r\n  position: absolute; }\r\n\r\n.InputRange-label--min {\r\n  left: 0; }\r\n\r\n.InputRange-label--max {\r\n  right: 0; }\r\n\r\n.InputRange-label--value {\r\n  position: absolute;\r\n  top: -1.8rem; }\r\n\r\n.InputRange-labelContainer {\r\n  left: -50%;\r\n  position: relative; }\r\n  .InputRange-label--max .InputRange-labelContainer {\r\n    left: 50%; }\r\n\r\n.InputRange-track {\r\n  background: #eeeeee;\r\n  border-radius: 0.3rem;\r\n  cursor: pointer;\r\n  display: block;\r\n  height: 0.3rem;\r\n  position: relative;\r\n  transition: left 0.3s ease-out, width 0.3s ease-out; }\r\n  .InputRange.is-disabled .InputRange-track {\r\n    background: #eeeeee; }\r\n\r\n.InputRange-track--container {\r\n  left: 0;\r\n  margin-top: -0.15rem;\r\n  position: absolute;\r\n  right: 0;\r\n  top: 50%; }\r\n\r\n.InputRange-track--active {\r\n  background: #3f51b5; }\r\n\r\n.InputRange {\r\n  height: 1rem;\r\n  position: relative;\r\n  width: 100%; }\r\n", ""]);

// exports


/***/ },

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)();
// imports


// module
exports.push([module.i, ".input-field label {\r\n  left: 0;\r\n}\r\n\r\n.range-slider {\r\n  margin: 65px 0 30px;\r\n}\r\n\r\n.range-slider label {\r\n  top: -37px;\r\n}\r\n\r\nlabel {\r\n  color: white !important;\r\n}\r\n\r\n.pagination li > a {\r\n  cursor: pointer;\r\n}\r\n\r\n.pagination {\r\n  margin-bottom: 5px;\r\n}\r\n\r\na.secondary-content {\r\n  position: relative !important;\r\n  flex: 1;\r\n  text-align: right;\r\n  top: 0px !important;\r\n  right: 0px !important;\r\n}\r\n\r\n.secondary-content .material-icons {\r\n  font-size: 36px;\r\n}\r\n\r\n.artist-detail .header {\r\n  display: flex;\r\n  justify-content: space-between;\r\n}\r\n\r\n.flex {\r\n  display: flex;\r\n  justify-content: space-around;\r\n}\r\n\r\n.wrap {\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.album img {\r\n  width: 250px !important;\r\n}\r\n\r\n.has-error {\r\n  color: red;\r\n}\r\n\r\n.spacer a {\r\n  margin: 0px 10px;\r\n  cursor: pointer;\r\n}\r\n\r\nli.collection-item.avatar {\r\n  display: flex;\r\n  align-items: center;\r\n  padding-left: 10px !important;\r\n}\r\n\r\nli.collection-item.avatar img {\r\n  position: relative !important;\r\n  left: 0px !important;\r\n  margin: 0px 10px !important;\r\n}\r\n\r\n.retired {\r\n  background-color: #ddd !important;\r\n}\r\n\r\n.select {\r\n  font-size: 1rem;\r\n}\r\n\r\nselect {\r\n  display: block !important;\r\n  margin-bottom: 10px;\r\n  height: 30px;\r\n  color: black;\r\n}\r\n", ""]);

// exports


/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteArtist = exports.editArtist = exports.createArtist = exports.findArtist = exports.searchArtists = exports.setYearsActiveRange = exports.setAgeRange = exports.setNotRetired = exports.setRetired = exports.deselectArtist = exports.selectArtist = exports.clearError = exports.resetArtist = undefined;

var _lodash = __webpack_require__(8);

var _lodash2 = _interopRequireDefault(_lodash);

var _reactRouter = __webpack_require__(52);

var _types = __webpack_require__(41);

var _GetAgeRange = __webpack_require__(219);

var _GetAgeRange2 = _interopRequireDefault(_GetAgeRange);

var _GetYearsActiveRange = __webpack_require__(220);

var _GetYearsActiveRange2 = _interopRequireDefault(_GetYearsActiveRange);

var _SearchArtists = __webpack_require__(221);

var _SearchArtists2 = _interopRequireDefault(_SearchArtists);

var _FindArtist = __webpack_require__(218);

var _FindArtist2 = _interopRequireDefault(_FindArtist);

var _CreateArtist = __webpack_require__(215);

var _CreateArtist2 = _interopRequireDefault(_CreateArtist);

var _EditArtist = __webpack_require__(217);

var _EditArtist2 = _interopRequireDefault(_EditArtist);

var _DeleteArtist = __webpack_require__(216);

var _DeleteArtist2 = _interopRequireDefault(_DeleteArtist);

var _SetRetired = __webpack_require__(223);

var _SetRetired2 = _interopRequireDefault(_SetRetired);

var _SetNotRetired = __webpack_require__(222);

var _SetNotRetired2 = _interopRequireDefault(_SetNotRetired);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetArtist = exports.resetArtist = function resetArtist() {
  return { type: _types.RESET_ARTIST };
};

var clearError = exports.clearError = function clearError() {
  return { type: _types.CLEAR_ERROR };
};

var selectArtist = exports.selectArtist = function selectArtist(id) {
  return { type: _types.SELECT_ARTIST, payload: id };
};

var deselectArtist = exports.deselectArtist = function deselectArtist(id) {
  return { type: _types.DESELECT_ARTIST, payload: id };
};

var setRetired = exports.setRetired = function setRetired(ids) {
  return function (dispatch, getState) {
    return SetRetiredProxy(ids.map(function (id) {
      return id.toString();
    })).then(function () {
      return dispatch({ type: _types.RESET_SELECTION });
    }).then(function () {
      return refreshSearch(dispatch, getState);
    });
  };
};

var setNotRetired = exports.setNotRetired = function setNotRetired(ids) {
  return function (dispatch, getState) {
    return SetNotRetiredProxy(ids.map(function (id) {
      return id.toString();
    })).then(function () {
      return dispatch({ type: _types.RESET_SELECTION });
    }).then(function () {
      return refreshSearch(dispatch, getState);
    });
  };
};

var setAgeRange = exports.setAgeRange = function setAgeRange() {
  return function (dispatch) {
    return GetAgeRangeProxy().then(function (result) {
      return dispatch({ type: _types.SET_AGE_RANGE, payload: result });
    });
  };
};

var setYearsActiveRange = exports.setYearsActiveRange = function setYearsActiveRange() {
  return function (dispatch) {
    return GetYearsActiveRangeProxy().then(function (result) {
      return dispatch({ type: _types.SET_YEARS_ACTIVE_RANGE, payload: result });
    });
  };
};

var searchArtists = exports.searchArtists = function searchArtists() {
  for (var _len = arguments.length, criteria = Array(_len), _key = 0; _key < _len; _key++) {
    criteria[_key] = arguments[_key];
  }

  return function (dispatch) {
    return SearchArtistsProxy.apply(undefined, criteria).then(function () {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return dispatch({ type: _types.SEARCH_ARTISTS, payload: result });
    });
  };
};

var findArtist = exports.findArtist = function findArtist(id) {
  return function (dispatch) {
    return FindArtistProxy(id).then(function (artist) {
      return dispatch({ type: _types.FIND_ARTIST, payload: artist });
    });
  };
};

var createArtist = exports.createArtist = function createArtist(props) {
  return function (dispatch) {
    return CreateArtistProxy(props).then(function (artist) {
      _reactRouter.hashHistory.push('artists/' + artist._id);
    }).catch(function (error) {
      console.log(error);
      dispatch({ type: _types.CREATE_ERROR, payload: error });
    });
  };
};

var editArtist = exports.editArtist = function editArtist(id, props) {
  return function (dispatch) {
    return EditArtistProxy(id, props).then(function () {
      return _reactRouter.hashHistory.push('artists/' + id);
    }).catch(function (error) {
      console.log(error);
      dispatch({ type: _types.CREATE_ERROR, payload: error });
    });
  };
};

var deleteArtist = exports.deleteArtist = function deleteArtist(id) {
  return function (dispatch) {
    return DeleteArtistProxy(id).then(function () {
      return _reactRouter.hashHistory.push('/');
    }).catch(function (error) {
      console.log(error);
      dispatch({ type: _types.CREATE_ERROR, payload: error });
    });
  };
};

//
// Faux Proxies

var GetAgeRangeProxy = function GetAgeRangeProxy() {
  var result = _GetAgeRange2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var GetYearsActiveRangeProxy = function GetYearsActiveRangeProxy() {
  var result = _GetYearsActiveRange2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var SearchArtistsProxy = function SearchArtistsProxy(criteria, offset, limit) {
  var result = (0, _SearchArtists2.default)(_lodash2.default.omit(criteria, 'sort'), criteria.sort, offset, limit);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var FindArtistProxy = function FindArtistProxy() {
  var result = _FindArtist2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var CreateArtistProxy = function CreateArtistProxy() {
  var result = _CreateArtist2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var EditArtistProxy = function EditArtistProxy() {
  var result = _EditArtist2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var DeleteArtistProxy = function DeleteArtistProxy() {
  var result = _DeleteArtist2.default.apply(undefined, arguments);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var SetRetiredProxy = function SetRetiredProxy(_ids) {
  var result = (0, _SetRetired2.default)(_ids);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

var SetNotRetiredProxy = function SetNotRetiredProxy(_ids) {
  var result = (0, _SetNotRetired2.default)(_ids);
  if (!result || !result.then) {
    return new Promise(function () {});
  }
  return result;
};

//
// Helpers

var refreshSearch = function refreshSearch(dispatch, getState) {
  var _getState = getState(),
      _getState$artists = _getState.artists,
      offset = _getState$artists.offset,
      limit = _getState$artists.limit;

  var criteria = getState().form.filters.values;

  dispatch(searchArtists(_lodash2.default.extend({}, { name: '' }, criteria), offset, limit));
};

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports.locationsAreEqual = exports.statesAreEqual = exports.createLocation = exports.createQuery = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

var _PathUtils = __webpack_require__(21);

var _Actions = __webpack_require__(55);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createQuery = exports.createQuery = function createQuery(props) {
  return _extends(Object.create(null), props);
};

var createLocation = exports.createLocation = function createLocation() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Actions.POP;
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var object = typeof input === 'string' ? (0, _PathUtils.parsePath)(input) : input;

  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(!object.path, 'Location descriptor objects should have a `pathname`, not a `path`.') : void 0;

  var pathname = object.pathname || '/';
  var search = object.search || '';
  var hash = object.hash || '';
  var state = object.state;

  return {
    pathname: pathname,
    search: search,
    hash: hash,
    state: state,
    action: action,
    key: key
  };
};

var isDate = function isDate(object) {
  return Object.prototype.toString.call(object) === '[object Date]';
};

var statesAreEqual = exports.statesAreEqual = function statesAreEqual(a, b) {
  if (a === b) return true;

  var typeofA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var typeofB = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (typeofA !== typeofB) return false;

  !(typeofA !== 'function') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store functions in location state') : (0, _invariant2.default)(false) : void 0;

  // Not the same object, but same type.
  if (typeofA === 'object') {
    !!(isDate(a) && isDate(b)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store Date objects in location state') : (0, _invariant2.default)(false) : void 0;

    if (!Array.isArray(a)) {
      var keysofA = Object.keys(a);
      var keysofB = Object.keys(b);
      return keysofA.length === keysofB.length && keysofA.every(function (key) {
        return statesAreEqual(a[key], b[key]);
      });
    }

    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return statesAreEqual(item, b[index]);
    });
  }

  // All other serializable types (string, number, boolean)
  // should be strict equal.
  return false;
};

var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
  return a.key === b.key &&
  // a.action === b.action && // Different action !== location change.
  a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && statesAreEqual(a.state, b.state);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 38:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports.compilePattern = compilePattern;
exports.matchPattern = matchPattern;
exports.getParamNames = getParamNames;
exports.getParams = getParams;
exports.formatPattern = formatPattern;

var _invariant = __webpack_require__(7);

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _compilePattern(pattern) {
  var regexpSource = '';
  var paramNames = [];
  var tokens = [];

  var match = void 0,
      lastIndex = 0,
      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
  while (match = matcher.exec(pattern)) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index));
      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
    }

    if (match[1]) {
      regexpSource += '([^/]+)';
      paramNames.push(match[1]);
    } else if (match[0] === '**') {
      regexpSource += '(.*)';
      paramNames.push('splat');
    } else if (match[0] === '*') {
      regexpSource += '(.*?)';
      paramNames.push('splat');
    } else if (match[0] === '(') {
      regexpSource += '(?:';
    } else if (match[0] === ')') {
      regexpSource += ')?';
    }

    tokens.push(match[0]);

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length));
    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
  }

  return {
    pattern: pattern,
    regexpSource: regexpSource,
    paramNames: paramNames,
    tokens: tokens
  };
}

var CompiledPatternsCache = Object.create(null);

function compilePattern(pattern) {
  if (!CompiledPatternsCache[pattern]) CompiledPatternsCache[pattern] = _compilePattern(pattern);

  return CompiledPatternsCache[pattern];
}

/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 * - **             Consumes (greedy) all characters up to the next character
 *                  in the pattern, or to the end of the URL if there is none
 *
 *  The function calls callback(error, matched) when finished.
 * The return value is an object with the following properties:
 *
 * - remainingPathname
 * - paramNames
 * - paramValues
 */
function matchPattern(pattern, pathname) {
  // Ensure pattern starts with leading slash for consistency with pathname.
  if (pattern.charAt(0) !== '/') {
    pattern = '/' + pattern;
  }

  var _compilePattern2 = compilePattern(pattern),
      regexpSource = _compilePattern2.regexpSource,
      paramNames = _compilePattern2.paramNames,
      tokens = _compilePattern2.tokens;

  if (pattern.charAt(pattern.length - 1) !== '/') {
    regexpSource += '/?'; // Allow optional path separator at end.
  }

  // Special-case patterns like '*' for catch-all routes.
  if (tokens[tokens.length - 1] === '*') {
    regexpSource += '$';
  }

  var match = pathname.match(new RegExp('^' + regexpSource, 'i'));
  if (match == null) {
    return null;
  }

  var matchedPath = match[0];
  var remainingPathname = pathname.substr(matchedPath.length);

  if (remainingPathname) {
    // Require that the match ends at a path separator, if we didn't match
    // the full path, so any remaining pathname is a new path segment.
    if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
      return null;
    }

    // If there is a remaining pathname, treat the path separator as part of
    // the remaining pathname for properly continuing the match.
    remainingPathname = '/' + remainingPathname;
  }

  return {
    remainingPathname: remainingPathname,
    paramNames: paramNames,
    paramValues: match.slice(1).map(function (v) {
      return v && decodeURIComponent(v);
    })
  };
}

function getParamNames(pattern) {
  return compilePattern(pattern).paramNames;
}

function getParams(pattern, pathname) {
  var match = matchPattern(pattern, pathname);
  if (!match) {
    return null;
  }

  var paramNames = match.paramNames,
      paramValues = match.paramValues;

  var params = {};

  paramNames.forEach(function (paramName, index) {
    params[paramName] = paramValues[index];
  });

  return params;
}

/**
 * Returns a version of the given pattern with params interpolated. Throws
 * if there is a dynamic segment of the pattern for which there is no param.
 */
function formatPattern(pattern, params) {
  params = params || {};

  var _compilePattern3 = compilePattern(pattern),
      tokens = _compilePattern3.tokens;

  var parenCount = 0,
      pathname = '',
      splatIndex = 0,
      parenHistory = [];

  var token = void 0,
      paramName = void 0,
      paramValue = void 0;
  for (var i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i];

    if (token === '*' || token === '**') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue != null) pathname += encodeURI(paramValue);
    } else if (token === '(') {
      parenHistory[parenCount] = '';
      parenCount += 1;
    } else if (token === ')') {
      var parenText = parenHistory.pop();
      parenCount -= 1;

      if (parenCount) parenHistory[parenCount - 1] += parenText;else pathname += parenText;
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1);
      paramValue = params[paramName];

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue == null) {
        if (parenCount) {
          parenHistory[parenCount - 1] = '';

          var curTokenIdx = tokens.indexOf(token);
          var tokensSubset = tokens.slice(curTokenIdx, tokens.length);
          var nextParenIdx = -1;

          for (var _i = 0; _i < tokensSubset.length; _i++) {
            if (tokensSubset[_i] == ')') {
              nextParenIdx = _i;
              break;
            }
          }

          !(nextParenIdx > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Path "%s" is missing end paren at segment "%s"', pattern, tokensSubset.join('')) : (0, _invariant2.default)(false) : void 0;

          // jump to ending paren
          i = curTokenIdx + nextParenIdx - 1;
        }
      } else if (parenCount) parenHistory[parenCount - 1] += encodeURIComponent(paramValue);else pathname += encodeURIComponent(paramValue);
    } else {
      if (parenCount) parenHistory[parenCount - 1] += token;else pathname += token;
    }
  }

  !(parenCount <= 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Path "%s" is missing end paren', pattern) : (0, _invariant2.default)(false) : void 0;

  return pathname.replace(/\/+/g, '/');
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = routerWarning;
exports._resetWarned = _resetWarned;

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var warned = {};

function routerWarning(falseToWarn, message) {
  // Only issue deprecation warnings once.
  if (message.indexOf('deprecated') !== -1) {
    if (warned[message]) {
      return;
    }

    warned[message] = true;
  }

  message = '[react-router] ' + message;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  _warning2.default.apply(undefined, [falseToWarn, message].concat(args));
}

function _resetWarned() {
  warned = {};
}

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SET_AGE_RANGE = exports.SET_AGE_RANGE = 'set_age_range';
var SET_YEARS_ACTIVE_RANGE = exports.SET_YEARS_ACTIVE_RANGE = 'SET_YEARS_ACTIVE_RANGE';
var SEARCH_ARTISTS = exports.SEARCH_ARTISTS = 'SEARCH_ARTISTS';
var FIND_ARTIST = exports.FIND_ARTIST = 'FIND_ARTIST';
var RESET_ARTIST = exports.RESET_ARTIST = 'RESET_ARTIST';
var CREATE_ERROR = exports.CREATE_ERROR = 'CREATE_ERROR';
var CLEAR_ERROR = exports.CLEAR_ERROR = 'CLEAR_ERROR';
var SELECT_ARTIST = exports.SELECT_ARTIST = 'SELECT_ARTIST';
var DESELECT_ARTIST = exports.DESELECT_ARTIST = 'DESELECT_ARTIST';
var RESET_SELECTION = exports.RESET_SELECTION = 'RESET_SELECTION';

/***/ },

/***/ 51:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.routes = exports.route = exports.components = exports.component = exports.history = undefined;
exports.falsy = falsy;

var _react = __webpack_require__(1);

var func = _react.PropTypes.func,
    object = _react.PropTypes.object,
    arrayOf = _react.PropTypes.arrayOf,
    oneOfType = _react.PropTypes.oneOfType,
    element = _react.PropTypes.element,
    shape = _react.PropTypes.shape,
    string = _react.PropTypes.string;
function falsy(props, propName, componentName) {
  if (props[propName]) return new Error('<' + componentName + '> should not have a "' + propName + '" prop');
}

var history = exports.history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
});

var component = exports.component = oneOfType([func, string]);
var components = exports.components = oneOfType([component, object]);
var route = exports.route = oneOfType([object, element]);
var routes = exports.routes = oneOfType([route, arrayOf(route)]);

/***/ },

/***/ 52:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.createMemoryHistory = exports.hashHistory = exports.browserHistory = exports.applyRouterMiddleware = exports.formatPattern = exports.useRouterHistory = exports.match = exports.routerShape = exports.locationShape = exports.RouterContext = exports.createRoutes = exports.Route = exports.Redirect = exports.IndexRoute = exports.IndexRedirect = exports.withRouter = exports.IndexLink = exports.Link = exports.Router = undefined;

var _RouteUtils = __webpack_require__(24);

Object.defineProperty(exports, 'createRoutes', {
  enumerable: true,
  get: function get() {
    return _RouteUtils.createRoutes;
  }
});

var _PropTypes = __webpack_require__(114);

Object.defineProperty(exports, 'locationShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes.locationShape;
  }
});
Object.defineProperty(exports, 'routerShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes.routerShape;
  }
});

var _PatternUtils = __webpack_require__(38);

Object.defineProperty(exports, 'formatPattern', {
  enumerable: true,
  get: function get() {
    return _PatternUtils.formatPattern;
  }
});

var _Router2 = __webpack_require__(1423);

var _Router3 = _interopRequireDefault(_Router2);

var _Link2 = __webpack_require__(184);

var _Link3 = _interopRequireDefault(_Link2);

var _IndexLink2 = __webpack_require__(1419);

var _IndexLink3 = _interopRequireDefault(_IndexLink2);

var _withRouter2 = __webpack_require__(1434);

var _withRouter3 = _interopRequireDefault(_withRouter2);

var _IndexRedirect2 = __webpack_require__(1420);

var _IndexRedirect3 = _interopRequireDefault(_IndexRedirect2);

var _IndexRoute2 = __webpack_require__(1421);

var _IndexRoute3 = _interopRequireDefault(_IndexRoute2);

var _Redirect2 = __webpack_require__(186);

var _Redirect3 = _interopRequireDefault(_Redirect2);

var _Route2 = __webpack_require__(1422);

var _Route3 = _interopRequireDefault(_Route2);

var _RouterContext2 = __webpack_require__(115);

var _RouterContext3 = _interopRequireDefault(_RouterContext2);

var _match2 = __webpack_require__(1432);

var _match3 = _interopRequireDefault(_match2);

var _useRouterHistory2 = __webpack_require__(191);

var _useRouterHistory3 = _interopRequireDefault(_useRouterHistory2);

var _applyRouterMiddleware2 = __webpack_require__(1425);

var _applyRouterMiddleware3 = _interopRequireDefault(_applyRouterMiddleware2);

var _browserHistory2 = __webpack_require__(1426);

var _browserHistory3 = _interopRequireDefault(_browserHistory2);

var _hashHistory2 = __webpack_require__(1430);

var _hashHistory3 = _interopRequireDefault(_hashHistory2);

var _createMemoryHistory2 = __webpack_require__(188);

var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Router = _Router3.default; /* components */

exports.Link = _Link3.default;
exports.IndexLink = _IndexLink3.default;
exports.withRouter = _withRouter3.default;

/* components (configuration) */

exports.IndexRedirect = _IndexRedirect3.default;
exports.IndexRoute = _IndexRoute3.default;
exports.Redirect = _Redirect3.default;
exports.Route = _Route3.default;

/* utils */

exports.RouterContext = _RouterContext3.default;
exports.match = _match3.default;
exports.useRouterHistory = _useRouterHistory3.default;
exports.applyRouterMiddleware = _applyRouterMiddleware3.default;

/* histories */

exports.browserHistory = _browserHistory3.default;
exports.hashHistory = _hashHistory3.default;
exports.createMemoryHistory = _createMemoryHistory3.default;

/***/ },

/***/ 55:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * Indicates that navigation was caused by a call to history.push.
 */
var PUSH = exports.PUSH = 'PUSH';

/**
 * Indicates that navigation was caused by a call to history.replace.
 */
var REPLACE = exports.REPLACE = 'REPLACE';

/**
 * Indicates that navigation was caused by some other action such
 * as using a browser's back/forward buttons and/or manually manipulating
 * the URL in a browser's location bar. This is the default.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 * for more information.
 */
var POP = exports.POP = 'POP';

/***/ },

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
};

var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
};

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
var supportsHistory = exports.supportsHistory = function supportsHistory() {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;

  return window.history && 'pushState' in window.history;
};

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
var supportsPopstateOnHashchange = exports.supportsPopstateOnHashchange = function supportsPopstateOnHashchange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
var isExtraneousPopstateEvent = exports.isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

/***/ },

/***/ 75:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
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


/***/ },

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.go = exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getUserConfirmation = exports.getCurrentLocation = undefined;

var _LocationUtils = __webpack_require__(34);

var _DOMUtils = __webpack_require__(56);

var _DOMStateStorage = __webpack_require__(131);

var _PathUtils = __webpack_require__(21);

var _ExecutionEnvironment = __webpack_require__(78);

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

var needsHashchangeListener = _ExecutionEnvironment.canUseDOM && !(0, _DOMUtils.supportsPopstateOnHashchange)();

var _createLocation = function _createLocation(historyState) {
  var key = historyState && historyState.key;

  return (0, _LocationUtils.createLocation)({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: key ? (0, _DOMStateStorage.readState)(key) : undefined
  }, undefined, key);
};

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
  var historyState = void 0;
  try {
    historyState = window.history.state || {};
  } catch (error) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    historyState = {};
  }

  return _createLocation(historyState);
};

var getUserConfirmation = exports.getUserConfirmation = function getUserConfirmation(message, callback) {
  return callback(window.confirm(message));
}; // eslint-disable-line no-alert

var startListener = exports.startListener = function startListener(listener) {
  var handlePopState = function handlePopState(event) {
    if ((0, _DOMUtils.isExtraneousPopstateEvent)(event)) // Ignore extraneous popstate events in WebKit
      return;
    listener(_createLocation(event.state));
  };

  (0, _DOMUtils.addEventListener)(window, PopStateEvent, handlePopState);

  var handleUnpoppedHashChange = function handleUnpoppedHashChange() {
    return listener(getCurrentLocation());
  };

  if (needsHashchangeListener) {
    (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
  }

  return function () {
    (0, _DOMUtils.removeEventListener)(window, PopStateEvent, handlePopState);

    if (needsHashchangeListener) {
      (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
    }
  };
};

var updateLocation = function updateLocation(location, updateState) {
  var state = location.state,
      key = location.key;


  if (state !== undefined) (0, _DOMStateStorage.saveState)(key, state);

  updateState({ key: key }, (0, _PathUtils.createPath)(location));
};

var pushLocation = exports.pushLocation = function pushLocation(location) {
  return updateLocation(location, function (state, path) {
    return window.history.pushState(state, null, path);
  });
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
  return updateLocation(location, function (state, path) {
    return window.history.replaceState(state, null, path);
  });
};

var go = exports.go = function go(n) {
  if (n) window.history.go(n);
};

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/***/ },

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _AsyncUtils = __webpack_require__(1218);

var _PathUtils = __webpack_require__(21);

var _runTransitionHook = __webpack_require__(80);

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _Actions = __webpack_require__(55);

var _LocationUtils = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createHistory = function createHistory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var getCurrentLocation = options.getCurrentLocation,
      getUserConfirmation = options.getUserConfirmation,
      pushLocation = options.pushLocation,
      replaceLocation = options.replaceLocation,
      go = options.go,
      keyLength = options.keyLength;


  var currentLocation = void 0;
  var pendingLocation = void 0;
  var beforeListeners = [];
  var listeners = [];
  var allKeys = [];

  var getCurrentIndex = function getCurrentIndex() {
    if (pendingLocation && pendingLocation.action === _Actions.POP) return allKeys.indexOf(pendingLocation.key);

    if (currentLocation) return allKeys.indexOf(currentLocation.key);

    return -1;
  };

  var updateLocation = function updateLocation(nextLocation) {
    var currentIndex = getCurrentIndex();

    currentLocation = nextLocation;

    if (currentLocation.action === _Actions.PUSH) {
      allKeys = [].concat(allKeys.slice(0, currentIndex + 1), [currentLocation.key]);
    } else if (currentLocation.action === _Actions.REPLACE) {
      allKeys[currentIndex] = currentLocation.key;
    }

    listeners.forEach(function (listener) {
      return listener(currentLocation);
    });
  };

  var listenBefore = function listenBefore(listener) {
    beforeListeners.push(listener);

    return function () {
      return beforeListeners = beforeListeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var listen = function listen(listener) {
    listeners.push(listener);

    return function () {
      return listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var confirmTransitionTo = function confirmTransitionTo(location, callback) {
    (0, _AsyncUtils.loopAsync)(beforeListeners.length, function (index, next, done) {
      (0, _runTransitionHook2.default)(beforeListeners[index], location, function (result) {
        return result != null ? done(result) : next();
      });
    }, function (message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function (ok) {
          return callback(ok !== false);
        });
      } else {
        callback(message !== false);
      }
    });
  };

  var transitionTo = function transitionTo(nextLocation) {
    if (currentLocation && (0, _LocationUtils.locationsAreEqual)(currentLocation, nextLocation) || pendingLocation && (0, _LocationUtils.locationsAreEqual)(pendingLocation, nextLocation)) return; // Nothing to do

    pendingLocation = nextLocation;

    confirmTransitionTo(nextLocation, function (ok) {
      if (pendingLocation !== nextLocation) return; // Transition was interrupted during confirmation

      pendingLocation = null;

      if (ok) {
        // Treat PUSH to same path like REPLACE to be consistent with browsers
        if (nextLocation.action === _Actions.PUSH) {
          var prevPath = (0, _PathUtils.createPath)(currentLocation);
          var nextPath = (0, _PathUtils.createPath)(nextLocation);

          if (nextPath === prevPath && (0, _LocationUtils.statesAreEqual)(currentLocation.state, nextLocation.state)) nextLocation.action = _Actions.REPLACE;
        }

        if (nextLocation.action === _Actions.POP) {
          updateLocation(nextLocation);
        } else if (nextLocation.action === _Actions.PUSH) {
          if (pushLocation(nextLocation) !== false) updateLocation(nextLocation);
        } else if (nextLocation.action === _Actions.REPLACE) {
          if (replaceLocation(nextLocation) !== false) updateLocation(nextLocation);
        }
      } else if (currentLocation && nextLocation.action === _Actions.POP) {
        var prevIndex = allKeys.indexOf(currentLocation.key);
        var nextIndex = allKeys.indexOf(nextLocation.key);

        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL
      }
    });
  };

  var push = function push(input) {
    return transitionTo(createLocation(input, _Actions.PUSH));
  };

  var replace = function replace(input) {
    return transitionTo(createLocation(input, _Actions.REPLACE));
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var createKey = function createKey() {
    return Math.random().toString(36).substr(2, keyLength || 6);
  };

  var createHref = function createHref(location) {
    return (0, _PathUtils.createPath)(location);
  };

  var createLocation = function createLocation(location, action) {
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : createKey();
    return (0, _LocationUtils.createLocation)(location, action, key);
  };

  return {
    getCurrentLocation: getCurrentLocation,
    listenBefore: listenBefore,
    listen: listen,
    transitionTo: transitionTo,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    createKey: createKey,
    createPath: _PathUtils.createPath,
    createHref: createHref,
    createLocation: createLocation
  };
};

exports.default = createHistory;

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _warning = __webpack_require__(26);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runTransitionHook = function runTransitionHook(hook, location, callback) {
  var result = hook(location, callback);

  if (hook.length < 2) {
    // Assume the hook runs synchronously and automatically
    // call the callback with the return value.
    callback(result);
  } else {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(result === undefined, 'You should not "return" in a transition hook with a callback argument; ' + 'call the callback instead') : void 0;
  }
};

exports.default = runTransitionHook;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }

},[1491]);