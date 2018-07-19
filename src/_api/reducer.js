// @flow
import type {SmpzReduxActionType} from '../simpozio/common/common.types';
import type {SmpzApiRequestParamsType} from './index';

export type SmpzRequestModelType = {
    id: string,
    method: string,
    params: SmpzApiRequestParamsType,
    timestamp: number,
    priority: number
};

export type SmpzRequestsQueueCollectionType = Array<SmpzRequestModelType>;

const initialState = [];

export default (
    requestsQueue: SmpzRequestsQueueCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzRequestsQueueCollectionType => {
    switch (action.type) {
        default: {
            return requestsQueue;
        }
    }
};
