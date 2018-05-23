import {TERMINAL_ONLINE_UPDATE, TERMINAL_UPDATE} from './const';

export const terminalUpdateAction = data => ({
    type: TERMINAL_UPDATE,
    payload: {
        data
    }
});

export const terminalOnlineAction = status => ({
    type: TERMINAL_ONLINE_UPDATE ,
    payload: {
        status
    }
});
