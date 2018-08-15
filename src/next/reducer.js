// @flow
import _ from 'lodash';
import {NEXT_DO_INVALIDATE, NEXT_DO_NEXT, NEXT_SET_WAIT_FOR} from './const';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';
import moment from 'moment/moment';
import {ACTIVITIES_ADD, ACTIVITIES_REGISTER} from '../itinerary/activities/const';

export type SmpzNextModelType = {
    waitFor: Array<string>,
    lastDoNext: number,
    lastDoInvalidate: number
};

const initialState = {
    waitFor: [],
    lastDoNext: 0,
    lastDoInvalidate: moment().toISOString()
};

export default (next: SmpzNextModelType = initialState, action: SmpzReduxActionType): SmpzNextModelType => {
    switch (action.type) {
        case NEXT_DO_INVALIDATE: {
            return _.assign({}, next, {
                lastDoInvalidate: moment().toISOString()
            });
        }
        case NEXT_DO_NEXT: {
            return _.assign({}, next, {
                lastDoNext: moment().toISOString()
            });
        }
        case NEXT_SET_WAIT_FOR: {
            return _.assign({}, next, {
                waitFor: _.map(_.get(action, 'payload.interactions'), 'id')
            });
        }
        case ACTIVITIES_ADD:
        case ACTIVITIES_REGISTER: {
            return _.assign({}, next, {
                waitFor: _.difference(
                    next.waitFor,
                    _.map(_.castArray(_.get(action, 'payload.activities')), 'interaction')
                )
            });
        }
        default: {
            return next;
        }
    }
};
