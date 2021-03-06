import _ from 'lodash';
import reducer from '../reducer.js';
import moment from 'moment';
import {NEXT_DO_INVALIDATE, NEXT_DO_NEXT} from '../../next/const';

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
});
