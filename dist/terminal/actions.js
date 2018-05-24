'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.terminalOnlineAction = exports.terminalUpdateAction = undefined;

var _const = require('./const');

var terminalUpdateAction = exports.terminalUpdateAction = function terminalUpdateAction(data) {
    return {
        type: _const.TERMINAL_UPDATE,
        payload: {
            data: data
        }
    };
};

var terminalOnlineAction = exports.terminalOnlineAction = function terminalOnlineAction(status) {
    return {
        type: _const.TERMINAL_ONLINE_UPDATE,
        payload: {
            status: status
        }
    };
};