// @flow

import _ from 'lodash';
import axios from 'axios';
import {AxiosInstance, CancelToken, CancelTokenSource} from 'axios';
import {Store} from 'redux';
import type {SmpzGenericDataType} from '../simpozio/common/common.types';
import {requestHelper} from './requestHelper';
import type {SmpzTerminalModelType} from '../_terminal/reducer';

export type SmpzApiRequestParamsType = {
    url?: string,
    data?: any,
    params?: any,
    headers?: {[key: string]: string},
    timeout?: number,
    cancelToken?: CancelToken,
    method?: string,
    terminal: SmpzTerminalModelType
};

export type SmpzApiResponseFullfilmentType = {result?: SmpzGenericDataType, status?: string, requestTime: number};

export type SmpzApiConstructorParamsType = {
    store: Store
};

export default class Api {
    name: string;
    store: Store;
    request: AxiosInstance;

    constructor({store}: SmpzApiConstructorParamsType) {
        this.name = 'Api';
        this.store = store;
        this.request = requestHelper;
    }

    get(params: SmpzApiRequestParamsType): AxiosInstance {
        return this.request({...params, method: 'get', terminal: _.get(this.store.getState(), 'terminal')});
    }

    post(params: SmpzApiRequestParamsType): AxiosInstance {
        return this.request({...params, method: 'post', terminal: _.get(this.store.getState(), 'terminal')});
    }

    delete(params: SmpzApiRequestParamsType): AxiosInstance {
        return this.request({...params, method: 'delete', terminal: _.get(this.store.getState(), 'terminal')});
    }

    put(params: SmpzApiRequestParamsType): AxiosInstance {
        return this.request({...params, method: 'put', terminal: _.get(this.store.getState(), 'terminal')});
    }

    makeCancelToken(): CancelTokenSource {
        const cancelToken = axios.CancelToken;
        return cancelToken.source();
    }
}
