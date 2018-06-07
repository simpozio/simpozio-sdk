import {TEST_DEFAULT_ISO_1, TEST_DEFAULT_ISO_2, TEST_DEFAULT_TIMESTAMP_1, TEST_DEFAULT_TIMESTAMP_2} from './consts';

const mock = jest.fn();

const valueOf = jest
    .fn()
    .mockReturnValue(TEST_DEFAULT_TIMESTAMP_1)
    .mockReturnValueOnce(TEST_DEFAULT_TIMESTAMP_1)
    .mockReturnValueOnce(TEST_DEFAULT_TIMESTAMP_2);

const toISOString = jest
    .fn()
    .mockReturnValue(TEST_DEFAULT_ISO_1)
    .mockReturnValueOnce(TEST_DEFAULT_ISO_1)
    .mockReturnValueOnce(TEST_DEFAULT_ISO_2);

const moment = () => {
    return {
        valueOf,
        toISOString
    };
};

module.exports = moment;
