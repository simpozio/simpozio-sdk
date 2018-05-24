'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger(_ref) {
        var store = _ref.store,
            name = _ref.name;

        _classCallCheck(this, Logger);

        this.store = store;
        this.name = name;
    }

    _createClass(Logger, [{
        key: 'log',
        value: function log() {
            var _$get = _lodash2.default.get(this.store.getState(), 'terminal', {}),
                debug = _$get.debug;

            if (debug) {
                var _console;

                (_console = console).log.apply(_console, ['Simpozio SDK [' + this.name + '] ->'].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'error',
        value: function error() {
            var _$get2 = _lodash2.default.get(this.store.getState(), 'terminal', {}),
                debug = _$get2.debug;

            if (debug) {
                var _console2;

                (_console2 = console).error.apply(_console2, ['Simpozio SDK [' + this.name + '] error ->'].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }]);

    return Logger;
}();

exports.default = Logger;