import Simpozio from "../index";
import HeartbeatNative from "./heartbeat";

export default class SimpozioNative extends Simpozio {
    constructor(configObj) {
        super(configObj, HeartbeatNative);
    }
}
