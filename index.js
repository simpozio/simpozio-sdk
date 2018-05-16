import _ from 'lodash';
import { createStore } from 'redux';
import reducers from './src/reducers';
import Journey from './src/journey';
import Itinerary from './src/itinerary';
import Terminal from './src/terminal';


/**
 * Create new Simpozio SDK instance
 * By default make anonymous auth, starts heartbeat and trace
 * @param config
 * @param config.data {object} — initial data for store
 * @param config.baseUrl {string} — url of Simpozio instance ('https://api.simpozio.com/v2' by default)
 * @param config.heartbeat {object|boolean} — config for heartbeat or 'false' to avoid heartbeat
 * @param config.trace {object|boolean} — config for trace or 'false' to avoid trace
 * @returns {{terminal, journey, itinerary}}
 */
export default function (config) {

    const data = _.get(config, data);
    const store = createStore(reducers);
    const journey = new Journey({store, initialData: _.get(data, 'journeys')});
    const itinerary = new Itinerary({store, initialData: _.get(data, 'itinerary')});
    const terminal = new Terminal({store, initialData: _.get(data, 'terminal')});

    return {
        journey,
        itinerary,
        terminal
    }
}
