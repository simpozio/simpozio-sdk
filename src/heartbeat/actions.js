// @flow

import {HEARTBEAT_UPDATE} from './const';
import type {SmpzReduxActionType} from '../simpozio/common.types';
import type {SmpzHeartbeatModelType} from './reducer';

export const heartbeatUpdateAction = (data?: SmpzHeartbeatModelType): SmpzReduxActionType => ({
    type: HEARTBEAT_UPDATE,
    payload: {
        data
    }
});
