// @flow

import _ from 'lodash';
import SimpozioBackgroundWorker from 'react-native-simpozio-background-worker';
import Heartbeat from '../src/heartbeat';
import type {SmpzHeartbeatConstructorParamsType} from '../src/heartbeat';
import type {SmpzGenericDataType} from '../src/simpozio/common/common.types';
import type {SmpzHeartbeatModelType} from '../src/heartbeat/reducer';
import {getListenerKey} from '../src/simpozio/common/common.helpers';

const listeners = {};

export type SmpzHeartbeatNativeModelType = {
    baseUrl?: string,
    headers?: {
        Authorization: string,
        'User-Agent': string,
        'Accept-Language': string,
        'X-HTTP-Method-Override': string
    },
    body?: SmpzHeartbeatModelType
};

export default class HeartbeatNative extends Heartbeat {
    constructor({initialData, store}: SmpzHeartbeatConstructorParamsType) {
        super({initialData, store});
    }

    addListener(event: string, cb: () => mixed): string {
        let key = getListenerKey(cb);

        listeners[key] = SimpozioBackgroundWorker.addListener(event, cb);

        return key;
    }

    _getNativeMetadata(): SmpzHeartbeatNativeModelType {
        const {baseUrl, authorization, touchpoint, userAgent, acceptLanguage, xHttpMethodOverride} = _.get(
            this.store.getState(),
            'terminal',
            {}
        );

        const {state, screen, connection, bandwidth, payload, next} = _.get(this.store.getState(), 'heartbeat', {});

        return {
            baseUrl,
            headers: {
                Authorization: authorization,
                'User-Agent': userAgent,
                'Accept-Language': acceptLanguage,
                'X-HTTP-Method-Override': xHttpMethodOverride
            },
            body: {
                touchpoint,
                state,
                screen,
                connection,
                bandwidth,
                payload,
                next
            }
        };
    }

    _handleStoreChange() {
        const {debug} = _.get(this.store.getState(), 'terminal', {});
        const newData = _.get(this.store.getState(), 'heartbeat', {});

        if (_.isEqual(this.currentData, newData)) {
            return;
        }

        if (newData === false || _.get(newData, 'next') === 0 && _.isFunction(_.get(SimpozioBackgroundWorker, 'stopHeartbeat'))) {
            SimpozioBackgroundWorker.stopHeartbeat()
                .then(() => {
                    this._isStarted = false;
                    if (debug) {
                        console.log('SDK HEARTBEAT STOPPED');
                    }
                })
                .catch((error: SmpzGenericDataType) => {
                    if (debug) {
                        console.log('SDK HEARTBEAT ERROR', error);
                    }
                });
        } else if (this._isStarted === false && _.isFunction(_.get(SimpozioBackgroundWorker, 'startHeartbeat'))) {
            SimpozioBackgroundWorker.startHeartbeat(this._getNativeMetadata())
                .then(() => {
                    this._isStarted = true;
                    if (debug) {
                        console.log('SDK HEARTBEAT STARTED');
                    }
                })
                .catch((error: SmpzGenericDataType) => {
                    if (debug) {
                        console.log('SDK HEARTBEAT ERROR', error);
                    }
                });
        } else if(_.isFunction(_.get(SimpozioBackgroundWorker, 'updateHeartbeat'))) {
            SimpozioBackgroundWorker.updateHeartbeat(this._getNativeMetadata());
        }

        this.currentData = newData;
    }

    removeSubscription(key: string) {
        if (!listeners[key]) {
            return;
        }

        if(_.isFunction(_.get(SimpozioBackgroundWorker, 'removeListener'))) {
            SimpozioBackgroundWorker.removeListener(key);
        }

        listeners[key] = null;
    }
}
