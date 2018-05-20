import {HEARTBEAT_UPDATE} from './const';

export const heartbeatUpdate = data => ({
    type: HEARTBEAT_UPDATE,
    payload: {
        data
    }
});
