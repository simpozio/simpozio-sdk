import _ from 'lodash';
import moment from 'moment';
import SimpozioClass from '../../../src/index';
import {makeInteraction, makeTrigger} from '../../../tools/test-helpers';

let simpozio;

jest.disableAutomock();

describe('Next', () => {
    beforeEach(() => {
        simpozio = new SimpozioClass({
            persist: false,
            heartbeat: false
        });

        simpozio.Journey.addTriggers(
            _.times(10, i => makeTrigger({id: 't' + i, interaction: 'i' + i, after: 'i' + (i - 1), on: 'signal' + i}))
        );
        simpozio.Journey.addExperiences(
            _.times(2, i =>
                makeInteraction({
                    id: 'e' + i,
                    data: {
                        sequence: _.times(5, j => makeInteraction({id: 'i' + (i * 5 + j)}))
                    }
                })
            )
        );
    });

    test('onNext do activity', done => {
        const nextCallbackSpy = jest.fn(({trigger, interactions}) => {
            expect(trigger.id).toBe('t2');
            expect(interactions[0].id).toBe('i2');
            done();
        });

        simpozio.Next.onNext(nextCallbackSpy);

        simpozio.Journey.do({
            activity: {
                type: 'test',
                timestamp: moment().toISOString(),
                interaction: 'i1',
                trigger: 't1',
                input: 1
            }
        });
    });

    test('onNext do signal', done => {
        const nextCallbackSpy = jest.fn(({trigger, interactions}) => {
            expect(trigger.id).toBe('t1');
            expect(interactions[0].id).toBe('i1');
            done();
        });

        simpozio.Next.onNext(nextCallbackSpy);

        simpozio.Journey.do({
            signal: 'signal1'
        });
    });

    test('onInvalidate', done => {
        const invalidateCallbackSpy = jest.fn(() => {
            expect(invalidateCallbackSpy.mock.calls.length).toBe(1);
            done();
        });

        simpozio.Next.onInvalidate(invalidateCallbackSpy);

        simpozio.Journey.do({
            activity: {
                type: 'test',
                timestamp: moment().toISOString(),
                interaction: 'i2',
                trigger: 't2',
                input: 1
            }
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
                activity: {
                    type: 'test',
                    timestamp: moment().toISOString(),
                    interaction: 'i1',
                    trigger: 't1',
                    input: 1
                }
            });
        }, 1000);

        setTimeout(() => {
            simpozio.Journey.do({
                activity: {
                    type: 'test',
                    timestamp: moment().toISOString(),
                    interaction: 'i3',
                    trigger: 't3',
                    input: 1
                }
            });
        }, 2000);
    });

    afterEach(() => {
        simpozio.destroy();
    });
});
