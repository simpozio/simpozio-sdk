// @flow

import SimpozioClass from '../src/simpozio/constructor';
import HeartbeatNative from './heartbeat';
import type {SmpzTerminalModelType} from '../src/_terminal/reducer';

export default class SimpozioNative extends SimpozioClass {
    constructor(configObj: SmpzTerminalModelType) {
        super(configObj, HeartbeatNative);
    }
}
