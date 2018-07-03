// @flow

import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from './const';
import type {SmpzActivityType} from './reducer';

export const activivitesAddAction = (data?: SmpzActivityType | Array<SmpzActivityType>): SmpzReduxActionType => ({
    type: ACTIVITIES_ADD,
    payload: {
        activities: _.castArray(data)
    }
});

export const activivitesRemoveAction = (data?: SmpzActivityType | Array<SmpzActivityType>): SmpzReduxActionType => ({
    type: ACTIVITIES_REMOVE,
    payload: {
        activities: _.castArray(data)
    }
});
