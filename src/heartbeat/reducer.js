import _ from 'lodash';
import {HEARTBEAT_DEFAULT_NEXT, HEARTBEAT_DEFAULT_STATE, HEARTBEAT_UPDATE} from './const';
import {TERMINAL_ONLINE_UPDATE} from '../terminal/const';
import moment from 'moment';

const initialState = {
    next: HEARTBEAT_DEFAULT_NEXT,
    screen: null,
    state: HEARTBEAT_DEFAULT_STATE,
    connection: null,
    bandwidth: null,
    payload: null,
    lastOffline: moment().valueOf()
};

export default (heartbeat = initialState, action) => {
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
        default: {
            return heartbeat;
        }
    }
};
