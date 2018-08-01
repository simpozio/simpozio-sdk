// @flow

import _ from 'lodash';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE, ACTIVITIES_REGISTER} from './const';
import type {SmpzActivityModelType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const activitiesAddAction = (
    data?: SmpzActivityModelType | Array<SmpzActivityModelType>
): SmpzReduxActionType => ({
    type: ACTIVITIES_ADD,
    payload: {
        activities: data
    }
});

export const activivitesRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: ACTIVITIES_REMOVE,
    payload: {
        activities: data
    }
});

export const activitiesRegisterAction = (data?: SmpzActivityModelType | Array<SmpzActivityModelType>): Function => {
    return (dispatch: Function, getState: Function) => {
        dispatch({
            type: ACTIVITIES_REGISTER,
            payload: {
                activities: data
            },
            meta: {
                offline: {
                    effect: {
                        url: '/self/activities',
                        method: 'post',
                        body: JSON.stringify(data),
                        terminal: _.get(getState(), 'terminal')
                    },
                    rollback: {
                        type: ACTIVITIES_REMOVE,
                        payload: {
                            activities: data
                        }
                    }
                }
            }
        });
    };
};
