import _ from 'lodash';
import moment from 'moment';
import reducer from '../reducer.js';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from '../const';

jest.unmock('moment');

const makeActivity = (index, timestamp) => ({
    id: 'a' + index,
    actor: index,
    interaction: index,
    trigger: index,
    event: index,
    timeframe: {
        actual: {
            start: timestamp
        }
    }
});

describe('Activities', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'order')).toBeDefined();
        expect(_.get(result, 'items')).toBeDefined();
    });

    test(`${ACTIVITIES_ADD} One`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:34.660Z')
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('2', '2018-07-03T15:31:34.660Z')
            }
        });

        expect(_.get(result2, 'order')).toEqual(['a1', 'a2']);
        expect(_.get(result2, 'items.a2.id')).toBe('a2');
    });

    test(`${ACTIVITIES_ADD} lastUpdate`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:34.660Z')
            }
        });

        expect(moment(_.get(result1, 'lastUpdate')).valueOf()).toBeGreaterThan(0);
    });

    test(`${ACTIVITIES_ADD} Array`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:34.660Z')
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    makeActivity('2', '2018-07-03T15:31:45.660Z'),
                    makeActivity('3', '2018-07-03T15:31:35.660Z')
                ]
            }
        });

        expect(_.get(result2, 'order')).toEqual(['a1', 'a3', 'a2']);
        expect(_.get(result2, 'items.a2.id')).toBe('a2');
    });

    test(`${ACTIVITIES_REMOVE} One`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:35.660Z')
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    makeActivity('2', '2018-07-03T15:31:45.660Z'),
                    makeActivity('3', '2018-07-03T15:31:35.660Z')
                ]
            }
        });

        const result3 = reducer(result2, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: ['a1']
            }
        });

        expect(_.get(result3, 'order')).toEqual(['a3', 'a2']);
        expect(_.get(result3, 'items.a2.id')).toBe('a2');
    });

    test(`${ACTIVITIES_REMOVE} lastUpdate`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:34.660Z')
            }
        });

        expect(moment(_.get(result1, 'lastUpdate')).valueOf()).toBeGreaterThan(0);
    });

    test(`${ACTIVITIES_REMOVE} Array`, () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: makeActivity('1', '2018-07-03T15:31:35.660Z')
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    makeActivity('2', '2018-07-03T15:31:45.660Z'),
                    makeActivity('3', '2018-07-03T15:31:35.660Z')
                ]
            }
        });

        const result3 = reducer(result2, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: ['a1', 'a2']
            }
        });

        expect(_.get(result3, 'order')).toEqual(['a3']);
        expect(_.get(result3, 'items.a3.id')).toBe('a3');
    });
});
