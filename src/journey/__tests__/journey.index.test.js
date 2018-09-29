import _ from 'lodash';
import SimpozioClass from '../../../src/index';
import {makeInteraction, makeTrigger} from '../../../tools/test-helpers';

let simpozio;

simpozio = new SimpozioClass({
    persist: false,
    heartbeat: false
});

jest.disableAutomock();

describe('Journey', () => {
    test('addExperiences result', () => {
        const result = simpozio.Journey.addExperiences(
            _.times(2, i =>
                makeInteraction({
                    uri: 'e' + i,
                    data: {
                        sequence: _.times(5, j => makeInteraction({uri: 'i' + (i * 5 + j)}))
                    }
                })
            )
        );

        expect(result).toBeDefined();
        expect(_.every(result, item => item.localId)).toBe(true);
        expect(_.every(result.sequence, item => item.localId)).toBe(true);
    });
    test('addExperiences complex', () => {
        const result = simpozio.Journey.addExperiences([
            {
                type: 'personalization',
                slug: 'visitor-onboarding',
                sequence: [
                    {
                        type: 'decision',
                        slug: 'language',
                        messages: [
                            {
                                text: {
                                    en:
                                        'Bitte wählen Sie eine Sprache für Ihr Interface. Please choose a language for your interface'
                                }
                            }
                        ],
                        skippable: false,
                        choice: [
                            {
                                type: 'reply',
                                slug: 'de',
                                messages: [
                                    {
                                        text: {
                                            en: 'Deutsche'
                                        }
                                    }
                                ],
                                uri: '#/experiences/visitor-onboarding/language/de'
                            }
                        ],
                        uri: '#/experiences/visitor-onboarding/language'
                    }
                ],
                uri: '#/experiences/visitor-onboarding'
            },
            {
                type: 'screening',
                slug: 'screening',
                sequence: [
                    {
                        type: 'notice',
                        slug: 'initial',
                        messages: [
                            {
                                text: {
                                    en: 'You are invited to the screening.'
                                }
                            }
                        ],
                        skippable: false,
                        uri: '#/experiences/screening/initial'
                    },
                    {
                        type: 'rsvp',
                        slug: 'invitation',
                        skippable: false,
                        choice: [
                            {
                                type: 'reply',
                                slug: 'accept',
                                messages: [
                                    {
                                        text: {
                                            en: 'Accept'
                                        }
                                    }
                                ],
                                uri: '#/experiences/screening/invitation/accept'
                            }
                        ],
                        uri: '#/experiences/screening/invitation'
                    }
                ],
                uri: '#/experiences/screening'
            }
        ]);

        expect(result).toBeDefined();
        expect(_.every(result, item => item.localId)).toBe(true);
        expect(_.every(result.sequence, item => item.localId)).toBe(true);
    });

    test('addTriggers result', () => {
        const result = simpozio.Journey.addTriggers(
            _.times(10, i => makeTrigger({id: 't' + i, interaction: 'i' + i, after: 'i' + (i - 1), on: 'signal' + i}))
        );

        expect(result).toBeDefined();
        expect(_.every(result, item => item.localId)).toBe(true);
    });
});
