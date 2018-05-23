'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constructor = require('./simpozio/constructor');

var _constructor2 = _interopRequireDefault(_constructor);

var _heartbeat = require('./heartbeat');

var _heartbeat2 = _interopRequireDefault(_heartbeat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpozioWeb = function (_Simpozio) {
    _inherits(SimpozioWeb, _Simpozio);

    function SimpozioWeb(configObj) {
        _classCallCheck(this, SimpozioWeb);

        return _possibleConstructorReturn(this, (SimpozioWeb.__proto__ || Object.getPrototypeOf(SimpozioWeb)).call(this, configObj, _heartbeat2.default));
    }

    return SimpozioWeb;
}(_constructor2.default);

exports.default = SimpozioWeb;