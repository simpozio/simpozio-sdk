'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _const = require('./const');

var _const2 = require('../terminal/const');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
    next: 5000,
    screen: '',
    state: 'active',
    connection: '',
    bandwidth: '',
    payload: '',
    lastOffline: (0, _moment2.default)().valueOf()
};

exports.default = function () {
    var heartbeat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case _const.HEARTBEAT_UPDATE:
            {
                return _lodash2.default.assign({}, heartbeat, _lodash2.default.get(action, 'payload.data'));
            }
        case _const2.TERMINAL_ONLINE_UPDATE:
            {
                var status = _lodash2.default.get(action, 'payload.status');
                return _lodash2.default.assign({}, heartbeat, {
                    lastOffline: status === false ? (0, _moment2.default)().toISOString() : heartbeat.lastOffline
                });
            }
        default:
            {
                return heartbeat;
            }
    }
};