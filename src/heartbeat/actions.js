import {HEARTBEAT_UPDATE} from './const';

export const heartbeatUpdateAction = data => ({
    type: HEARTBEAT_UPDATE,
    payload: {
        data
    }
});
