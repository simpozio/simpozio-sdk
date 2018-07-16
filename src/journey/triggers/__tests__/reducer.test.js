import _ from 'lodash';
import reducer from '../reducer.js';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from '../const';
import {NEXT_INVALIDATE} from '../../../next/const';
import {EXPERIENCES_ADD} from '../../experiences/const';

jest.unmock('moment');

const makeTrigger = (id, after) => ({
    id: id,
    priority: 1,
    if: {
        conditions: {
            after
        }
    },
    do: [
        {
            interaction: 'i_' + id
        }
    ]
});

const makeActivity = (id, timestamp, interaction) => ({
    id: id,
    actor: 'actor',
    interaction: interaction,
    trigger: 'trigger',
    event: 'event',
    timeframe: {
        actual: {
            start: timestamp
        }
    }
});

const makeInteraction = (id, data) =>
    _.assign(
        {},
        {
            id: id,
            type: 'event'
        },
        data
    );

const makeComplexExperience = () =>
    reducer(undefined, {
        type: EXPERIENCES_ADD,
        payload: {
            experiences: [
                makeInteraction('e1', {
                    sequence: [makeInteraction('e2'), makeInteraction('e3')]
                }),
                makeInteraction('e4', {
                    sequence: [
                        makeInteraction('e5', {
                            variants: [
                                makeInteraction('e7'),
                                makeInteraction('e8', {
                                    choice: [makeInteraction('e9'), makeInteraction('e10')]
                                })
                            ]
                        }),
                        makeInteraction('e6')
                    ]
                })
            ]
        }
    });

describe('Triggers', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'items')).toBeDefined();
    });

    test(`${TRIGGERS_ADD} One`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger('t1')
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger('t2')
            }
        });

        expect(_.get(result2, 'items.t1.id')).toBe('t1');
        expect(_.get(result2, 'items.t2.id')).toBe('t2');
    });

    test(`${TRIGGERS_ADD} Array`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: makeTrigger('t1')
            }
        });

        const result2 = reducer(result1, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [makeTrigger('t2'), makeTrigger('t3')]
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
                triggers: [makeTrigger('t1'), makeTrigger('t2'), makeTrigger('t3')]
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
                triggers: [makeTrigger('t1'), makeTrigger('t2'), makeTrigger('t3')]
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

    test(`${NEXT_INVALIDATE} after`, () => {
        const result1 = reducer(undefined, {
            type: TRIGGERS_ADD,
            payload: {
                triggers: [makeTrigger('t1', 'e1'), makeTrigger('t2', 'e2'), makeTrigger('t3', 'e3')]
            }
        });

        const result2 = reducer(result1, {
            type: NEXT_INVALIDATE,
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
});
