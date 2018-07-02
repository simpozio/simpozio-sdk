// @flow
import {Store} from 'redux';
import _ from 'lodash';

export type SmpzLoggerConstructorParamsType = {store: Store, name: string};

export default class Logger {
    store: Store;
    name: string;

    constructor({store, name}: SmpzLoggerConstructorParamsType) {
        this.store = store;
        this.name = name;
    }

    log(...args: Array<mixed>) {
        const {debug} = _.get(this.store.getState(), 'terminal', {});
        if (debug) {
            console.log(`Simpozio SDK [${this.name}] ->`, ...arguments);
        }
    }
    error(...args: Array<mixed>) {
        const {debug} = _.get(this.store.getState(), 'terminal', {});
        if (debug) {
            console.error(`Simpozio SDK [${this.name}] error ->`, ...arguments);
        }
    }
}
