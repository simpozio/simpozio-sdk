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
            expect(interactions['i2'].id).toBe('i2');
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
            expect(interactions['i1'].id).toBe('i1');
            done();
        });

        simpozio.Next.onNext(nextCallbackSpy);

        simpozio.Journey.do({
            signal: 'signal1'
        });
    });

    test('onNext do signal', done => {
        const nextCallbackSpy = jest.fn(({trigger, interactions}) => {
            expect(trigger.id).toBe('t21');
            expect(interactions['i21'].id).toBe('i21');
            expect(interactions['i23'].id).toBe('i23');
            expect(interactions['i24'].id).toBe('i24');
            done();
        });

        simpozio.Journey.addTriggers([
            makeTrigger(
                {id: 't21', interaction: 'i21', on: 'signal21'},
                makeTrigger({id: 't22', interaction: 'i22', on: 'signal22'})
            )
        ]);

        simpozio.Journey.addExperiences([
            makeInteraction({
                id: 'e21',
                data: {
                    sequence: [
                        makeInteraction({
                            id: 'i21',
                            data: {
                                skippable: false,
                                sequence: [makeInteraction({id: 'i23'}), makeInteraction({id: 'i24'})]
                            }
                        }),
                        makeInteraction({id: 'i22'})
                    ]
                }
            })
        ]);

        simpozio.Next.onNext(nextCallbackSpy);

        simpozio.Journey.do({
            signal: 'signal21'
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

    test('skippable first', done => {
        const nextCallbackSpy = jest.fn(() => {
            expect(nextCallbackSpy.mock.calls.length).toBe(1);
            done();
        });

        simpozio.Journey.addTriggers([
            makeTrigger(
                {id: 't21', interaction: 'i21', on: 'signal21'},
                makeTrigger({id: 't22', interaction: 'i22', on: 'signal22'})
            )
        ]);

        simpozio.Journey.addExperiences([
            makeInteraction({
                id: 'e21',
                data: {
                    sequence: [makeInteraction({id: 'i21', data: {skippable: false}}), makeInteraction({id: 'i22'})]
                }
            })
        ]);

        simpozio.Next.onNext(nextCallbackSpy);
        setTimeout(() => {
            simpozio.Journey.do({
                signal: 'signal22'
            });
        }, 1000);
    });

    afterEach(() => {
        simpozio.destroy();
    });
});
