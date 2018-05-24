'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redux = require('redux');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _reduxDevtoolsExtension = require('redux-devtools-extension');

var _actions = require('../terminal/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create new Simpozio SDK instance
 * By default make anonymous auth, starts heartbeat and trace
 * @param configObj
 * @param configObj.data {object} — initial data for store
 * @param configObj.baseUrl {string} — url of Simpozio instance ('https://api.simpozio.com/v2' by default)
 * @param configObj.heartbeat {object|boolean} — config for heartbeat or 'false' to avoid heartbeat
 * @param configObj.trace {object|boolean} — config for trace or 'false' to avoid trace
 * @returns {{Heartbeat, config}}
 */
var SimpozioClass = function () {
    function SimpozioClass(configObj, HeartbeatConstructor) {
        _classCallCheck(this, SimpozioClass);

        var _$get = _lodash2.default.get(configObj, 'data', {}),
            heartbeat = _$get.heartbeat;

        if (!SimpozioClass.instance) {
            var store = (0, _redux.createStore)(_reducers2.default, {}, (0, _reduxDevtoolsExtension.devToolsEnhancer)());
            // const Journey = new JourneyConstructor({store, initialData: journeys, isNative});
            // const Itinerary = new ItineraryConstructor({store, initialData: itinerary, isNative});

            // this.Journey = Journey;
            // this.Itinerary = Itinerary;

            this.store = store;

            this.Heartbeat = new HeartbeatConstructor({
                store: store,
                initialData: _lodash2.default.get(configObj, 'heartbeat', {})
            });

            this.store.dispatch((0, _actions.terminalUpdateAction)(configObj));

            SimpozioClass.instance = this;
        } else {
            if (heartbeat === false) {
                SimpozioClass.instance.Heartbeat.stop();
            }
            return SimpozioClass.instance;
        }
    }

    _createClass(SimpozioClass, [{
        key: 'config',
        value: function config(configObj) {
            var _$get2 = _lodash2.default.get(configObj, 'data', {}),
                heartbeat = _$get2.heartbeat;

            this.store.dispatch((0, _actions.terminalUpdateAction)(configObj));

            if (heartbeat) {
                SimpozioClass.instance.Heartbeat.update(heartbeat);
            }
        }
    }]);

    return SimpozioClass;
}();

exports.default = SimpozioClass;