// @flow

import axios from 'axios';
import _ from 'lodash';
import {AxiosInstance, CancelToken, CancelTokenSource} from 'axios';
import {Store} from 'redux';
import type {SmpzGenericDataType} from '../simpozio/common/common.types';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios/index';

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

    constructor({store}: SmpzApiConstructorParamsType) {
        this.name = 'Api';
        this.store = store;
    }

    _requestHelper(
        method: string,
        {url, data, params, headers: _headers, timeout, cancelToken}: SmpzApiRequestParamsType
    ): AxiosInstance {
        const axiosInstance = axios.create();
        const {baseUrl, authorization, xHttpMethodOverride} = _.get(this.store.getState(), 'terminal', {});

        const headers = _.assign(
            {},
            {
                Authorization: authorization,
                'X-HTTP-Method-Override': xHttpMethodOverride
            },
            _headers
        );

        axiosInstance.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig & {
            requestStartTime: number
        } => {
            return _.assign({}, config, {
                requestStartTime: Date.now()
            });
        });

        // Store response timestamp and/or response time in response/error `config`
        axiosInstance.interceptors.response.use(
            (response: AxiosResponse): Promise<SmpzApiResponseFullfilmentType> => {
                const requestTime = Date.now() - _.get(response, 'config.requestStartTime', 0);
                const {result, status} = _.get(response, 'data', {});
                if (status === 'ok') {
                    return Promise.resolve({
                        result,
                        requestTime
                    });
                } else {
                    return Promise.reject({result, status});
                }
            },
            (error: AxiosError): Promise<AxiosError> => {
                return Promise.reject(error);
            }
        );

        return axiosInstance({
            url,
            data,
            method,
            timeout,
            baseURL: baseUrl,
            cancelToken,
            headers
        });
    }

    get({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this._requestHelper('get', {url, data, params, headers, timeout, cancelToken});
    }

    post({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this._requestHelper('post', {url, data, params, headers, timeout, cancelToken});
    }

    delete({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this._requestHelper('delete', {url, data, params, headers, timeout, cancelToken});
    }

    put({url, data, params, headers, timeout, cancelToken}: SmpzApiRequestParamsType): AxiosInstance {
        return this._requestHelper('put', {url, data, params, headers, timeout, cancelToken});
    }

    makeCancelToken(): CancelTokenSource {
        const cancelToken = axios.CancelToken;
        return cancelToken.source();
    }
}
