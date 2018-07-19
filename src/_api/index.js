// @flow

import axios from 'axios';
import {AxiosInstance, CancelToken, CancelTokenSource} from 'axios';
import {Store} from 'redux';
import type {SmpzGenericDataType} from '../simpozio/common/common.types';
import {requestHelper} from './requestHelper';

export type SmpzApiRequestParamsType = {
    url?: string,
    data?: SmpzGenericDataType,
    params?: SmpzGenericDataType,
    headers?: {[key: string]: string},
    timeout?: number,
    cancelToken?: CancelToken
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

    get({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this.request('get', {url, data, params, headers, timeout, cancelToken}, this.store);
    }

    post({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this.request('post', {url, data, params, headers, timeout, cancelToken}, this.store);
    }

    delete({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this.request('delete', {url, data, params, headers, timeout, cancelToken}, this.store);
    }

    put({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this.request('put', {url, data, params, headers, timeout, cancelToken}, this.store);
    }

    makeCancelToken(): CancelTokenSource {
        const cancelToken = axios.CancelToken;
        return cancelToken.source();
    }
}
