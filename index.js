import _ from 'lodash';
import {createStore} from 'redux';
import reducers from './src/reducers';
import HeartbeatConstructor from './src/heartbeat';
import {devToolsEnhancer} from 'redux-devtools-extension';
import {terminalUpdate} from './src/terminal/actions';

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
export default class SimpozioClass {
    constructor(configObj, isNative = false) {
        const {heartbeat} = _.get(configObj, 'data', {});

        if (!SimpozioClass.instance) {
            const store = createStore(reducers, {}, devToolsEnhancer());
            // const Journey = new JourneyConstructor({store, initialData: journeys, isNative});
            // const Itinerary = new ItineraryConstructor({store, initialData: itinerary, isNative});

            // this.Journey = Journey;
            // this.Itinerary = Itinerary;

            this.store = store;
            this.store.dispatch(terminalUpdate(configObj));

            this.Heartbeat = new HeartbeatConstructor({
                store,
                initialData: _.get(configObj, 'heartbeat', {}),
                isNative
            });

            SimpozioClass.instance = this;
        } else {
            if (heartbeat === false) {
                SimpozioClass.instance.Heartbeat.stop();
            }
            return SimpozioClass.instance;
        }
    }

    config = configObj => {
        const {heartbeat} = _.get(configObj, 'data', {});

        this.store.dispatch(terminalUpdate(configObj));

        if (SimpozioClass.instance && heartbeat === false) {
            SimpozioClass.instance.Heartbeat.stop();
        }
    };
}
