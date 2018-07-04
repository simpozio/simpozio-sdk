import _ from 'lodash';
import reducer from '../reducer.js';
import {TRIGGERS_ADD, TRIGGERS_REMOVE} from '../const';

jest.unmock('moment');

const makeTrigger = id => ({
    id: id,
    priority: 1,
    do: [
        {
            interaction: 'i_' + id
        }
    ]
});

describe('Activities', () => {
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
});
