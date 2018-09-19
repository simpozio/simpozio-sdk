//@flow

import _ from 'lodash';
import {Dispatch, Store} from 'redux';
import {NEXT_DO_INVALIDATE, NEXT_DO_NEXT, NEXT_SET_WAIT_FOR} from './const';
import {TRIGGERS_ADD} from '../journey/triggers/const';

import type {SmpzTriggerCollectionType, SmpzTriggerType} from '../journey/triggers/reducer';
import type {SmpzInteractionModelType, SmpzInteractionsCollectionType} from '../journey/interactions/reducer';
import type {SmpzActivityCollectionType} from '../itinerary/activities/reducer';
import type {SmpzExperiencesCollectionType} from '../journey/experiences/reducer';
import type {SmpzTerminalModelType} from '../_terminal/reducer';
import type {SmpzReduxActionType} from '../simpozio/common/common.types';

export type SmpzContextType = {
    interactions: SmpzInteractionsCollectionType,
    triggers: SmpzTriggerCollectionType,
    activities: SmpzActivityCollectionType,
    experiences: SmpzExperiencesCollectionType,
    terminal: SmpzTerminalModelType
};

const makeContext = (state: Store = {}): SmpzContextType => ({
    interactions: state.interactions,
    triggers: state.triggers,
    activities: state.activities,
    experiences: state.experiences,
    terminal: state.terminal
});

export const nextDoNext = (): SmpzReduxActionType => ({
    type: NEXT_DO_NEXT
});

export const nextDoInvalidate = (
    params?: {
        mapMiddleware?: Function,
        reduceMiddleware?: Function,
        signal?: string
    } = {}
): Function => {
    const {mapMiddleware, reduceMiddleware, signal} = params;
    return (dispatch: Dispatch, getState: () => Store): Promise<mixed> => {
        const invalidate = (): Promise<void> => {
            return dispatch({
                type: NEXT_DO_INVALIDATE,
                payload: _.assign({}, makeContext(getState()), {signal})
            });
        };

        if (mapMiddleware) {
            return mapMiddleware(makeContext(getState()))
                .then(({triggers}: {triggers: Array<SmpzTriggerType>}): Promise<{triggers: SmpzTriggerType}> => {
                    const state = getState();

                    dispatch({
                        type: TRIGGERS_ADD,
                        payload: {
                            triggers
                        }
                    });

                    if (reduceMiddleware) {
                        return reduceMiddleware(makeContext(getState()));
                    }

                    return Promise.resolve({triggers: _.get(state, 'triggers.items')});
                })
                .then(({triggers}: {triggers: Array<SmpzTriggerType>}): Promise<mixed> => {
                    dispatch({
                        type: TRIGGERS_ADD,
                        payload: {
                            triggers
                        }
                    });

                    return invalidate();
                });
        } else if (reduceMiddleware) {
            return reduceMiddleware(
                makeContext(getState())
            ).then(({triggers}: {triggers: Array<SmpzTriggerType>}): Promise<mixed> => {
                dispatch({
                    type: TRIGGERS_ADD,
                    payload: {
                        triggers
                    }
                });

                return invalidate();
            });
        } else {
            return invalidate();
        }
    };
};
