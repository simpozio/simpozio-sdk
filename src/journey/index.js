// @flow

import _ from 'lodash';
import {Store} from 'redux';

import Logger from '../simpozio/logger';
import Api from '../_api';
import type {SmpzTriggerType} from './triggers/reducer';
import type {SmpzExperiencesModelType} from './experiences/reducer';
import {triggersAddAction} from './triggers/actions';
import {experiencesAddAction} from './experiences/actions';
import type {SmpzInteractionModelType} from './interactions/reducer';
import type {SmpzGenericDataType} from '../simpozio/common/common.types';
import type {SmpzActivityModelType} from '../itinerary/activities/reducer';
import {activitiesRegisterAction} from '../itinerary/activities/actions';
import {nextDoInvalidate} from '../next/actions';

export type SmpzNextConstructorParamsType = {store: Store};

export type SmpzTriggerDoType = {
    interaction: string | SmpzInteractionModelType,
    wait: string,
    data: SmpzGenericDataType
};

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

    trigger(triggerId: string): Array<SmpzTriggerDoType> {
        const state = this.store.getState();
        const triggersDo = _.castArray(_.get(state, ['triggers', 'items', triggerId, 'do']));

        return _.map(triggersDo, (trigger: SmpzTriggerDoType): SmpzTriggerDoType =>
            _.assign({}, trigger, {
                interaction: _.get(state, ['interactions', 'items', trigger.interaction])
            })
        );
    }

    do({activity, signal}: {activity?: SmpzActivityModelType, signal?: string}) {
        const state = this.store.getState();
        const {interaction: interactionId} = activity || {};

        const experience = _.get(state, ['interaction', interactionId, 'experienceId']);
        const {touchpoint} = _.get(state, ['terminal']);
        if (activity) {
            this.store.dispatch(activitiesRegisterAction({...activity, experience, touchpoint}));
        }

        if (signal) {
            this.store.dispatch(nextDoInvalidate({signal}));
        }
    }

    addTriggers(triggers: Array<SmpzTriggerType>): Array<SmpzTriggerType> {
        this.store.dispatch(triggersAddAction(triggers));
        return _.get(this.store.getState(), 'triggers.items');
    }

    addExperiences(experiences: Array<SmpzExperiencesModelType>): Array<SmpzExperiencesModelType> {
        this.store.dispatch(experiencesAddAction(experiences));
        return _.get(this.store.getState(), 'experiences.items');
    }

    destroy() {}
}
