import _ from 'lodash';
import reducer from '../reducer.js';
import {INTERACTIONS_ADD, INTERACTIONS_REMOVE} from '../const';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../../experiences/const';

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

describe('Interactions', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'items')).toBeDefined();
    });

    test(`${INTERACTIONS_ADD} One`, () => {
        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: makeInteraction('e1')
            }
        });

        const result2 = reducer(result1, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: makeInteraction('e2')
            }
        });

        expect(_.get(result2, 'items.e1.id')).toBe('e1');
        expect(_.get(result2, 'items.e2.id')).toBe('e2');
    });

    test(`${INTERACTIONS_ADD} Array`, () => {
        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: makeInteraction('e1')
            }
        });

        const result2 = reducer(result1, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: [makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        expect(_.get(result2, 'items.e1.id')).toBe('e1');
        expect(_.get(result2, 'items.e2.id')).toBe('e2');
        expect(_.get(result2, 'items.e3.id')).toBe('e3');
    });

    test(`${INTERACTIONS_REMOVE} One`, () => {
        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: [makeInteraction('e1'), makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        const result3 = reducer(result1, {
            type: INTERACTIONS_REMOVE,
            payload: {
                interactions: 'e1'
            }
        });

        expect(_.get(result3, 'items.e2.id')).toBe('e2');
        expect(_.get(result3, 'items.e3.id')).toBe('e3');
        expect(_.get(result3, 'items.e1')).toBeUndefined();
    });

    test(`${INTERACTIONS_REMOVE} Array`, () => {
        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: [makeInteraction('e1'), makeInteraction('e2'), makeInteraction('e3')]
            }
        });

        const result3 = reducer(result1, {
            type: INTERACTIONS_REMOVE,
            payload: {
                interactions: ['e1', 'e2']
            }
        });

        expect(_.get(result3, 'items.e3.id')).toBe('e3');
        expect(_.get(result3, 'items.e2')).toBeUndefined();
        expect(_.get(result3, 'items.e1')).toBeUndefined();
    });

    test(`Linking`, () => {
        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: makeInteraction('e1', {
                    sequence: [makeInteraction('e2'), makeInteraction('e3')]
                })
            }
        });

        expect(_.get(result1, 'items.e1.id')).toBe('e1');
        expect(_.get(result1, 'items.e1.sequence')).toEqual(['e2', 'e3']);
    });

    test(EXPERIENCES_ADD, () => {
        const result1 = reducer(undefined, {
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

        expect(_.every(['e2', 'e3', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], id => _.get(result1, 'items.' + id))).toEqual(
            true
        );
        expect(_.get(result1, 'items.e5.variants')).toEqual(['e7', 'e8']);
    });

    test(EXPERIENCES_REMOVE, () => {
        const result1 = reducer(undefined, {
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
        const result2 = reducer(result1, {
            type: EXPERIENCES_REMOVE,
            payload: {
                experiences: 'e4'
            }
        });

        console.log(result2);

        expect(_.every(['e2', 'e3'], id => _.get(result2, 'items.' + id))).toEqual(true);
    });
});
