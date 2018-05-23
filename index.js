import Simpozio from "./src/simpozio";
import Heartbeat from "./src/heartbeat";

export default class SimpozioWeb extends Simpozio {
    constructor(configObj) {
        super(configObj, Heartbeat);
    }
}
