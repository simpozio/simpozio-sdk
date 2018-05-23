'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Collection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _common = require('./common.consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = exports.Collection = function () {
    function Collection(_ref) {
        var store = _ref.store,
            name = _ref.name,
            actions = _ref.actions;

        _classCallCheck(this, Collection);

        this.name = name;
        this.store = store;
        this.actions = actions;
        this.listeners = {};
    }

    _createClass(Collection, [{
        key: 'add',
        value: function add(item) {
            var action = _lodash2.default.get(this.actions, _common.COMMON_METHOD_ADD, {
                type: this.name + '_' + _common.COMMON_METHOD_ADD,
                payload: {
                    item: item
                }
            });
            this.store.dispatch(_lodash2.default.isFunction(action) ? action(item) : action);
        }
    }, {
        key: 'remove',
        value: function remove(item) {
            var action = _lodash2.default.get(this.actions, _common.COMMON_METHOD_REMOVE, {
                type: this.name + '_' + _common.COMMON_METHOD_REMOVE,
                payload: {
                    item: item
                }
            });
            this.store.dispatch(_lodash2.default.isFunction(action) ? action(item) : action);
        }
    }, {
        key: 'set',
        value: function set(data) {
            var action = _lodash2.default.get(this.actions, _common.COMMON_METHOD_SET, {
                type: this.name + '_' + _common.COMMON_METHOD_SET,
                payload: {
                    data: data
                }
            });
            this.store.dispatch(_lodash2.default.isFunction(action) ? action(data) : action);
        }
    }, {
        key: 'reset',
        value: function reset(data) {
            var action = _lodash2.default.get(this.actions, _common.COMMON_METHOD_RESET, {
                type: this.name + '_' + _common.COMMON_METHOD_RESET,
                payload: {
                    data: data
                }
            });
            this.store.dispatch(_lodash2.default.isFunction(action) ? action(data) : action);
        }
    }, {
        key: 'onUpdate',
        value: function onUpdate(fn) {
            this.listeners.update.push(fn);
        }
    }]);

    return Collection;
}();