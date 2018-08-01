//@flow

import type {SmpzApiRequestParamsType, SmpzApiResponseFullfilmentType} from './index';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from 'axios/index';
import _ from 'lodash';
export const requestHelper = ({
    url,
    data,
    params,
    headers: _headers,
    timeout,
    cancelToken,
    method,
    terminal
}: SmpzApiRequestParamsType): AxiosInstance => {
    const axiosInstance = axios.create();
    const {baseUrl, authorization, xHttpMethodOverride} = terminal || {};

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
        (err: AxiosError): Promise<AxiosError> => {
            let config = err.config;
            // If config does not exist or the retry option is not set, reject
            if (!config || !config.retry) {
                return Promise.reject(err);
            }

            // Set the variable for keeping track of the retry count
            config.__retryCount = config.__retryCount || 0;

            // Check if we've maxed out the total number of retries
            if (config.__retryCount >= config.retry) {
                // Reject with the error
                return Promise.reject(err);
            }

            // Increase the retry count
            config.__retryCount += 1;

            // Create new promise to handle exponential backoff
            let backoff = new Promise((resolve: Function) => {
                setTimeout(function() {
                    resolve();
                }, config.retryDelay || 1);
            });

            // Return the promise in which recalls axios to retry the request
            return backoff.then((): AxiosInstance => {
                return axios(config);
            });
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
