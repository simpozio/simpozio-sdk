// @flow

import _ from 'lodash';
import {INTERACTIONS_ADD, INTERACTIONS_REMOVE} from './const';
import type {SmpzInteractionModelType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const interactionsAddAction = (
    data?: SmpzInteractionModelType | Array<SmpzInteractionModelType>
): SmpzReduxActionType => ({
    type: INTERACTIONS_ADD,
    payload: {
        interactions: _.castArray(data)
    }
});

export const interactionsRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: INTERACTIONS_REMOVE,
    payload: {
        interactions: _.castArray(data)
    }
});
