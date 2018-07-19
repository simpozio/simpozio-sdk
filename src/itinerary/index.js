// @flow

import _ from 'lodash';
import {Store} from 'redux';

import Logger from '../simpozio/logger';
import Api from '../_api';
import type {SmpzActivityModelType} from './activities/reducer';
import {activitiesAddAction} from './activities/actions';

export type SmpzNextConstructorParamsType = {store: Store};

export default class Itinerary {
    name: string;
    store: Store;
    logger: Logger;
    api: Api;

    constructor({store}: SmpzNextConstructorParamsType) {
        this.name = 'Itinerary';

        this.store = store;
        this.logger = new Logger({store, name: this.name});
        this.api = new Api({store});
    }

    addActivities(activities: Array<SmpzActivityModelType>): Array<SmpzActivityModelType> {
        this.store.dispatch(activitiesAddAction(activities));
        return _.get(this.store.getState(), 'activities.items');
    }
}
