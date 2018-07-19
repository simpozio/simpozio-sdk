//@flow

import type {SmpzApiRequestParamsType, SmpzApiResponseFullfilmentType} from './index';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from 'axios/index';
import {Store} from 'redux';
import _ from 'lodash';

export const requestHelper = (
    method: string,
    {url, data, params, headers: _headers, timeout, cancelToken}: SmpzApiRequestParamsType,
    store: Store
): AxiosInstance => {
    const axiosInstance = axios.create();
    const {baseUrl, authorization, xHttpMethodOverride} = _.get(store.getState(), 'terminal', {});

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
};
