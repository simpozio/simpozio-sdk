import _ from 'lodash';
import reducer from '../reducer.js';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../const';

jest.unmock('moment');

const makeInteraction = (id, data) =>
    _.assign(
        {},
        {
            id: id,
            type: 'event'
        },
        data
    );

describe('Experiences', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'items')).toBeDefined();
    });

    test(`${EXPERIENCES_ADD} One`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: makeInteraction('e1')
            }
        });

        const result2 = reducer(result1, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: makeInteraction('e2')
            }
        });

        expect(_.get(result2, 'items.e1.id')).toBe('e1');
        expect(_.get(result2, 'items.e2.id')).toBe('e2');
    });

    test(`${EXPERIENCES_ADD} Array`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: makeInteraction('e1')
            }
        });

        const result2 = reducer(result1, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: [makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        expect(_.get(result2, 'items.e1.id')).toBe('e1');
        expect(_.get(result2, 'items.e2.id')).toBe('e2');
        expect(_.get(result2, 'items.e3.id')).toBe('e3');
    });

    test(`${EXPERIENCES_REMOVE} One`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: [makeInteraction('e1'), makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        const result3 = reducer(result1, {
            type: EXPERIENCES_REMOVE,
            payload: {
                experiences: 'e1'
            }
        });

        expect(_.get(result3, 'items.e2.id')).toBe('e2');
        expect(_.get(result3, 'items.e3.id')).toBe('e3');
        expect(_.get(result3, 'items.e1')).toBeUndefined();
    });

    test(`${EXPERIENCES_REMOVE} Array`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: [makeInteraction('e1'), makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        const result3 = reducer(result1, {
            type: EXPERIENCES_REMOVE,
            payload: {
                experiences: ['e1', 'e2']
            }
        });

        expect(_.get(result3, 'items.e3.id')).toBe('e3');
        expect(_.get(result3, 'items.e2')).toBeUndefined();
        expect(_.get(result3, 'items.e1')).toBeUndefined();
    });

    test(`Linking`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: makeInteraction('e1', {
                    sequence: [makeInteraction('e2'), makeInteraction('e3')]
                })
            }
        });

        expect(_.get(result1, 'items.e1.id')).toBe('e1');
        expect(_.get(result1, 'items.e1.sequence')).toEqual(['e2', 'e3']);
    });
});
