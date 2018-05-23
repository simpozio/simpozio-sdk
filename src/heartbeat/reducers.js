import _ from 'lodash';
import {HEARTBEAT_UPDATE} from './const';
import {TERMINAL_ONLINE_UPDATE} from '../terminal/const';
import moment from 'moment';

const initialState = {
    next: 5000,
    screen: '',
    state: 'active',
    connection: '',
    bandwidth: '',
    payload: '',
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
