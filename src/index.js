import Simpozio from './simpozio/constructor.js';
import Heartbeat from './heartbeat';

export default class SimpozioWeb extends Simpozio {
    constructor(configObj) {
        super(configObj, Heartbeat);
    }
}
