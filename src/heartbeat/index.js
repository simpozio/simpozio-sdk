import _ from 'lodash';
import rnSimpozioService from 'rn-simpozio-background-service';
import {heartbeatUpdate} from './actions';
import {HEARTBEAT_RN_EVENT_FAIL, HEARTBEAT_RN_EVENT_RESUME} from './const';
import ObjectID from 'bson-objectid/objectid';

const META = '_simpozioListenerId';
const listeners = {};

export default class Heartbeat {
    constructor({initialData, isNative = false, store}) {
        this.isNative = isNative;
        this.store = store;
        this.currentData = {};
        this._isStarted = false;

        if (!this.isNative) {
            throw 'Not implemented';
        }

        this.store.subscribe(this.handleStoreChange);
        this.store.dispatch(heartbeatUpdate(initialData));
    }

    getKey = listener => {

        if (!listener) {
            return;
        }

        if (!listener.hasOwnProperty(META)) {
            if (!Object.isExtensible(listener)) {
                return 'F';
            }

            Object.defineProperty(listener, META, {
                value: _.uniqueId('SIMPOZIO_LISTENER_')
            });
        }

        return listener[META];
    };

    addListener = (event, cb) => {
        let key = this.getKey(cb);

        if (this.isNative) {
            listeners[key] = rnSimpozioService.addListener(event, cb);
        }
        return key;
    };

    getMetadata = () => {
        const {baseUrl, authorization, touchpoint, userAgent, acceptLanguage, xHttpMethodOverride} = _.get(
            this.store.getState(),
            'terminal',
            {}
        );

        const {state, screen, connection, bandwidth, payload, next} = _.get(this.store.getState(), 'heartbeat', {});

        return {
            baseUrl,
            headers: {
                'Authorization': authorization,
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
    };

    handleStoreChange = () => {
        const newData = _.get(this.store.getState(), 'heartbeat', {});

        if (_.isEqual(this.currentData, newData)) {
            return;
        }

        if (this.isNative) {
            if (newData === false || _.get(newData, 'next') === 0) {
                rnSimpozioService
                    .stopHeartbeat()
                    .then(() => {
                        this._isStarted = false;
                        console.log('SDK HEARTBEAT STOPPED');
                    })
                    .catch(error => {
                        console.log('SDK HEARTBEAT ERROR', error);
                    });
            } else if (this._isStarted === false) {
                rnSimpozioService
                    .startHeartbeat(this.getMetadata())
                    .then(() => {
                        this._isStarted = true;
                        console.log('SDK HEARTBEAT STARTED');
                    })
                    .catch(error => {
                        console.log('SDK HEARTBEAT ERROR', error);
                    });
            } else {
                rnSimpozioService.updateHeartbeat(this.getMetadata());
            }
        }

        this.currentData = newData;
    };

    update = data => {
        this.store.dispatch(heartbeatUpdate(data));
    };

    onFail = cb => {
        return this.addListener(HEARTBEAT_RN_EVENT_FAIL, cb);
    };

    onResume = cb => {
        return this.addListener(HEARTBEAT_RN_EVENT_RESUME, cb);
    };

    removeSubscription = key => {
        if (!listeners[key]) {
            return;
        }

        if (this.isNative) {
            rnSimpozioService.removeListener(key);
        }

        listeners[key] = null;
    };

    isStarted = () => {
        return this._isStarted;
    };
}
