import _ from 'lodash';
import Logger from './logger';

const LOGGER = 'Logger';

describe(LOGGER, () => {
    test('Constructor', () => {
        const logger = new Logger({
            store: {
                getState: () => ({
                    terminal: {
                        debug: true
                    }
                })
            },
            name: LOGGER
        });
        expect(_.get(logger, 'name')).toBe(LOGGER);
        expect(_.get(logger.store.getState(), 'terminal.debug')).toBe(true);
    });

    test('#log', () => {
        const logger = new Logger({
            store: {
                getState: () => ({
                    terminal: {
                        debug: true
                    }
                })
            },
            name: LOGGER
        });
        const spy = jest.spyOn(console, 'log');

        logger.log('Test');

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
    });

    test('#error', () => {
        const logger = new Logger({
            store: {
                getState: () => ({
                    terminal: {
                        debug: true
                    }
                })
            },
            name: LOGGER
        });
        const spy = jest.spyOn(console, 'error');

        logger.error('Test');

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
    });

    test('Constructor debug property', () => {
        const logger = new Logger({
            store: {
                getState: () => ({
                    terminal: {
                        debug: false
                    }
                })
            },
            name: LOGGER
        });
        const spy = jest.spyOn(console, 'log');

        logger.log('Test');
        expect(_.get(logger.store.getState(), 'terminal.debug')).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        spy.mockReset();
    });
});
