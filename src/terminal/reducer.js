// @flow

import _ from 'lodash';
import ObjectID from 'bson-objectid';

import {
    TERMINAL_UPDATE,
    TERMINAL_ACCESS_TOKEN_UPDATE,
    TERMINAL_ID_UPDATE,
    API_DEFAULT_URL,
    TERMINAL_ONLINE_UPDATE
} from './const';
import type {SmpzReduxActionType} from '../simpozio/common.types';

export type SmpzTerminalModelType = {
    authorization?: string,
    touchpoint?: string,
    userAgent?: string,
    acceptLanguage?: string,
    locale?: string,
    host?: string,
    xHttpMethodOverride?: string,
    baseUrl?: string,
    terminalId: string,
    debug?: boolean,
    online?: boolean
};

const initialState: SmpzTerminalModelType = {
    authorization: '',
    touchpoint: '',
    userAgent: '',
    acceptLanguage: 'en_US',
    locale: 'en_US',
    host: '',
    xHttpMethodOverride: '',
    baseUrl: API_DEFAULT_URL,
    terminalId: ObjectID.generate(),
    debug: false,
    online: true
};

export default (terminal: SmpzTerminalModelType = initialState, action: SmpzReduxActionType): SmpzTerminalModelType => {
    switch (action.type) {
        case TERMINAL_ACCESS_TOKEN_UPDATE: {
            return _.assign({}, terminal, {
                accessToken: _.get(action, 'payload.authorization'),
                terminalId: _.get(action, 'payload.terminalId')
            });
        }
        case TERMINAL_ID_UPDATE: {
            return _.assign({}, terminal, {
                terminalId: _.get(action, 'payload.terminalId')
            });
        }
        case TERMINAL_ONLINE_UPDATE: {
            return _.assign({}, terminal, {
                online: _.get(action, 'payload.status')
            });
        }
        case TERMINAL_UPDATE: {
            const newData = _.get(action, 'payload.data');
            return _.assign({}, terminal, _.omit(newData, 'heartbeat'));
        }
        default: {
            return terminal;
        }
    }
};
