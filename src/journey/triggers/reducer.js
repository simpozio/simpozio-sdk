// @flow
import _ from 'lodash';
import moment from 'moment';
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from './const';
import {NEXT_DO_INVALIDATE} from '../../next/const';

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
    lastUpdate: number,
    suggest: {
        lastUpdate: number,
        items: Array<SmpzTriggerSuggestType>
    },
    items: {[key: string]: SmpzTriggerType}
};

export type SmpzTriggerSuggestType = {triggerId: string, rank: number};

const initialState = {
    lastUpdate: 0,
    suggest: {
        lastUpdate: 0,
        items: []
    },
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
                lastUpdate: moment().toISOString(),
                items: newItems
            });
        }
        case TRIGGERS_REMOVE: {
            const newTriggers = _.get(action, 'payload.triggers', []);
            const newItems = _.omit(triggers.items, newTriggers);

            return _.assign({}, triggers, {
                lastUpdate: moment().toISOString(),
                items: newItems
            });
        }
        case NEXT_DO_INVALIDATE: {
            const interactionsDone = _.get(action, 'payload.interactions.done', {});
            const activities = _.get(action, 'payload.activities.items', {});
            const signal = _.get(action, 'payload.signal', '');

            const suggest = _.chain(triggers)
                .get('items')
                .map((trigger: SmpzTriggerType): SmpzTriggerSuggestType | void => {
                    const after = _.get(trigger, 'if.conditions.after', {});
                    const on = _.get(trigger, 'if.conditions.on', []);
                    const {timestamp, activity: activityId} = _.get(interactionsDone, after, {});
                    const {input, interaction: activityInteraction} = _.get(activities, activityId, {});

                    if (signal && !_.isEmpty(on) && _.includes(on, signal)) {
                        return {
                            triggerId: trigger.id,
                            rank: 1
                        };
                    } else if (_.isString(after) && timestamp) {
                        // TODO: make right normalization
                        return {
                            triggerId: trigger.id,
                            rank: 1 - (moment().valueOf() - moment(timestamp).valueOf()) / 10000000000
                        };
                    } else if (_.isObject(after) && timestamp) {
                        const {interaction, choice} = after;
                        if (choice === input && activityInteraction === interaction) {
                            return {
                                triggerId: trigger.id,
                                rank: 1 - (moment().valueOf() - moment(timestamp).valueOf()) / 10000000000
                            };
                        }
                    }
                })
                .compact()
                .sort((trigger: SmpzTriggerSuggestType): number => trigger.rank)
                .take(5)
                .valueOf();

            const ifSuggerstUpdate =
                !_.isEmpty(suggest) &&
                !_.isEqual(_.map(_.get(triggers, 'suggest.items', []), 'triggerId'), _.map(suggest, 'triggerId'));

            return _.assign({}, triggers, {
                suggest: {
                    lastUpdate: ifSuggerstUpdate
                        ? moment().toISOString()
                        : _.get(triggers, 'suggest.lastUpdate', moment().toISOString()),
                    items: suggest
                }
            });
        }
        default: {
            return triggers;
        }
    }
};
