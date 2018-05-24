'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = function () {
    function Api(_ref) {
        var store = _ref.store;

        _classCallCheck(this, Api);

        this.name = 'Api';
        this.store = store;
    }

    _createClass(Api, [{
        key: '_requestHelper',
        value: function _requestHelper(method, _ref2) {
            var url = _ref2.url,
                data = _ref2.data,
                params = _ref2.params,
                _headers = _ref2.headers,
                timeout = _ref2.timeout,
                cancelToken = _ref2.cancelToken;

            var axiosInstance = _axios2.default.create();

            var _$get = _lodash2.default.get(this.store.getState(), 'terminal', {}),
                baseUrl = _$get.baseUrl,
                authorization = _$get.authorization,
                xHttpMethodOverride = _$get.xHttpMethodOverride;

            var headers = _lodash2.default.assign({}, {
                Authorization: authorization,
                'X-HTTP-Method-Override': xHttpMethodOverride
            }, _headers);

            axiosInstance.interceptors.request.use(function (config) {
                return _lodash2.default.assign({}, config, {
                    requestStartTime: Date.now()
                });
            });

            // Store response timestamp and/or response time in response/error `config`
            axiosInstance.interceptors.response.use(function (response) {
                var requestTime = Date.now() - _lodash2.default.get(response, 'config.requestStartTime', 0);

                var _$get2 = _lodash2.default.get(response, 'data', {}),
                    result = _$get2.result,
                    status = _$get2.status;

                if (status === 'ok') {
                    return {
                        result: result,
                        requestTime: requestTime
                    };
                } else {
                    return Promise.reject({ result: result, status: status });
                }
            }, function (error) {
                return Promise.reject(error);
            });

            return axiosInstance({
                url: url,
                data: data,
                method: method,
                timeout: timeout,
                baseURL: baseUrl,
                cancelToken: cancelToken,
                headers: headers
            });
        }
    }, {
        key: 'get',
        value: function get(_ref3) {
            var url = _ref3.url,
                data = _ref3.data,
                params = _ref3.params,
                headers = _ref3.headers,
                timeout = _ref3.timeout,
                cancelToken = _ref3.cancelToken;

            return this._requestHelper('get', { url: url, data: data, params: params, headers: headers, timeout: timeout, cancelToken: cancelToken });
        }
    }, {
        key: 'post',
        value: function post(_ref4) {
            var url = _ref4.url,
                data = _ref4.data,
                params = _ref4.params,
                headers = _ref4.headers,
                timeout = _ref4.timeout,
                cancelToken = _ref4.cancelToken;

            return this._requestHelper('post', { url: url, data: data, params: params, headers: headers, timeout: timeout, cancelToken: cancelToken });
        }
    }, {
        key: 'delete',
        value: function _delete(_ref5) {
            var url = _ref5.url,
                data = _ref5.data,
                params = _ref5.params,
                headers = _ref5.headers,
                timeout = _ref5.timeout,
                cancelToken = _ref5.cancelToken;

            return this._requestHelper('delete', { url: url, data: data, params: params, headers: headers, timeout: timeout, cancelToken: cancelToken });
        }
    }, {
        key: 'put',
        value: function put(_ref6) {
            var url = _ref6.url,
                data = _ref6.data,
                params = _ref6.params,
                headers = _ref6.headers,
                timeout = _ref6.timeout,
                cancelToken = _ref6.cancelToken;

            return this._requestHelper('put', { url: url, data: data, params: params, headers: headers, timeout: timeout, cancelToken: cancelToken });
        }
    }, {
        key: 'makeCancelToken',
        value: function makeCancelToken() {
            var cancelToken = _axios2.default.CancelToken;
            return cancelToken.source();
        }
    }]);

    return Api;
}();

exports.default = Api;