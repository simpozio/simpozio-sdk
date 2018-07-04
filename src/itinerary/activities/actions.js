// @flow

import _ from 'lodash';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from './const';
import type {SmpzActivityType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const activivitesAddAction = (data?: SmpzActivityType | Array<SmpzActivityType>): SmpzReduxActionType => ({
    type: ACTIVITIES_ADD,
    payload: {
        activities: _.castArray(data)
    }
});

export const activivitesRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: ACTIVITIES_REMOVE,
    payload: {
        activities: _.castArray(data)
    }
});
