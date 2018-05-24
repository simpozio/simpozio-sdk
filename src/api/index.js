import axios from 'axios';
import _ from 'lodash';

export default class Api {
    constructor({store}) {
        this.store = store;
    }

    _requestHelper(method, {url, data, params, headers: _headers, timeout, cancelToken}) {
        const axiosInstance = axios.create();
        const {baseUrl, authorization, xHttpMethodOverride, debug} = _.get(this.store.getState(), 'terminal', {});

        const headers = _.assign(
            {},
            {
                Authorization: authorization,
                'X-HTTP-Method-Override': xHttpMethodOverride
            },
            _headers
        );

        axiosInstance.interceptors.request.use(config => {
            if (debug && !_.get(config, 'skipLogs.request')) {
                console.log(
                    'SIMPOZIO_SDK API REQUEST: ',
                    _.pick(config, ['data', 'url', 'timeout', 'method', 'headers'])
                );
            }

            return _.assign({}, config, {
                requestStartTime: Date.now()
            });
        });

        // Store response timestamp and/or response time in response/error `config`
        axiosInstance.interceptors.response.use(
            response => {
                const requestTime = Date.now() - _.get(response, 'config.requestStartTime', 0);
                const {result, status} = _.get(response, 'data', {});
                if (status === 'ok') {
                    if (debug && !_.get(response, 'config.skipLogs.response')) {
                        console.log(
                            `SIMPOZIO_SDK API RESPONSE: ${_.get(response, 'config.method')} ${_.get(
                                response,
                                'config.url'
                            )}`,
                            result
                        );
                    }
                    return {
                        result,
                        requestTime
                    };
                } else {
                    if (debug && !_.get(response, 'config.skipLogs.error')) {
                        console.log(
                            `SIMPOZIO_SDK API ERROR: ${_.get(response, 'config.method')} ${_.get(
                                response,
                                'config.url'
                            )}`,
                            response
                        );
                    }
                    return Promise.reject({result, status});
                }
            },
            error => {
                if (debug && !_.get(error, 'config.skipLogs.error')) {
                    if (error.response) {
                        console.log(
                            `SIMPOZIO_SDK ERROR API: ${_.get(error, 'config.method')} ${_.get(
                                error,
                                'config.url'
                            )} ${_.get(error, 'response.status')}`,
                            _.get(error, 'response.data')
                        );
                    } else if (error.request) {
                        console.log(
                            `SIMPOZIO_SDK ERROR API TIMEOUT: ${_.get(error, 'config.method')} ${_.get(
                                error,
                                'config.url'
                            )}`
                        );
                    } else {
                        console.log(
                            `SIMPOZIO_SDK ERROR API: ${_.get(error, 'config.method')} ${_.get(error, 'config.url')}`,
                            _.get(error, 'message')
                        );
                    }
                }
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

    get({url, data, params, headers, timeout, cancelToken}) {
        return this._requestHelper('get', {url, data, params, headers, timeout, cancelToken});
    }

    post({url, data, params, headers, timeout, cancelToken}) {
        return this._requestHelper('post', {url, data, params, headers, timeout, cancelToken});
    }

    delete({url, data, params, headers, timeout, cancelToken}) {
        return this._requestHelper('delete', {url, data, params, headers, timeout, cancelToken});
    }

    put({url, data, params, headers, timeout, cancelToken}) {
        return this._requestHelper('put', {url, data, params, headers, timeout, cancelToken});
    }

    makeCancelToken() {
        const cancelToken = axios.CancelToken;
        return cancelToken.source();
    }
}
