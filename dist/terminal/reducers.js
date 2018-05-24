'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bsonObjectid = require('bson-objectid');

var _bsonObjectid2 = _interopRequireDefault(_bsonObjectid);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
    authorization: '',
    touchpoint: '',
    userAgent: '',
    acceptLanguage: 'en_US',
    locale: 'en_US',
    host: '',
    xHttpMethodOverride: '',
    baseUrl: _const.API_DEFAULT_URL,
    terminalId: _bsonObjectid2.default.generate(),
    debug: false,
    online: true
};

exports.default = function () {
    var terminal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case _const.TERMINAL_ACCESS_TOKEN_UPDATE:
            {
                return _lodash2.default.assign({}, terminal, {
                    accessToken: _lodash2.default.get(action, 'payload.authorization'),
                    terminalId: _lodash2.default.get(action, 'payload.terminalId')
                });
            }
        case _const.TERMINAL_ID_UPDATE:
            {
                return _lodash2.default.assign({}, terminal, {
                    terminalId: _lodash2.default.get(action, 'payload.terminalId')
                });
            }
        case _const.TERMINAL_ONLINE_UPDATE:
            {
                return _lodash2.default.assign({}, terminal, {
                    online: _lodash2.default.get(action, 'payload.status')
                });
            }
        case _const.TERMINAL_UPDATE:
            {
                var newData = _lodash2.default.get(action, 'payload.data');
                return _lodash2.default.assign({}, terminal, _lodash2.default.omit(newData, 'heartbeat'));
            }
        default:
            {
                return terminal;
            }
    }
};