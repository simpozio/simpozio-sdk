import _ from 'lodash';
import moment from 'moment';
import SimpozioClass from '../../../src/index';

let simpozio;

jest.disableAutomock();

const makeTrigger = (index, after) => ({
    id: 't' + index,
    priority: 1,
    if: {
        conditions: {
            after: 'i' + after
        }
    },
    do: [
        {
            interaction: 'i' + index
        }
    ]
});

const makeInteraction = (id, data) =>
    _.assign(
        {},
        {
            id: id,
            type: 'event'
        },
        data
    );

describe('Next', () => {
    beforeEach(() => {
        simpozio = new SimpozioClass({
            persist: false,
            heartbeat: false
        });

        simpozio.Journey.addTriggers(_.times(10, i => makeTrigger(i, i - 1)));
        simpozio.Journey.addExperiencies(
            _.times(2, i =>
                makeInteraction('e' + i, {
                    sequence: _.times(5, j => makeInteraction('i' + (i * 5 + j)))
                })
            )
        );
    });

    test('onNext', done => {
        const nextCallbackSpy = jest.fn(({trigger, interactions}) => {
            expect(trigger.id).toBe('t2');
            expect(interactions[0].id).toBe('i2');
            done();
        });

        simpozio.Next.onNext(nextCallbackSpy);

        simpozio.Journey.do({
            type: 'test',
            timestamp: moment().toISOString(),
            interaction: 'i1',
            trigger: 't1',
            input: 1
        });
    });

    test('onInvalidate', done => {
        const invalidateCallbackSpy = jest.fn(() => {
            expect(invalidateCallbackSpy.mock.calls.length).toBe(1);
            done();
        });

        simpozio.Next.onInvalidate(invalidateCallbackSpy);

        simpozio.Journey.do({
            type: 'test',
            timestamp: moment().toISOString(),
            interaction: 'i2',
            trigger: 't2',
            input: 1
        });
    });

    test('skippable', done => {
        const nextCallbackSpy = jest.fn(() => {
            expect(nextCallbackSpy.mock.calls.length).toBe(1);
            done();
        });

        simpozio.Next.onNext(nextCallbackSpy);
        setTimeout(() => {
            simpozio.Journey.do({
                type: 'test',
                timestamp: moment().toISOString(),
                interaction: 'i1',
                trigger: 't1',
                input: 1
            });
        }, 1000);

        setTimeout(() => {
            simpozio.Journey.do({
                type: 'test',
                timestamp: moment().toISOString(),
                interaction: 'i3',
                trigger: 't3',
                input: 1
            });
        }, 2000);
    });

    afterEach(() => {
        simpozio.destroy();
    });
});
