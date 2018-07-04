import _ from 'lodash';
import moment from 'moment';
import {getTimestampFromTimeframe, interactionLinking} from '../common/common.helpers';

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
        const timestamp = 123;

        const result = getTimestampFromTimeframe({
            timestamp
        });

        expect(result).toBe(123);
    });
});

describe('Common Helpers interactionLinking', () => {
    test('With no sequence/variants/choice ', () => {
        const interaction = makeInteraction('1');
        const result = interactionLinking(interaction);

        expect(result).toEqual(interaction);
    });

    test('With sequence ', () => {
        const interaction = makeInteraction('1', {
            sequence: [makeInteraction('2'), makeInteraction('3'), makeInteraction('4')]
        });

        const result = interactionLinking(interaction);

        expect(result).toEqual(
            _.assign({}, interaction, {
                sequence: ['2', '3', '4']
            })
        );
    });

    test('With variants ', () => {
        const interaction = makeInteraction('1', {
            variants: [makeInteraction('2'), makeInteraction('3'), makeInteraction('4')]
        });
        const result = interactionLinking(interaction);

        expect(result).toEqual(
            _.assign({}, interaction, {
                variants: ['2', '3', '4']
            })
        );
    });

    test('With sequence ', () => {
        const interaction = makeInteraction('1', {
            choice: [makeInteraction('2'), makeInteraction('3'), makeInteraction('4')]
        });
        const result = interactionLinking(interaction);

        expect(result).toEqual(
            _.assign({}, interaction, {
                choice: ['2', '3', '4']
            })
        );
    });
});
