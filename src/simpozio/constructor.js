// @flow

import _ from 'lodash';
import Raven from 'raven-js';
import {createStore, Store, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {terminalUpdateAction} from '../terminal/actions';
import Heartbeat from '../heartbeat';
import type {SmpzTerminalModelType} from '../terminal/reducer';
import type {SmpzHeartbeatModelType} from '../heartbeat/reducer';

Raven.config('https://7dfca467185c47b3b4d19ff309609a93@sentry.io/422986').install();

export type SmpzParamsType = SmpzTerminalModelType & {
    heartbeat: SmpzHeartbeatModelType
};

let SimpozioClassInstance: SimpozioClass | null = null;

/**
 * Create new Simpozio SDK instance
 * By default make anonymous auth, starts heartbeat and trace
 */
export default class SimpozioClass {
    name: string;
    store: Store;
    _type: string;
    _created: Date;
    Heartbeat: Heartbeat;

    constructor(configObj: SmpzTerminalModelType, HeartbeatConstructor: Class<Heartbeat>): SimpozioClass {
        const {heartbeat} = _.get(configObj, 'data', {});

        if (!SimpozioClassInstance) {
            this.name = 'Simpozio';
            const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk)));

            // const Journey = new JourneyConstructor({store, initialData: journeys, isNative});
            // const Itinerary = new ItineraryConstructor({store, initialData: itinerary, isNative});

            // this.Journey = Journey;
            // this.Itinerary = Itinerary;

            this.store = store;

            this.Heartbeat = new HeartbeatConstructor({
                store,
                initialData: _.get(configObj, 'heartbeat', {})
            });

            this.store.dispatch(terminalUpdateAction(configObj));

            SimpozioClassInstance = this;
        }

        if (heartbeat === false) {
            this.Heartbeat.stop();
        }

        this._type = 'SingletonModuleScopedInstance';
        this._created = new Date();

        return SimpozioClassInstance;
    }

    config(configObj: SmpzParamsType) {
        const {heartbeat} = _.get(configObj, 'data', {});

        this.store.dispatch(terminalUpdateAction(configObj));

        if (SimpozioClassInstance && heartbeat) {
            this.Heartbeat.update(heartbeat);
        }
    }
}
