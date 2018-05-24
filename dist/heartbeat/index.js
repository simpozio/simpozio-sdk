'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _actions = require('./actions');

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _actions2 = require('../terminal/actions');

var _const = require('./const');

var _const2 = require('../api/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var META = '_simpozioListenerId';
var listeners = {};
var eventEmitter = new _events2.default();

var Heartbeat = function () {
    function Heartbeat(_ref) {
        var initialData = _ref.initialData,
            store = _ref.store;

        _classCallCheck(this, Heartbeat);

        this._isStarted = false;

        this.store = store;
        this.cancelToken = null;
        this.checkConnectionTimeout = 0;
        this.api = new _api2.default({ store: store });
        this.currentData = {};
        this.requestTime = 0;

        this.store.subscribe(this._handleStoreChange.bind(this));
        this.store.dispatch((0, _actions.heartbeatUpdateAction)(initialData));
    }

    _createClass(Heartbeat, [{
        key: '_getKey',
        value: function _getKey(listener) {
            if (!listener) {
                return;
            }

            if (!listener.hasOwnProperty(META)) {
                if (!Object.isExtensible(listener)) {
                    return 'F';
                }

                Object.defineProperty(listener, META, {
                    value: _lodash2.default.uniqueId('SIMPOZIO_LISTENER_')
                });
            }

            return listener[META];
        }
    }, {
        key: 'addListener',
        value: function addListener(event, cb) {
            var key = this._getKey(cb);

            eventEmitter.addListener(event, cb);
            listeners[key] = { event: event, cb: cb };

            return key;
        }
    }, {
        key: '_getMetadata',
        value: function _getMetadata() {
            var _$get = _lodash2.default.get(this.store.getState(), 'terminal', {}),
                touchpoint = _$get.touchpoint;

            var _$get2 = _lodash2.default.get(this.store.getState(), 'heartbeat', {}),
                state = _$get2.state,
                screen = _$get2.screen,
                connection = _$get2.connection,
                bandwidth = _$get2.bandwidth,
                payload = _$get2.payload,
                next = _$get2.next;

            return {
                touchpoint: touchpoint,
                state: state,
                screen: screen,
                connection: connection,
                bandwidth: bandwidth,
                payload: payload,
                next: next
            };
        }
    }, {
        key: '_handleStoreChange',
        value: function _handleStoreChange() {
            var _$get3 = _lodash2.default.get(this.store.getState(), 'terminal', {}),
                authorization = _$get3.authorization;

            var newData = _lodash2.default.get(this.store.getState(), 'heartbeat', {});
            newData.authorization = authorization;

            if (_lodash2.default.isEqual(this.currentData, newData)) {
                return;
            }

            if (newData === false || _lodash2.default.get(newData, 'next') === 0) {
                this._stopHeartbeat();
            } else if (this._isStarted === false && authorization) {
                this._startHeartbeat();
            }

            this.currentData = _lodash2.default.clone(newData);
        }
    }, {
        key: '_startHeartbeat',
        value: function _startHeartbeat() {
            var _this = this;

            if (this._isStarted) {
                return;
            }

            this._isStarted = true;

            var helper = function helper() {
                _this.checkConnectionTimeout = 0;

                var _$get4 = _lodash2.default.get(_this.store.getState(), 'terminal', {}),
                    authorization = _$get4.authorization,
                    online = _$get4.online,
                    debug = _$get4.debug;

                var _$get5 = _lodash2.default.get(_this.store.getState(), 'heartbeat', {}),
                    next = _$get5.next,
                    lastOffline = _$get5.lastOffline;

                if (!authorization) {
                    _this._isStarted = false;
                    return;
                }

                var handleReject = function handleReject(error) {
                    _this.requestTime = _this.requestTime || 1000;

                    _this.cancelToken = null;

                    if (debug) {
                        console.log('SIMPOZIO SDK HEARTBEAT FAILED', error);
                    }

                    if (online) {
                        _this.store.dispatch((0, _actions2.terminalOnlineAction)(false));
                        eventEmitter.emit(_const.HEARTBEAT_RN_EVENT_FAIL, error);
                    }

                    if (!_this.checkConnectionTimeout) {
                        _this.checkConnectionTimeout = setTimeout(function () {
                            helper();
                        }, next - _this.requestTime * 2);
                    }
                };

                var handleResponse = function handleResponse() {
                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                        result = _ref2.result,
                        requestTime = _ref2.requestTime;

                    _this.requestTime = requestTime;
                    _this.cancelToken = null;

                    if (!online) {
                        eventEmitter.emit(_const.HEARTBEAT_RN_EVENT_RESUME, {
                            duration: (0, _moment2.default)().valueOf() - lastOffline
                        });

                        _this.store.dispatch((0, _actions2.terminalOnlineAction)(true));
                    }
                    if (!_this.checkConnectionTimeout) {
                        _this.checkConnectionTimeout = setTimeout(function () {
                            helper();
                        }, next - _this.requestTime * 2);
                    }
                    return Promise.resolve(result);
                };

                var data = _lodash2.default.assign({}, _this._getMetadata(), {
                    timestamp: (0, _moment2.default)().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
                });

                _this.cancelToken = _this.api.makeCancelToken().token;

                _this.api.post({
                    data: data,
                    timeout: next * 0.5,
                    url: _const2.API_SIGNALS + _const2.API_HEARTBEAT,
                    cancelToken: _this.cancelToken
                }).then(handleResponse).catch(handleReject);
            };

            helper();
        }
    }, {
        key: '_stopHeartbeat',
        value: function _stopHeartbeat() {
            if (this.checkConnectionTimeout) {
                clearTimeout(this.checkConnectionTimeout);
                this.checkConnectionTimeout = 0;
            }

            if (this.cancelToken) {
                this.cancelToken.cancel();
            }

            this._isStarted = false;
        }
    }, {
        key: 'update',
        value: function update(data) {
            this.store.dispatch((0, _actions.heartbeatUpdateAction)(data));
        }
    }, {
        key: 'onFail',
        value: function onFail(cb) {
            return this.addListener(_const.HEARTBEAT_RN_EVENT_FAIL, cb);
        }
    }, {
        key: 'onResume',
        value: function onResume(cb) {
            return this.addListener(_const.HEARTBEAT_RN_EVENT_RESUME, cb);
        }
    }, {
        key: 'onError',
        value: function onError(cb) {
            return this.addListener(_const.HEARTBEAT_RN_EVENT_EXCEPTION, cb);
        }
    }, {
        key: 'removeSubscription',
        value: function removeSubscription(key) {
            if (!listeners[key]) {
                return;
            }

            var _listeners$key = listeners[key],
                event = _listeners$key.event,
                cd = _listeners$key.cd;

            eventEmitter.removeListener(event, cd);

            listeners[key] = null;
        }
    }, {
        key: 'isStarted',
        value: function isStarted() {
            return this._isStarted;
        }
    }]);

    return Heartbeat;
}();

exports.default = Heartbeat;