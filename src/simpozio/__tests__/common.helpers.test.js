import moment from 'moment';
import {getTimestampFromTimeframe} from '../common/common.helpers';

jest.unmock('moment');

describe('Common Helpers getTimestampFromTimeframe', () => {
    test('timeframe actual', () => {
        const date = moment().toISOString();
        const timestamp = moment(date).valueOf();

        const result = getTimestampFromTimeframe({
            timeframe: {
                actual: {
                    start: date
                },
                planned: {
                    start: date
                }
            }
        });
        expect(result).toBe(timestamp);
    });

    test('timeframe planned', () => {
        const date = moment().toISOString();
        const timestamp = moment(date).valueOf();

        const result = getTimestampFromTimeframe({
            timeframe: {
                planned: {
                    start: date
                }
            }
        });
        expect(result).toBe(timestamp);
    });

    test('timestamp', () => {
        const timestamp = moment().valueOf();

        const result = getTimestampFromTimeframe({
            timestamp
        });
        expect(result).toBe(timestamp);
    });
});
