import _ from 'lodash';
import moment from 'moment';
import EventEmitter from 'events';
import {heartbeatUpdateAction} from './actions';
import SimpozioBackgroundWorker from 'react-native-simpozio-background-worker';

import Api from '../api';
import {terminalOnlineAction} from '../terminal/actions';

import {HEARTBEAT_RN_EVENT_EXCEPTION, HEARTBEAT_RN_EVENT_FAIL, HEARTBEAT_RN_EVENT_RESUME} from './const';
import {API_HEARTBEAT, API_SIGNALS} from '../api/const';

const META = '_simpozioListenerId';
const listeners = {};

export default class Heartbeat {
    constructor({initialData, isNative = false, store}) {
        this._isStarted = false;

        this.isNative = isNative;
        this.store = store;
        this.cancelToken = null;
        this.checkConnectionTimeout = 0;
        this.api = new Api({store, isNative});
        this.currentData = {};

        this.store.subscribe(this._handleStoreChange);
        this.store.dispatch(heartbeatUpdateAction(initialData));
    }

    _getKey(listener) {
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
    }

    addListener(event, cb) {
        let key = this._getKey(cb);

        if (this.isNative) {
            listeners[key] = SimpozioBackgroundWorker.addListener(event, cb);
        } else {
            EventEmitter.addListener(event, cb);
            listeners[key] = {event, cb};
        }
        return key;
    }

    _getMetadata() {
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

        if (this.isNative) {
            if (newData === false || _.get(newData, 'next') === 0) {
                SimpozioBackgroundWorker.stopHeartbeat()
                    .then(() => {
                        this._isStarted = false;
                        if (debug) {
                            console.log('SDK HEARTBEAT STOPPED');
                        }
                    })
                    .catch(error => {
                        if (debug) {
                            console.log('SDK HEARTBEAT ERROR', error);
                        }
                    });
            } else if (this._isStarted === false) {
                SimpozioBackgroundWorker.startHeartbeat(this._getMetadata())
                    .then(() => {
                        this._isStarted = true;
                        if (debug) {
                            console.log('SDK HEARTBEAT STARTED');
                        }
                    })
                    .catch(error => {
                        if (debug) {
                            console.log('SDK HEARTBEAT ERROR', error);
                        }
                    });
            } else {
                SimpozioBackgroundWorker.updateHeartbeat(this._getMetadata());
            }
        } else {
            if (newData === false || _.get(newData, 'next') === 0) {
                this._stopHeartbeat();
            } else if (this._isStarted === false) {
                this._startHeartbeat();
            }
        }

        this.currentData = newData;
    }

    _startHeartbeat() {
        if (this._isStarted) {
            return;
        }

        this._isStarted = true;

        const helper = () => {
            this.checkConnectionTimeout = 0;
            const {accessToken, online, debug} = _.get(this.store.getState(), 'terminal', {});
            const {next, lastOffline} = _.get(this.store.getState(), 'heartbeat', {});

            if (!accessToken) {
                return;
            }

            const handleReject = error => {
                this.cancelToken = null;

                if (debug) {
                    console.log('SIMPOZIO SDK HEARTBEAT FAILED', error);
                }

                if (online) {
                    this.store.dispatch(terminalOnlineAction(false));
                    EventEmitter.emit(HEARTBEAT_RN_EVENT_FAIL, error);
                }

                if (!this.checkConnectionTimeout) {
                    this.checkConnectionTimeout = setTimeout(() => {
                        helper();
                    }, 1500);
                }
            };

            const handleResponse = ({result, requestTime}) => {
                this.cancelToken = null;

                if (!online) {
                    EventEmitter.emit(HEARTBEAT_RN_EVENT_RESUME, {
                        duration: moment().valueOf() - lastOffline
                    });

                    this.store.dispatch(terminalOnlineAction(false));
                }
                if (!this.checkConnectionTimeout) {
                    this.checkConnectionTimeout = setTimeout(() => {
                        helper();
                    }, next - requestTime * 2);
                }
                return Promise.resolve(result);
            };

            const data = _.assign({}, this._getMetadata().body, {
                timestamp: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            });

            this.cancelToken = this.api.makeCancelToken;

            this.api
                .post({
                    data,
                    timeout: next * 0.5,
                    url: API_SIGNALS + API_HEARTBEAT,
                    cancelToken: this.cancelToken
                })
                .then(handleResponse)
                .catch(handleReject);
        };

        helper();
    }

    _stopHeartbeat() {
        if (this.checkConnectionTimeout) {
            clearTimeout(this.checkConnectionTimeout);
            this.checkConnectionTimeout = 0;
        }

        if (this.cancelToken) {
            this.cancelToken.cancel();
        }

        this._isStarted = false;
    }

    update(data) {
        this.store.dispatch(heartbeatUpdateAction(data));
    }

    onFail(cb) {
        return this.addListener(HEARTBEAT_RN_EVENT_FAIL, cb);
    }

    onResume(cb) {
        return this.addListener(HEARTBEAT_RN_EVENT_RESUME, cb);
    }

    onError(cb) {
        return this.addListener(HEARTBEAT_RN_EVENT_EXCEPTION, cb);
    }

    removeSubscription(key) {
        if (!listeners[key]) {
            return;
        }

        if (this.isNative) {
            SimpozioBackgroundWorker.removeListener(key);
        } else {
            const {event, cd} = listeners[key];
            EventEmitter.removeListener(event, cd);
        }

        listeners[key] = null;
    }

    isStarted() {
        return this._isStarted;
    }
}
