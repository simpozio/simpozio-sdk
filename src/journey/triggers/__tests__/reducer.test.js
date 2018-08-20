import _ from 'lodash';
import reducer from '../reducer.js';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from '../const';
import {NEXT_DO_INVALIDATE} from '../../../next/const';
import {EXPERIENCES_ADD} from '../../experiences/const';
import {makeInteraction, makeTrigger} from '../../../../tools/test-helpers';

jest.unmock('moment');

const makeComplexExperience = () =>
    reducer(undefined, {
        type: EXPERIENCES_ADD,
        payload: {
            experiences: [
                makeInteraction(
                    {id: 'e1'},
                    {
                        sequence: [makeInteraction({id: 'e2'}), makeInteraction({id: 'e3'})]
                    }
                ),
                makeInteraction(
                    {id: 'e4'},
                    {
                        sequence: [
                            makeInteraction(
                                {id: 'e5'},
                                {
                                    variants: [
                                        makeInteraction({id: 'e7'}),
                                        makeInteraction(
                                            {id: 'e8'},
                                            {
                                                choice: [makeInteraction({id: 'e9'}), makeInteraction({id: 'e10'})]
                                            }
                                        )
                                    ]
                                }
                            ),
                            makeInteraction({id: 'e6'})
                        ]
                    }
                )
            ]
        }
    });

describe('Reducer Triggers', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'items')).toBeDefined();
    });

    test(`${TRIGGERS_ADD} One`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger({id: 't1'})
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger({id: 't2'})
            }
        });

        expect(_.get(result2, 'items.t1.id')).toBe('t1');
        expect(_.get(result2, 'items.t2.id')).toBe('t2');
    });

    test(`${TRIGGERS_ADD} Array`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger({id: 't1'})
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [makeTrigger({id: 't2'}), makeTrigger({id: 't3'})]
            }
        });

        expect(_.get(result2, 'items.t1.id')).toBe('t1');
        expect(_.get(result2, 'items.t2.id')).toBe('t2');
        expect(_.get(result2, 'items.t3.id')).toBe('t3');
    });

    test(`${TRIGGERS_REMOVE} One`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [makeTrigger({id: 't1'}), makeTrigger({id: 't2'}), makeTrigger({id: 't3'})]
            }
        });

        const result3 = reducer(result1, {
            type: TRIGGERS_REMOVE,
            payload: {
                triggers: 't1'
            }
        });

        expect(_.get(result3, 'items.t2.id')).toBe('t2');
        expect(_.get(result3, 'items.t3.id')).toBe('t3');
        expect(_.get(result3, 'items.t1')).toBeUndefined();
    });

    test(`${TRIGGERS_REMOVE} Array`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [makeTrigger({id: 't1'}), makeTrigger({id: 't2'}), makeTrigger({id: 't3'})]
            }
        });

        const result3 = reducer(result1, {
            type: TRIGGERS_REMOVE,
            payload: {
                triggers: ['t1', 't2']
            }
        });

        expect(_.get(result3, 'items.t3.id')).toBe('t3');
        expect(_.get(result3, 'items.t2')).toBeUndefined();
        expect(_.get(result3, 'items.t1')).toBeUndefined();
    });

    test(`${NEXT_DO_INVALIDATE} after`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [
                    makeTrigger({id: 't1', after: 'e1'}),
                    makeTrigger({id: 't2', after: 'e2'}),
                    makeTrigger({id: 't3', after: 'e3'})
                ]
            }
        });

        const result2 = reducer(result1, {
            type: NEXT_DO_INVALIDATE,
            payload: {
                interactions: {
                    done: {
                        e1: {
                            activity: 'a1',
                            timestamp: Date.now() - 10000
                        },
                        e2: {
                            activity: 'a2',
                            timestamp: Date.now() - 20000
                        }
                    }
                }
            }
        });

        expect(_.map(result2.suggest.items, 'triggerId')).toEqual(['t2', 't1']);
    });

    test(`${NEXT_DO_INVALIDATE} signal`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [
                    makeTrigger({id: 't1', on: 'test1-signal'}),
                    makeTrigger({id: 't2', on: 'test2-signal'}),
                    makeTrigger({id: 't3', on: 'test3-signal'})
                ]
            }
        });

        const result2 = reducer(result1, {
            type: NEXT_DO_INVALIDATE,
            payload: {
                signal: 'test2-signal'
            }
        });

        expect(_.map(result2.suggest.items, 'triggerId')).toEqual(['t2']);
    });
});
