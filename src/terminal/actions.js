import {TERMINAL_UPDATE} from './const';

export const terminalUpdateAction = data => ({
    type: TERMINAL_UPDATE,
    payload: {
        data
    }
});
