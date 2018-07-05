//@flow

import _ from 'lodash';
import {Dispatch, Store} from 'redux';
import {NEXT_INVALIDATE} from './const';
import type {SmpzTriggerType} from '../journey/triggers/reducer';
import {TRIGGERS_ADD} from '../journey/triggers/const';

export const nextInvalidate = ({
    mapMiddleware,
    reduceMiddleware
}: {
    mapMiddleware: Function,
    reduceMiddleware: Function
}): Function => {
    return (dispatch: Dispatch, getState: () => Store): Promise<mixed> => {
        const invalidate = (): Promise<void> => {
            const state = getState();

            return dispatch({
                type: NEXT_INVALIDATE,
                payload: {
                    interactions: state.interactions,
                    triggers: state.triggers,
                    activities: state.activities,
                    experiences: state.experiences,
                    terminal: state.terminal
                }
            });
        };

        if (mapMiddleware) {
            const state = getState();

            return mapMiddleware({
                interactions: state.interactions,
                triggers: state.triggers,
                activities: state.activities,
                experiences: state.experiences,
                terminal: state.terminal
            })
                .then(({triggers}: {triggers: Array<SmpzTriggerType>}): Promise<{triggers: SmpzTriggerType}> => {
                    const state = getState();

                    dispatch({
                        type: TRIGGERS_ADD,
                        payload: {
                            triggers
                        }
                    });

                    if (reduceMiddleware) {
                        return reduceMiddleware({
                            interactions: state.interactions,
                            triggers: state.triggers,
                            activities: state.activities,
                            experiences: state.experiences,
                            terminal: state.terminal
                        });
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
            const state = getState();

            return reduceMiddleware({
                interactions: state.interactions,
                triggers: state.triggers,
                activities: state.activities,
                experiences: state.experiences,
                terminal: state.terminal
            }).then(({triggers}: {triggers: Array<SmpzTriggerType>}): Promise<mixed> => {
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
