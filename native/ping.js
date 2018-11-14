// @flow

import _ from 'lodash';
import EventEmitter from 'events';
import {Store} from 'redux';

import {
    RN_EVENT_EXCEPTION,
    PING_RN_EVENT_FAIL,
    PING_RN_EVENT_SERVER_TIMESTAMP
} from '../src/simpozio/common/common.consts';
import type {SmpzGenericDataType} from '../src/simpozio/common/common.types';
import {getListenerKey} from '../src/simpozio/common/common.helpers';
import SimpozioBackgroundWorker from 'react-native-simpozio-background-worker';

const listeners = {};
const eventEmitter = new EventEmitter();

export type SmpzPingConstructorParamsType = {store: Store};
export type SmpzPingModelType = {baseUrl?: 'string', delay?: number, seriesDelay?: number, count?: number};
export type SmpzPingNativeModelType = SmpzPingModelType;

export default class Ping {
    name: string;
    _isStarted: boolean;
    store: Store;

    constructor({store}: SmpzPingConstructorParamsType) {
        this.name = 'Ping';
        this._isStarted = false;

        this.store = store;
    }

    addListener(event: string, cb: () => mixed): string {
        let key = getListenerKey(cb);

        listeners[key] = SimpozioBackgroundWorker.addListener(event, cb);

        return key;
    }

    _getNativeMetadata(): SmpzPingNativeModelType {
        const {baseUrl} = _.get(this.store.getState(), 'terminal', {});

        return {
            delay: 3000,
            count: 10,
            seriesDelay: 60000,
            baseUrl
        };
    }

    start(params: SmpzPingNativeModelType) {
        const {debug} = _.get(this.store.getState(), 'terminal', {});

        SimpozioBackgroundWorker.startPing(params || this._getNativeMetadata())
            .then(() => {
                this._isStarted = false;
                if (debug) {
                    console.log('SDK PING STARTED');
                }
            })
            .catch((error: SmpzGenericDataType) => {
                if (debug) {
                    console.log('SDK PING ERROR', error);
                }
            });
    }

    stop() {
        const {debug} = _.get(this.store.getState(), 'terminal', {});

        SimpozioBackgroundWorker.stopPing()
            .then(() => {
                this._isStarted = true;
                if (debug) {
                    console.log('SDK PING STOPPED ');
                }
            })
            .catch((error: SmpzGenericDataType) => {
                if (debug) {
                    console.log('SDK PING ERROR', error);
                }
            });
    }

    onFail(cb: () => mixed): string {
        return this.addListener(PING_RN_EVENT_FAIL, cb);
    }

    onTimestamp(cb: () => mixed): string {
        return this.addListener(PING_RN_EVENT_SERVER_TIMESTAMP, cb);
    }

    onError(cb: () => mixed): string {
        return this.addListener(RN_EVENT_EXCEPTION, cb);
    }

    removeSubscription(key: string) {
        if (!listeners[key]) {
            return;
        }

        SimpozioBackgroundWorker.removeListener(key);

        listeners[key] = null;
    }

    isStarted(): boolean {
        return this._isStarted;
    }

    destroy() {
        this.stop();
        eventEmitter.removeAllListeners();
    }
}
