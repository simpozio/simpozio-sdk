import _ from 'lodash';
import reducer from '../reducer.js';
import {INTERACTIONS_ADD, INTERACTIONS_REMOVE} from '../const';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../../experiences/const';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from '../../../itinerary/activities/const';
import uuidv4 from 'uuid/v4';

jest.unmock('moment');

const makeInteraction = (id, data) =>
    _.assign(
        {},
        {
            localId: uuidv4(),
            uri: id,
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

describe('Reducer Interactions', () => {
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

        expect(_.find(result2.items, {uri: 'e1'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e2'})).toBeDefined();
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

        expect(_.find(result2.items, {uri: 'e1'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e2'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e3'})).toBeDefined();
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

        expect(_.find(result3.items, {uri: 'e1'})).toBeUndefined();
        expect(_.find(result3.items, {uri: 'e2'})).toBeDefined();
        expect(_.find(result3.items, {uri: 'e3'})).toBeDefined();
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

        expect(_.find(result3.items, {uri: 'e1'})).toBeUndefined();
        expect(_.find(result3.items, {uri: 'e2'})).toBeUndefined();
        expect(_.find(result3.items, {uri: 'e3'})).toBeDefined();
    });

    test(`Linking`, () => {
        const i2 = makeInteraction('e2');
        const i3 = makeInteraction('e3');
        const i1 = makeInteraction('e1', {
            sequence: [i2, i3]
        });

        const result1 = reducer(undefined, {
            type: INTERACTIONS_ADD,
            payload: {
                interactions: i1
            }
        });

        expect(_.find(result1.items, {uri: 'e1'})).toBeDefined();
        expect(_.get(_.find(result1.items, {uri: 'e1'}), 'sequence[0]')).toEqual({localId: i2.localId, uri: i2.uri});
        expect(_.get(_.find(result1.items, {uri: 'e1'}), 'sequence[1]')).toEqual({localId: i3.localId, uri: i3.uri});
    });

    test(EXPERIENCES_ADD, () => {
        const result1 = makeComplexExperience();

        expect(_.every(['e2', 'e3', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], uri => _.find(result1.items, {uri}))).toEqual(
            true
        );
        expect(_.get(_.find(result1.items, {uri: 'e5'}), 'variants[0].uri')).toEqual('e7');
        expect(_.get(_.find(result1.items, {uri: 'e5'}), 'variants[1].uri')).toEqual('e8');
    });

    test(EXPERIENCES_REMOVE, () => {
        const result1 = makeComplexExperience();

        const result2 = reducer(result1, {
            type: EXPERIENCES_REMOVE,
            payload: {
                experiences: 'e4'
            }
        });

        expect(_.every(['e2', 'e3'], uri => _.find(result2.items, {uri}))).toEqual(true);
    });

    test(ACTIVITIES_ADD, () => {
        const result1 = makeComplexExperience();
        const localId = uuidv4();

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    localId,
                    type: 'event',
                    actor: 'u1',
                    timeframe: {
                        actual: {
                            start: 123
                        }
                    },
                    interaction: 'e2'
                }
            }
        });

        expect(_.get(result2, 'done.e2.timestamp')).toEqual(123);
        expect(_.get(result2, 'done.e2.activity')).toEqual('a1');
    });

    test(ACTIVITIES_ADD, () => {
        const result1 = makeComplexExperience();
        const localId = uuidv4();

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    localId,
                    type: 'event',
                    actor: 'u1',
                    timeframe: {
                        actual: {
                            start: 123
                        }
                    },
                    interaction: 'e2'
                }
            }
        });

        const result3 = reducer(result2, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: ['a1']
            }
        });

        expect(_.get(result3, 'done.e2')).toBeUndefined();
    });
});
