import _ from 'lodash';
import reducer from '../reducer.js';
import {
    HEARTBEAT_DEFAULT_NEXT,
    HEARTBEAT_DEFAULT_STATE,
    HEARTBEAT_UPDATE,
    TERMINAL_ACCESS_TOKEN_UPDATE,
    TERMINAL_ID_UPDATE,
    TERMINAL_UPDATE
} from '../const';
import {
    TEST_DEFAULT_ISO_1,
    TEST_DEFAULT_ISO_2,
    TEST_DEFAULT_TIMESTAMP_1,
    TEST_STRING_1,
    TEST_STRING_2
} from '../../../__mocks__/consts';
import {TERMINAL_ONLINE_UPDATE} from '../../_terminal/const';

jest.mock('moment');

describe('Heartbeat', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'lastOffline')).toBe(TEST_DEFAULT_TIMESTAMP_1);
        expect(_.get(result, 'state')).toBe(HEARTBEAT_DEFAULT_STATE);
        expect(_.get(result, 'next')).toBe(HEARTBEAT_DEFAULT_NEXT);
    });

    test(HEARTBEAT_UPDATE, () => {
        const result1 = reducer(undefined, {
            type: HEARTBEAT_UPDATE,
            payload: {
                data: {
                    screen: TEST_STRING_1
                }
            }
        });

        const result2 = reducer(result1, {
            type: HEARTBEAT_UPDATE,
            payload: {
                data: {
                    screen: TEST_STRING_2
                }
            }
        });

        expect(_.get(result2, 'screen')).toBe(TEST_STRING_2);
    });

    test(`${TERMINAL_ONLINE_UPDATE} false`, () => {
        const result1 = reducer(undefined, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {
                status: false
            }
        });

        const result2 = reducer(result1, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {
                status: false
            }
        });

        expect(_.get(result2, 'lastOffline')).toBe(TEST_DEFAULT_ISO_2);
    });

    test(`${TERMINAL_ONLINE_UPDATE} true`, () => {
        const result1 = reducer(undefined, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {
                status: false
            }
        });

        const result2 = reducer(result1, {
            type: TERMINAL_ONLINE_UPDATE,
            payload: {
                status: true
            }
        });

        expect(_.get(result2, 'lastOffline')).toBe(TEST_DEFAULT_ISO_1);
    });
});
