// @flow

import _ from 'lodash';
import {Store} from 'redux';

import Logger from '../simpozio/logger';
import Api from '../api';
import type {SmpzTriggerType} from './triggers/reducer';
import type {SmpzExperiencesModelType} from './experiences/reducer';
import {triggersAddAction} from './triggers/actions';
import {experiencesAddAction} from './experiences/actions';

export type SmpzNextConstructorParamsType = {store: Store};

export default class Journey {
    name: string;
    store: Store;
    logger: Logger;
    api: Api;

    constructor({store}: SmpzNextConstructorParamsType) {
        this.name = 'Journey';

        this.store = store;
        this.logger = new Logger({store, name: this.name});
        this.api = new Api({store});
    }

    addTriggers(triggers: Array<SmpzTriggerType>): Array<SmpzTriggerType> {
        this.store.dispatch(triggersAddAction(triggers));
        return _.get(this.store.getState(), 'triggers.items');
    }

    addExperiencies(experiences: Array<SmpzExperiencesModelType>): Array<SmpzExperiencesModelType> {
        this.store.dispatch(experiencesAddAction(experiences));
        return _.get(this.store.getState(), 'experiences.items');
    }
}
