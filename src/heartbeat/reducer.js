// @flow

import _ from 'lodash';
import moment from 'moment';

import {HEARTBEAT_DEFAULT_NEXT, HEARTBEAT_DEFAULT_STATE, HEARTBEAT_UPDATE} from './const';
import {TERMINAL_ONLINE_UPDATE} from '../_terminal/const';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';

export type SmpzHeartbeatModelType = {
    touchpoint?: string,
    state?: string,
    screen?: string,
    connection?: string,
    bandwidth?: string,
    payload?: string,
    next?: string | number,
    lastOffline?: number
};

const initialState: SmpzHeartbeatModelType = {
    next: HEARTBEAT_DEFAULT_NEXT,
    screen: '',
    state: HEARTBEAT_DEFAULT_STATE,
    connection: '',
    bandwidth: '',
    payload: '',
    lastOffline: moment().valueOf()
};

export default (
    heartbeat: SmpzHeartbeatModelType = initialState,
    action: SmpzReduxActionType
): SmpzHeartbeatModelType => {
    switch (action.type) {
        case HEARTBEAT_UPDATE: {
            return _.assign({}, heartbeat, _.get(action, 'payload.data'));
        }
        case TERMINAL_ONLINE_UPDATE: {
            const status = _.get(action, 'payload.status');
            return _.assign({}, heartbeat, {
                lastOffline: status === false ? moment().toISOString() : heartbeat.lastOffline
            });
        }
        case 'persist/REHYDRATE':
        default: {
            return heartbeat;
        }
    }
};
