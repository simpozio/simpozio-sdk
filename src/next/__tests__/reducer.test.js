import _ from 'lodash';
import reducer from '../reducer.js';
import moment from 'moment';
import {NEXT_DO_INVALIDATE, NEXT_DO_NEXT} from '../../next/const';
import {NEXT_SET_WAIT_FOR} from '../const';
import {ACTIVITIES_REGISTER} from '../../itinerary/activities/const';

describe('Reducer Next', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'lastDoNext')).toBe(0);
        expect(_.get(result, 'lastDoInvalidate')).toBeDefined();
    });

    test(`${NEXT_DO_INVALIDATE}`, () => {
        const result = reducer(undefined, {type: NEXT_DO_INVALIDATE});
        expect(moment(_.get(result, 'lastDoInvalidate')).valueOf()).toBeLessThanOrEqual(moment().valueOf());
    });
    test(`${NEXT_DO_NEXT}`, () => {
        const result = reducer(undefined, {type: NEXT_DO_NEXT});
        expect(moment(_.get(result, 'lastDoNext')).valueOf()).toBeLessThanOrEqual(moment().valueOf());
    });

    test(`${NEXT_SET_WAIT_FOR}`, () => {
        const result = reducer(undefined, {
            type: NEXT_SET_WAIT_FOR,
            payload: {interactions: [{id: 'i1'}, {id: 'i2'}]}
        });
        expect(_.get(result, 'waitFor')).toEqual(['i1', 'i2']);
    });

    test(`${ACTIVITIES_REGISTER}`, () => {
        const result1 = reducer(undefined, {
            type: NEXT_SET_WAIT_FOR,
            payload: {interactions: [{id: 'i1'}, {id: 'i2'}]}
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_REGISTER,
            payload: {activities: [{interaction: 'i1'}]}
        });

        expect(_.get(result2, 'waitFor')).toEqual(['i2']);
    });
});
