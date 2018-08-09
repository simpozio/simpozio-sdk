// @flow
import _ from 'lodash';
import {NEXT_DO_INVALIDATE, NEXT_DO_NEXT} from './const';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';
import moment from 'moment/moment';

export type SmpzNextModelType = {
    lastDoNext: number,
    lastDoInvalidate: number
};

const initialState = {
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
        default: {
            return next;
        }
    }
};
