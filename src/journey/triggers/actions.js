// @flow

import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from './const';
import type {SmpzTriggerType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const triggersAddAction = (data?: SmpzTriggerType | Array<SmpzTriggerType>): SmpzReduxActionType => ({
    type: TRIGGERS_ADD,
    payload: {
        triggers: _.map(
            _.castArray(data),
            (item: SmpzTriggerType): SmpzTriggerType => (!item.localId ? _.assign({}, item, {localId: uuidv4()}) : item)
        )
    }
});

export const triggersRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: TRIGGERS_REMOVE,
    payload: {
        triggers: _.castArray(data)
    }
});
