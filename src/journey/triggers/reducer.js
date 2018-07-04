// @flow
import _ from 'lodash';
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from './const';

//
export type SmpzTriggerType = {
    id: string,
    caption?: string,
    touchpoints?: Array<string>,
    priority: number,
    if?: {
        conditions?: {
            after?: string | {|interaction: string, choice?: string|},
            on?: Array<string>
        }
    },
    do: Array<{|interaction: string, wait: string, data?: SmpzGenericDataType|}>
};

export type SmpzTriggerCollectionType = {
    items: {[key: string]: SmpzTriggerType}
};

const initialState = {
    items: {}
};

export default (
    triggers: SmpzTriggerCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzTriggerCollectionType => {
    switch (action.type) {
        case TRIGGERS_ADD: {
            const newTriggers = _.castArray(_.get(action, 'payload.triggers', []));
            const newItems = _.assign({}, triggers.items, _.keyBy(newTriggers, 'id'));

            return _.assign({}, triggers, {
                items: newItems
            });
        }
        case TRIGGERS_REMOVE: {
            const newTriggers = _.get(action, 'payload.triggers', []);
            const newItems = _.omit(triggers.items, newTriggers);

            return _.assign({}, triggers, {
                items: newItems
            });
        }
        default: {
            return triggers;
        }
    }
};
