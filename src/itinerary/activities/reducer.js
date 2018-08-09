// @flow
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import _ from 'lodash';
import moment from 'moment';
import {ACTIVITIES_ADD, ACTIVITIES_REGISTER, ACTIVITIES_REMOVE} from './const';
import {getTimestampFromTimeframe} from '../../simpozio/common/common.helpers';
import {REHYDRATE} from 'redux-persist';

export type SmpzActivityModelType = {
    id?: string,
    type: string,
    gravity?: number,
    actor?: string,
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
    event?: string,
    location?: string,
    touchpoint?: string,
    input?: string | number | boolean | Array<mixed>,
    extras?: SmpzGenericDataType
};

export type SmpzActivityCollectionType = {
    lastUpdate: number,
    order: Array<string>,
    items: {[key: string]: SmpzActivityModelType}
};

const initialState = {
    lastUpdate: 0,
    order: [],
    items: {}
};

export default (
    activities: SmpzActivityCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzActivityCollectionType => {
    switch (action.type) {
        case ACTIVITIES_ADD:
        case ACTIVITIES_REGISTER: {
            const newActivities = _.castArray(_.get(action, 'payload.activities', []));
            const newItems = _.assign({}, activities.items, _.keyBy(newActivities, 'id'));

            if (
                _.every(
                    _.map(newActivities, 'id'),
                    (id: string): boolean => !_.isEmpty(_.get(activities, ['items', id]))
                )
            ) {
                return activities;
            }

            const newOrder = _.chain(newItems)
                .sortBy((item: SmpzActivityModelType): number => getTimestampFromTimeframe(item))
                .map('id')
                .valueOf();

            return _.assign({}, activities, {
                lastUpdate: _.isEmpty(newActivities) ? activities.lastUpdate : moment().toISOString(),
                order: newOrder,
                items: newItems
            });
        }
        case ACTIVITIES_REMOVE: {
            const newActivities = _.castArray(_.get(action, 'payload.activities', []));
            const newItems = _.omit(activities.items, newActivities);
            const newOrder = _.difference(activities.order, newActivities);

            return _.assign({}, activities, {
                lastUpdate: _.isEmpty(newActivities) ? activities.lastUpdate : moment().toISOString(),
                order: newOrder,
                items: newItems
            });
        }
        case REHYDRATE: {
            return _.assign({}, activities, {
                items: _.get(action, 'payload.activities.items', {}),
                order: _.get(action, 'payload.activities.order', [])
            });
        }
        default: {
            return activities;
        }
    }
};
