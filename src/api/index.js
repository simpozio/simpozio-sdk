import axios from 'axios';
import _ from 'lodash';

export default class Api {
    constructor({store}) {
        this.store = store;
    }

    _requestHelper(method, {url, data, params, headers, timeout, cancelToken}) {
        const {baseUrl, authorization, userAgent, acceptLanguage, xHttpMethodOverride, locale, debug} = _.get(
            this.store.getState(),
            'terminal',
            {}
        );

        const interceptorRequest = axios.interceptors.request.use(config => {
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
        const interceptorResponse = axios.interceptors.response.use(
            response => {
                const requestTime = Date.now() - response.config.requestStartTime;
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
                    return Promise.resolve({
                        result: result,
                        requestTime
                    });
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
                            `ERROR API TIMEOUT: ${_.get(error, 'config.method')} ${_.get(error, 'config.url')}`
                        );
                    } else {
                        console.log(
                            `ERROR API: ${_.get(error, 'config.method')} ${_.get(error, 'config.url')}`,
                            _.get(error, 'message')
                        );
                    }
                }
            }
        );

        return axios({
            url,
            data,
            method,
            timeout,
            baseUrl,
            cancelToken,
            headers: _.assign(
                {},
                {
                    Date: moment.utc().format(`ddd, D MMM YYYY HH:mm:ss`) + ' GMT',
                    Authorization: authorization,
                    'User-Agent': userAgent,
                    'Accept-Language': acceptLanguage,
                    'X-HTTP-Method-Override': xHttpMethodOverride
                },
                headers
            ),
            params: _.assign({}, params, {
                locale
            })
        })
            .then(() => {
                axios.interceptors.request.eject(interceptorRequest);
                axios.interceptors.response.eject(interceptorResponse);
            })
            .catch(() => {
                axios.interceptors.request.eject(interceptorRequest);
                axios.interceptors.response.eject(interceptorResponse);
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
        const CancelToken = axios.CancelToken;
        return CancelToken.source();
    }
}
