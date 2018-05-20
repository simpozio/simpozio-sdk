import _ from 'lodash';
import {createStore} from 'redux';
import reducers from './src/reducers';
import HeartbeatConstructor from './src/heartbeat';
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
export default class Simpozio {
    constructor(configObj, isNative = false) {
        const {heartbeat} = _.get(configObj, 'data', {});

        if (!Simpozio.instance) {
            const store = createStore(reducers);
            // const Journey = new JourneyConstructor({store, initialData: journeys, isNative});
            // const Itinerary = new ItineraryConstructor({store, initialData: itinerary, isNative});

            // this.Journey = Journey;
            // this.Itinerary = Itinerary;

            this.Heartbeat = new HeartbeatConstructor({store, initialData: heartbeat, isNative});
            this.store = store;

            Simpozio.instance = this;
        } else {
            if (heartbeat === false) {
                Simpozio.instance.Heartbeat.stop();
            }
            return Simpozio.instance;
        }
    }

    config = configObj => {
        const {heartbeat} = _.get(configObj, 'data', {});

        this.store.dispatch(terminalUpdate(configObj));

        if (Simpozio.instance && heartbeat === false) {
            Simpozio.instance.Heartbeat.stop();
        }
    };
}
