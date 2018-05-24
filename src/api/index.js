import axios from 'axios';
import _ from 'lodash';

export default class Api {
    constructor({store}) {
        this.name = 'Api';
        this.store = store;
    }

    _requestHelper(method, {url, data, params, headers: _headers, timeout, cancelToken}) {
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

        axiosInstance.interceptors.request.use(config => {
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
                    return {
                        result,
                        requestTime
                    };
                } else {
                    return Promise.reject({result, status});
                }
            },
            error => {
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
