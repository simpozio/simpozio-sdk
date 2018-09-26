import _ from 'lodash';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import reducer from '../reducer.js';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../const';
import {ACTIVITIES_REGISTER} from '../../../itinerary/activities/const';

jest.unmock('moment');
jest.unmock('uuid');

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

        expect(_.find(result2.items, {uri: 'e1'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e2'})).toBeDefined();
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

        expect(_.find(result2.items, {uri: 'e1'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e2'})).toBeDefined();
        expect(_.find(result2.items, {uri: 'e3'})).toBeDefined();
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

        expect(_.find(result3.items, {uri: 'e1'})).toBeUndefined();
        expect(_.find(result3.items, {uri: 'e2'})).toBeDefined();
        expect(_.find(result3.items, {uri: 'e3'})).toBeDefined();
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
            type: EXPERIENCES_ADD,
            payload: {
                experiences: i1
            }
        });

        expect(_.find(result1.items, {uri: 'e1'})).toBeDefined();
        expect(_.get(_.find(result1.items, {uri: 'e1'}), 'sequence[0]')).toEqual({localId: i2.localId, uri: i2.uri});
        expect(_.get(_.find(result1.items, {uri: 'e1'}), 'sequence[1]')).toEqual({localId: i3.localId, uri: i3.uri});
    });

    test(`Done`, () => {
        const i2 = makeInteraction('i2');
        const i3 = makeInteraction('i3');
        const i1 = makeInteraction('e1', {
            sequence: [i2, i3]
        });

        const result1 = reducer(undefined, {
            type: EXPERIENCES_ADD,
            payload: {
                experiences: i1
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_REGISTER,
            payload: {
                activities: [makeActivity(2, moment().toISOString()), makeActivity(3, moment().toISOString())]
            }
        });
        expect(_.get(result2, 'done.[0]')).toBe(i1.localId);
    });
});
