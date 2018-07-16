//@flow

import _ from 'lodash';
import {Dispatch, Store} from 'redux';
import {NEXT_INVALIDATE} from './const';
import {TRIGGERS_ADD} from '../journey/triggers/const';

import type {SmpzTriggerCollectionType, SmpzTriggerType} from '../journey/triggers/reducer';
import type {SmpzInteractionsCollectionType} from '../journey/interactions/reducer';
import type {SmpzActivityCollectionType} from '../itinerary/activities/reducer';
import type {SmpzExperiencesCollectionType} from '../journey/experiences/reducer';
import type {SmpzTerminalModelType} from '../terminal/reducer';

export type SmpzContextType = {
    interactions: SmpzInteractionsCollectionType,
    triggers: SmpzTriggerCollectionType,
    activities: SmpzActivityCollectionType,
    experiences: SmpzExperiencesCollectionType,
    terminal: SmpzTerminalModelType
};

const makeContext = (state: Store): SmpzContextType => ({
    interactions: state.interactions,
    triggers: state.triggers,
    activities: state.activities,
    experiences: state.experiences,
    terminal: state.terminal
});

export const nextInvalidate = (
    params?: {
        mapMiddleware?: Function,
        reduceMiddleware?: Function
    } = {}
): Function => {
    const {mapMiddleware, reduceMiddleware} = params;
    return (dispatch: Dispatch, getState: () => Store): Promise<mixed> => {
        const invalidate = (): Promise<void> => {
            return dispatch({
                type: NEXT_INVALIDATE,
                payload: makeContext(getState())
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
