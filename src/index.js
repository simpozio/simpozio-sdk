// @flow

import Simpozio from './simpozio/constructor.js';
import Heartbeat from './heartbeat';
import type {SmpzTerminalModelType} from './_terminal/reducer';
import storage from 'redux-persist/lib/storage';

export default class SimpozioWeb extends Simpozio {
    constructor(configObj: SmpzTerminalModelType) {
        //$FlowFixMe
        super({config: configObj, heartbeat: Heartbeat, storage});
    }
}
