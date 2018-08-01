// @flow
import _ from 'lodash';
import {NEXT_INVALIDATE} from './const';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';
export type SmpzNextModelType = {
    lastNext: number,
    lastInvalidate: number
};

const initialState = {
    lastNext: Date.now(),
    lastInvalidate: Date.now()
};

export default (next: SmpzNextModelType = initialState, action: SmpzReduxActionType): SmpzNextModelType => {
    switch (action.type) {
        case NEXT_INVALIDATE: {
            return _.assign({}, next, {
                lastInvalidate: Date.now()
            });
        }
        default: {
            return next;
        }
    }
};
