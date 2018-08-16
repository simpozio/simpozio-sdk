import _ from 'lodash';
import moment from 'moment';
import reducer from '../reducer.js';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../const';
import {ACTIVITIES_REGISTER} from '../../../itinerary/activities/const';

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

const makeActivity = (index, timestamp) => ({
    id: 'a' + index,
    actor: index,
    interaction: 'i' + index,
    trigger: 't' + index,
    event: 'ev' + index,
    timeframe: {
        actual: {
            start: timestamp
        }
    }
});

describe('Reducer Experiences', () => {
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

    test(`Done`, () => {
        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: makeInteraction('e1', {
                    sequence: [makeInteraction('i2'), makeInteraction('i3')]
                })
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_REGISTER,
            payload: {
                activities: [makeActivity(2, moment().toISOString()), makeActivity(3, moment().toISOString())]
            }
        });
        expect(_.get(result2, 'done.[0]')).toBe('e1');
    });
});
