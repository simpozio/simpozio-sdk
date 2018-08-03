// @flow

import _ from 'lodash';
import moment from 'moment';
import EventEmitter from 'events';
import {Store} from 'redux';
import {CancelToken} from 'axios';

import Logger from '../simpozio/logger';
import Api from '../_api';
import type {SmpzApiResponseFullfilmentType} from '../_api';
import {terminalOnlineAction} from '../_terminal/actions';
import {heartbeatUpdateAction} from './actions';

import {HEARTBEAT_RN_EVENT_EXCEPTION, HEARTBEAT_RN_EVENT_FAIL, HEARTBEAT_RN_EVENT_RESUME} from './const';
import {API_HEARTBEAT, API_SIGNALS} from '../_api/const';
import type {SmpzGenericDataType} from '../simpozio/common/common.types';
import type {SmpzHeartbeatModelType} from './reducer';
import {AxiosError} from 'axios/index';
import {getListenerKey} from '../simpozio/common/common.helpers';

const listeners = {};
const eventEmitter = new EventEmitter();

export type SmpzHeartbeatConstructorParamsType = {initialData?: SmpzHeartbeatModelType, store: Store};

export default class Heartbeat {
    name: string;
    _isStarted: boolean;
    store: Store;
    cancelToken: CancelToken;
    checkConnectionTimeout: TimeoutID;
    logger: Logger;
    api: Api;
    currentData: SmpzGenericDataType;
    requestTime: number;

    constructor({initialData, store}: SmpzHeartbeatConstructorParamsType) {
        this.name = 'Heartbeat';
        this._isStarted = false;

        this.store = store;
        this.cancelToken = null;
        this.checkConnectionTimeout;
        this.logger = new Logger({store, name: this.name});
        this.api = new Api({store});
        this.currentData = {};
        this.requestTime = 0;

        this.store.subscribe(this._handleStoreChange.bind(this));
        this.store.dispatch(heartbeatUpdateAction(initialData));
    }

    addListener(event: string, cb: () => mixed): string {
        let key = getListenerKey(cb);

        eventEmitter.addListener(event, cb);
        listeners[key] = {event, cb};

        return key;
    }

    _getMetadata(): SmpzHeartbeatModelType {
        const {touchpoint} = _.get(this.store.getState(), 'terminal', {});

        const {state, screen, connection, bandwidth, payload, next} = _.get(this.store.getState(), 'heartbeat', {});

        return {
            touchpoint,
            state,
            screen,
            connection,
            bandwidth,
            payload,
            next
        };
    }

    _handleStoreChange() {
        const {authorization} = _.get(this.store.getState(), 'terminal', {});
        let newData = _.get(this.store.getState(), 'heartbeat', {});
        newData = _.assign({}, newData, {authorization});

        if (_.isEqual(this.currentData, newData)) {
            return;
        }

        if (newData === false || _.get(newData, 'next') === 0) {
            this._stopHeartbeat();
        } else if (this._isStarted === false && authorization) {
            this._startHeartbeat();
        }

        this.currentData = _.clone(newData);
    }

    _startHeartbeat() {
        if (this._isStarted) {
            return;
        }

        this._isStarted = true;

        const helper = () => {
            delete this.checkConnectionTimeout;
            const {authorization, online, debug} = _.get(this.store.getState(), 'terminal', {});
            const {next, lastOffline} = _.get(this.store.getState(), 'heartbeat', {});
            const terminal = _.get(this.store.getState(), 'terminal', {});

            if (!authorization) {
                this._isStarted = false;
                return;
            }

            const handleReject = (error: AxiosError) => {
                this.requestTime = this.requestTime || 1000;

                this.cancelToken = null;

                if (online) {
                    this.logger.error('fail', error);

                    this.store.dispatch(terminalOnlineAction(false));
                    eventEmitter.emit(HEARTBEAT_RN_EVENT_FAIL, error);
                }

                if (!this.checkConnectionTimeout) {
                    this.checkConnectionTimeout = setTimeout(() => {
                        helper();
                    }, next - this.requestTime * 2);
                }
            };

            const handleResponse = (
                {result, requestTime}: SmpzApiResponseFullfilmentType = {}
            ): Promise<?SmpzGenericDataType> => {
                this.requestTime = requestTime;
                this.cancelToken = null;

                if (!online) {
                    eventEmitter.emit(HEARTBEAT_RN_EVENT_RESUME, {
                        duration: moment().valueOf() - lastOffline
                    });

                    this.logger.log('resume', result);

                    this.store.dispatch(terminalOnlineAction(true));
                }
                if (!this.checkConnectionTimeout) {
                    this.checkConnectionTimeout = setTimeout(() => {
                        helper();
                    }, next - this.requestTime * 2);
                }
                return Promise.resolve(result);
            };

            const data = _.assign({}, this._getMetadata(), {
                timestamp: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            });

            this.cancelToken = this.api.makeCancelToken();

            this.api
                .post({
                    data,
                    timeout: next * 0.5,
                    url: API_SIGNALS + API_HEARTBEAT,
                    cancelToken: this.cancelToken.token,
                    terminal
                })
                .then(handleResponse)
                .catch(handleReject);
        };

        helper();
    }

    _stopHeartbeat() {
        if (this.checkConnectionTimeout) {
            clearTimeout(this.checkConnectionTimeout);
            delete this.checkConnectionTimeout;
        }

        if (this.cancelToken) {
            this.cancelToken.cancel();
        }

        this._isStarted = false;
    }

    stop() {
        this._stopHeartbeat();
    }

    update(data: SmpzHeartbeatModelType) {
        this.store.dispatch(heartbeatUpdateAction(data));
    }

    onFail(cb: () => mixed): string {
        return this.addListener(HEARTBEAT_RN_EVENT_FAIL, cb);
    }

    onResume(cb: () => mixed): string {
        return this.addListener(HEARTBEAT_RN_EVENT_RESUME, cb);
    }

    onError(cb: () => mixed): string {
        return this.addListener(HEARTBEAT_RN_EVENT_EXCEPTION, cb);
    }

    removeSubscription(key: string) {
        if (!listeners[key]) {
            return;
        }

        const {event, cd} = listeners[key];
        eventEmitter.removeListener(event, cd);

        listeners[key] = null;
    }

    isStarted(): boolean {
        return this._isStarted;
    }
}
