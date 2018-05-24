'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.heartbeatUpdateAction = undefined;

var _const = require('./const');

var heartbeatUpdateAction = exports.heartbeatUpdateAction = function heartbeatUpdateAction(data) {
    return {
        type: _const.HEARTBEAT_UPDATE,
        payload: {
            data: data
        }
    };
};