import _ from 'lodash';

import {HEARTBEAT_UPDATE} from './const';

const initialState = {
    next: 0,
    screen: '',
    state: 'active',
    connection: '',
    bandwidth: '',
    payload: ''
};

export default (heartbeat = initialState, action) => {
    switch (action.type) {
        case HEARTBEAT_UPDATE: {
            return _.assign({}, heartbeat, _.get(action, 'payload.data'));
        }
        default: {
            return heartbeat;
        }
    }
};
