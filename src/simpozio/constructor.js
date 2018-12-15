// @flow

import _ from 'lodash';
import {Store} from 'redux';
import {terminalUpdateAction} from '../_terminal/actions';
import Heartbeat from '../heartbeat';
import Ping from '../../native/ping';
import JourneyConstructor from '../journey';
import ItineraryConstructor from '../itinerary';
import NextConstructor from '../next';

import type {SmpzTerminalModelType} from '../_terminal/reducer';
import type {SmpzHeartbeatModelType} from '../heartbeat/reducer';

import {initStore} from './store';

export type SmpzParamsType = SmpzTerminalModelType & {
    heartbeat: SmpzHeartbeatModelType
};

export type SmpzConstructorType = {
    config?: SmpzTerminalModelType,
    heartbeat: Class<Heartbeat>,
    storage?: Storage,
    ping?: Class<Ping>
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
    Journey: JourneyConstructor;
    Next: NextConstructor;
    Itinerary: ItineraryConstructor;
    Ping: Ping;
    config: Function;

    constructor({
        config: configObj,
        heartbeat: HeartbeatConstructor,
        storage,
        ping: PingConstructor
    }: SmpzConstructorType): SimpozioClass {
        const heartbeat = _.get(configObj, 'heartbeat', {});
        const persist = _.get(configObj, 'persist', false);

        if (!SimpozioClassInstance) {
            this.name = 'Simpozio';
            const store = initStore(persist && storage);
            this.store = store;

            this.Journey = new JourneyConstructor({store});
            this.Itinerary = new ItineraryConstructor({store});
            this.Next = new NextConstructor({store});
            this.Heartbeat = new HeartbeatConstructor({
                store,
                initialData: heartbeat
            });

            if (PingConstructor) {
                this.Ping = new PingConstructor({store});
            }

            this.store.dispatch(terminalUpdateAction(configObj));

            SimpozioClassInstance = this;
        } else if (!_.isEmpty(configObj)) {
            SimpozioClassInstance.config(configObj);
        }

        if (heartbeat === false) {
            this.Heartbeat.stop();
        }

        this._type = 'SingletonModuleScopedInstance';
        this._created = new Date();

        return SimpozioClassInstance;
    }

    config(configObj: SmpzParamsType) {
        const {heartbeat, ping} = _.get(configObj, 'data', {});

        this.store.dispatch(terminalUpdateAction(configObj));

        if (SimpozioClassInstance && heartbeat) {
            this.Heartbeat.update(heartbeat);
        }

        if (ping === false && this.Ping) {
            this.Ping.stop();
        }
    }

    destroy() {
        this.Journey.destroy();
        this.Itinerary.destroy();
        this.Next.destroy();
        this.Heartbeat.destroy();

        if (this.Ping) {
            this.Ping.destroy();
        }

        SimpozioClassInstance = null;
    }
}
