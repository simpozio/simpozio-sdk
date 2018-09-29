import _ from 'lodash';
import moment from 'moment';
import {
    getTimestampFromTimeframe,
    getItemByDescriptor,
    interactionLinking,
    makelocalIds
} from '../common/common.helpers';
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

        expect(_.get(result, 'sequence[0].uri')).toEqual('2');
        expect(_.get(result, 'sequence[1].uri')).toEqual('3');
        expect(_.get(result, 'sequence[2].uri')).toEqual('4');
    });

    test('With variants ', () => {
        const interaction = makeInteraction('1', {
            variants: [makeInteraction('2'), makeInteraction('3'), makeInteraction('4')]
        });
        const result = interactionLinking(interaction);

        expect(_.get(result, 'variants[0].uri')).toEqual('2');
        expect(_.get(result, 'variants[1].uri')).toEqual('3');
        expect(_.get(result, 'variants[2].uri')).toEqual('4');
    });

    test('With sequence ', () => {
        const interaction = makeInteraction('1', {
            choice: [makeInteraction('2'), makeInteraction('3'), makeInteraction('4')]
        });
        const result = interactionLinking(interaction);

        expect(_.get(result, 'choice[0].uri')).toEqual('2');
        expect(_.get(result, 'choice[1].uri')).toEqual('3');
        expect(_.get(result, 'choice[2].uri')).toEqual('4');
    });
});

describe('makelocalIds', () => {
    test('makelocalIds result ', () => {
        const result = makelocalIds({
            sequence: [
                {
                    variants: [{}]
                },
                {
                    choice: [{}]
                }
            ]
        });

        expect(_.get(result, 'localId')).toBeDefined();
        expect(_.get(result, 'sequence[0].localId')).toBeDefined();
        expect(_.get(result, 'sequence[1].localId')).toBeDefined();
        expect(_.get(result, 'sequence[0].variants[0].localId')).toBeDefined();
        expect(_.get(result, 'sequence[1].choice[0].localId')).toBeDefined();
    });
});

describe('getItemByDescriptor', () => {
    test('getItemByDescriptor by id', () => {
        const result = getItemByDescriptor(
            {
                i1: {
                    id: 'i1'
                },
                i2: {
                    id: 'i2'
                }
            },
            'i2'
        );

        expect(_.get(result, 'id')).toBe('i2');
    });

    test('getItemByDescriptor by localId', () => {
        const result = getItemByDescriptor(
            {
                i1: {
                    localId: 'i1'
                },
                i2: {
                    localId: 'i2'
                }
            },
            'i2'
        );

        expect(_.get(result, 'localId')).toBe('i2');
    });

    test('getItemByDescriptor by uri', () => {
        const result = getItemByDescriptor(
            {
                i1: {
                    uri: 'i1'
                },
                i2: {
                    uri: 'i2'
                }
            },
            'i2'
        );

        expect(_.get(result, 'uri')).toBe('i2');
    });
    test('getItemByDescriptor by descriptor', () => {
        const result = getItemByDescriptor(
            {
                i1: {
                    uri: 'i1'
                },
                i2: {
                    uri: 'i2'
                }
            },
            {
                uri: 'i2'
            }
        );

        expect(_.get(result, 'uri')).toBe('i2');
    });
});
