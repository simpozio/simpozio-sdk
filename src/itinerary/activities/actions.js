// @flow

import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE, ACTIVITIES_REGISTER} from './const';
import type {SmpzActivityModelType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';

export const activitiesAddAction = (data?: SmpzActivityModelType | Array<SmpzActivityModelType>): Function => {
    return (dispatch: Function, getState: Function) => {
        dispatch({
            type: ACTIVITIES_ADD,
            payload: {
                interactions: _.get(getState(), 'interactions'),
                activities: data
            }
        });
    };
};

export const activivitesRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: ACTIVITIES_REMOVE,
    payload: {
        activities: data
    }
});

export const activitiesRegisterAction = (data?: SmpzActivityModelType | Array<SmpzActivityModelType>): Function => {
    const activity = _.assign({}, data, {
        id: uuidv4()
    });

    return (dispatch: Function, getState: Function) => {
        dispatch({
            type: ACTIVITIES_REGISTER,
            payload: {
                interactions: _.get(getState(), 'interactions'),
                activities: activity
            },
            meta: {
                offline: {
                    effect: {
                        url: '/self/activities',
                        method: 'post',
                        data: activity,
                        terminal: _.get(getState(), 'terminal')
                    } /*,
                    rollback: {
                        type: ACTIVITIES_REMOVE,
                        meta: {
                            activities: activity.id
                        }
                    }*/
                }
            }
        });
    };
};
