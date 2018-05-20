import _ from 'lodash';
import rnSimpozioService from 'rn-simpozio-background-service';
import {heartbeatUpdate} from './actions';
import {HEARTBEAT_RN_EVENT_FAIL, HEARTBEAT_RN_EVENT_RESUME} from './const';

const META = '_simpozioListenerId';

export default class Heartbeat {
    static listeners = {};

    constructor({initialData, isNative = false, store}) {
        this.isNative = isNative;
        this.store = store;

        this._isStarted = false;
        this.currentData = _.get(this.store.getState(), 'heartbeat');

        this.store.subscribe(this.handleStoreChange);
        this.store.dispatch(heartbeatUpdate(this.currentData));

        if (!this.isNative) {
            throw 'Not implemented';
        }
    }

    static getKey = listener => {
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

    static addListener = (event, cb) => {
        let key = this.getKey(cb);

        if (this.isNative) {
            this.listeners[key] = rnSimpozioService.addListener(event, cb);
        }
        return key;
    };

    static handleStoreChange = () => {
        const newData = _.get(this.store.getState(), 'heartbeat');

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
                    .startHeartbeat(newData)
                    .then(() => {
                        this._isStarted = true;
                        console.log('SDK HEARTBEAT STARTED');
                    })
                    .catch(error => {
                        console.log('SDK HEARTBEAT ERROR', error);
                    });
            } else {
                rnSimpozioService.updateHeartbeat(newData);
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
        if (!this.listeners[key]) {
            return;
        }

        if (this.isNative) {
            rnSimpozioService.removeListener(key);
        }

        this.listeners[key] = null;
    };

    isStarted = () => {
        return this._isStarted;
    };
}
