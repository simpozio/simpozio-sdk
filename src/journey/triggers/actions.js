// @flow

import _ from 'lodash';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from './const';
import type {SmpzTriggerType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const triggersAddAction = (data?: SmpzTriggerType | Array<SmpzTriggerType>): SmpzReduxActionType => ({
    type: TRIGGERS_ADD,
    payload: {
        triggers: _.castArray(data)
    }
});

export const triggersRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: TRIGGERS_REMOVE,
    payload: {
        triggers: _.castArray(data)
    }
});
