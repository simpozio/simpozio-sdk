// @flow

import _ from 'lodash';
import Raven from 'raven-js';
import {Store} from 'redux';
import {terminalUpdateAction} from '../_terminal/actions';
import Heartbeat from '../heartbeat';
import JourneyConstructor from '../journey';
import ItineraryConstructor from '../itinerary';
import NextConstructor from '../next';

import type {SmpzTerminalModelType} from '../_terminal/reducer';
import type {SmpzHeartbeatModelType} from '../heartbeat/reducer';

import {initStore} from './store';

Raven.config('https://462138e6f6724b9f8fd61e288ddef7e3@sentry.io/1237517').install();

export type SmpzParamsType = SmpzTerminalModelType & {
    heartbeat: SmpzHeartbeatModelType
};

export type SmpzConstructorType = {config?: SmpzTerminalModelType, heartbeat: Class<Heartbeat>, storage?: Storage};

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
    Journey: JourneyConstructor;
    Next: NextConstructor;
    Itinerary: ItineraryConstructor;

    constructor({config: configObj, heartbeat: HeartbeatConstructor, storage}: SmpzConstructorType): SimpozioClass {
        const {heartbeat} = _.get(configObj, 'data', {});

        if (!SimpozioClassInstance) {
            this.name = 'Simpozio';
            const store = initStore(storage);
            this.store = store;

            this.Journey = new JourneyConstructor({store});
            this.Itinerary = new ItineraryConstructor({store});
            this.Next = new NextConstructor({store});
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
