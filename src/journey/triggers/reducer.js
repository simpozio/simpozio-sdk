// @flow
import _ from 'lodash';
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from './const';
import {NEXT_INVALIDATE} from '../../next/const';

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
    suggest: Array<SmpzTriggerSuggestType>,
    items: {[key: string]: SmpzTriggerType}
};

export type SmpzTriggerSuggestType = {triggerId: string, rank: number};

const initialState = {
    suggest: [],
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
        case NEXT_INVALIDATE: {
            const interactionsDone = _.get(action, 'payload.interactions.done', {});

            const suggest = _.chain(triggers)
                .get('items')
                .map((trigger: SmpzTriggerType): SmpzTriggerSuggestType | void => {
                    const after = _.get(trigger, 'if.conditions.after');
                    const {timestamp} = _.get(interactionsDone, after, {});

                    if (_.isString(after) && timestamp) {
                        // TODO: make right normalization
                        return {triggerId: trigger.id, rank: 1 - (Date.now() - timestamp) / 10000000000};
                    }
                })
                .compact()
                .sort((trigger: SmpzTriggerSuggestType): number => trigger.rank)
                .valueOf();

            return _.assign({}, triggers, {
                suggest
            });
        }
        default: {
            return triggers;
        }
    }
};
