import _ from 'lodash';
import reducer from '../reducer.js';
import {TERMINAL_ACCESS_TOKEN_UPDATE, TERMINAL_ID_UPDATE, TERMINAL_ONLINE_UPDATE, TERMINAL_UPDATE} from '../const';
import {TEST_STRING_1, TEST_STRING_2} from '../../../__mocks__/consts';

describe('Teminal', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'acceptLanguage')).toBe('en_US');
        expect(_.get(result, 'locale')).toBe('en_US');
        expect(_.get(result, 'baseUrl')).toBeTruthy();
        expect(_.get(result, 'terminalId')).toBeTruthy();
        expect(_.get(result, 'online')).toBe(true);
        expect(_.get(result, 'debug')).toBe(false);
    });

    test(TERMINAL_ACCESS_TOKEN_UPDATE, () => {
        const result = reducer(undefined, {
            type: TERMINAL_ACCESS_TOKEN_UPDATE,
            payload: {authorization: TEST_STRING_1, terminalId: TEST_STRING_2}
        });
        expect(_.get(result, 'accessToken')).toBe(TEST_STRING_1);
        expect(_.get(result, 'terminalId')).toBe(TEST_STRING_2);
    });

    test(TERMINAL_ID_UPDATE, () => {
        const result = reducer(undefined, {
            type: TERMINAL_ID_UPDATE,
            payload: {terminalId: TEST_STRING_2}
        });
        expect(_.get(result, 'terminalId')).toBe(TEST_STRING_2);
    });

    test(TERMINAL_ONLINE_UPDATE, () => {
        const result1 = reducer(undefined, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {status: true}
        });

        const result2 = reducer(result1, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {status: false}
        });

        expect(_.get(result1, 'online')).toBe(true);
        expect(_.get(result2, 'online')).toBe(false);
    });

    test(`${TERMINAL_UPDATE} partial`, () => {
        const result1 = reducer(undefined, {
            type: TERMINAL_UPDATE,
            payload: {
                data: {
                    terminalId: TEST_STRING_1,
                    online: false
                }
            }
        });

        const result2 = reducer(result1, {
            type: TERMINAL_UPDATE,
            payload: {
                data: {
                    accessToken: TEST_STRING_1,
                    terminalId: TEST_STRING_2,
                    online: true
                }
            }
        });

        expect(_.get(result2, 'online')).toBe(true);
        expect(_.get(result2, 'accessToken')).toBe(TEST_STRING_1);
        expect(_.get(result2, 'terminalId')).toBe(TEST_STRING_2);
    });

    test(`${TERMINAL_UPDATE} omit heartbeat`, () => {
        const result = reducer(undefined, {
            type: TERMINAL_UPDATE,
            payload: {
                data: {
                    online: false,
                    heartbeat: TEST_STRING_1
                }
            }
        });

        expect(_.get(result, 'online')).toBe(false);
        expect(_.get(result, 'heartbeat')).toBeUndefined();
    });
});
