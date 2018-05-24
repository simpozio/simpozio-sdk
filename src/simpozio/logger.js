import _ from 'lodash';

export default class Logger {
    constructor({store, name}) {
        this.store = store;
        this.name = name;
    }

    log() {
        const {debug} = _.get(this.store.getState(), 'terminal', {});
        if (debug) {
            console.log(`Simpozio SDK [${this.name}] ->`, ...arguments);
        }
    }
    error() {
        const {debug} = _.get(this.store.getState(), 'terminal', {});
        if (debug) {
            console.error(`Simpozio SDK [${this.name}] error ->`, ...arguments);
        }
    }
}
