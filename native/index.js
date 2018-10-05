// @flow

import SimpozioClass from '../src/simpozio/constructor';
import HeartbeatNative from './heartbeat';
import PingNative from './ping';
import type {SmpzTerminalModelType} from '../src/_terminal/reducer';
import {AsyncStorage} from 'react-native';

export default class SimpozioNative extends SimpozioClass {
    constructor(configObj: SmpzTerminalModelType) {
        super({config: configObj, heartbeat: HeartbeatNative, storage: AsyncStorage, ping: PingNative});
    }
}
