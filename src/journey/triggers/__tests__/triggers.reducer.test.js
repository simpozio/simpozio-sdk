import _ from 'lodash';
import reducer from '../reducer.js';
import uuidv4 from 'uuid/v4';

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
                    {uri: 'e1'},
                    {
                        sequence: [makeInteraction({uri: 'e2'}), makeInteraction({uri: 'e3'})]
                    }
                ),
                makeInteraction(
                    {uri: 'e4'},
                    {
                        sequence: [
                            makeInteraction(
                                {uri: 'e5'},
                                {
                                    variants: [
                                        makeInteraction({uri: 'e7'}),
                                        makeInteraction(
                                            {uri: 'e8'},
                                            {
                                                choice: [makeInteraction({uri: 'e9'}), makeInteraction({uri: 'e10'})]
                                            }
                                        )
                                    ]
                                }
                            ),
                            makeInteraction({uri: 'e6'})
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
        const t1 = makeTrigger({id: 't1'});
        const t2 = makeTrigger({id: 't2'});

        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: t1
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: t2
            }
        });

        expect(_.find(result2.items, {localId: t1.localId})).toBeDefined();
        expect(_.find(result2.items, {localId: t2.localId})).toBeDefined();
    });

    test(`${TRIGGERS_ADD} Array`, () => {
        const t1 = makeTrigger({id: 't1'});
        const t2 = makeTrigger({id: 't2'});
        const t3 = makeTrigger({id: 't3'});

        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: t1
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [t2, t3]
            }
        });

        expect(_.find(result2.items, {localId: t1.localId})).toBeDefined();
        expect(_.find(result2.items, {localId: t2.localId})).toBeDefined();
        expect(_.find(result2.items, {localId: t3.localId})).toBeDefined();
    });

    test(`${TRIGGERS_REMOVE} One`, () => {
        const t1 = makeTrigger({id: 't1'});
        const t2 = makeTrigger({id: 't2'});
        const t3 = makeTrigger({id: 't3'});

        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [t1, t2, t3]
            }
        });

        const result3 = reducer(result1, {
            type: TRIGGERS_REMOVE,
            payload: {
                triggers: 't3'
            }
        });

        expect(_.find(result3.items, {localId: t1.localId})).toBeDefined();
        expect(_.find(result3.items, {localId: t2.localId})).toBeDefined();
        expect(_.find(result3.items, {localId: t3.localId})).toBeUndefined();
    });

    test(`${TRIGGERS_REMOVE} Array`, () => {
        const t1 = makeTrigger({id: 't1'});
        const t2 = makeTrigger({id: 't2'});
        const t3 = makeTrigger({id: 't3'});

        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [t1, t2, t3]
            }
        });

        const result3 = reducer(result1, {
            type: TRIGGERS_REMOVE,
            payload: {
                triggers: ['t3', 't2']
            }
        });

        expect(_.find(result3.items, {localId: t1.localId})).toBeDefined();
        expect(_.find(result3.items, {localId: t2.localId})).toBeUndefined();
        expect(_.find(result3.items, {localId: t3.localId})).toBeUndefined();
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

        expect(_.map(result2.suggest.items, 'triggerDescriptor')).toEqual(['t2', 't1']);
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

        expect(_.map(result2.suggest.items, 'triggerDescriptor')).toEqual(['t2']);
    });
});
