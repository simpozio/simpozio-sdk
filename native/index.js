import Simpozio from '../src/simpozio/constructor';
import HeartbeatNative from './heartbeat';

export default class SimpozioNative extends Simpozio {
    constructor(configObj) {
        super(configObj, HeartbeatNative);
    }
}
