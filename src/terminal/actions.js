// @flow

import {TERMINAL_ONLINE_UPDATE, TERMINAL_UPDATE} from './const';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';
import type {SmpzTerminalModelType} from './reducer';

export const terminalUpdateAction = (data?: SmpzTerminalModelType): SmpzReduxActionType => ({
    type: TERMINAL_UPDATE,
    payload: {
        data
    }
});

export const terminalOnlineAction = (status: boolean): SmpzReduxActionType => ({
    type: TERMINAL_ONLINE_UPDATE,
    payload: {
        status
    }
});
