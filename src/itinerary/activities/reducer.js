// @flow
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import _ from 'lodash';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from './const';
import {getTimestampFromTimeframe} from '../../simpozio/common/common.helpers';

export type SmpzActivityType = {
    id: string,
    type: string,
    gravity?: number,
    actor: string,
    status?: string,
    timeframe?: {
        planned?: {
            start: string,
            end?: string,
            duration?: string | number
        },
        estimated?: {
            start: string,
            end?: string,
            duration?: string | number
        },
        actual?: {
            start: string,
            end?: string,
            duration?: string | number
        }
    },
    companions?: Array<string>,
    experience?: string,
    interaction: string,
    trigger: string,
    event: string,
    location?: string,
    touchpoint?: string,
    input?: string | number | boolean | Array<mixed>,
    extras?: SmpzGenericDataType
};

export type SmpzActivityCollectionType = {
    order: Array<string>,
    items: {[key: string]: SmpzActivityType}
};

const initialState = {
    order: [],
    items: {}
};

export default (
    activities: SmpzActivityCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzActivityCollectionType => {
    switch (action.type) {
        case ACTIVITIES_ADD: {
            const newActivities = _.castArray(_.get(action, 'payload.activities', []));
            const newItems = _.assign({}, activities.items, _.keyBy(newActivities, 'id'));

            const newOrder = _.chain(newItems)
                .sortBy((item: SmpzActivityType): Array<SmpzActivityType> => getTimestampFromTimeframe(item))
                .map('id')
                .valueOf();

            return _.assign({}, activities, {
                order: newOrder,
                items: newItems
            });
        }
        case ACTIVITIES_REMOVE: {
            const newActivities = _.get(action, 'payload.activities', []);
            const newItems = _.omit(activities.items, newActivities);
            const newOrder = _.difference(activities.order, newActivities);

            return _.assign({}, activities, {
                order: newOrder,
                items: newItems
            });
        }
        default: {
            return activities;
        }
    }
};
