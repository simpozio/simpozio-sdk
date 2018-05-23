'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reducers = require('./terminal/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _reducers3 = require('./heartbeat/reducers');

var _reducers4 = _interopRequireDefault(_reducers3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
    terminal: _reducers2.default,
    heartbeat: _reducers4.default
});