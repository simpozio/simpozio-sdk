import {TERMINAL_UPDATE} from './const';

export const terminalUpdate = data => ({
    type: TERMINAL_UPDATE,
    payload: {
        data
    }
});
