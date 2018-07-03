import _ from 'lodash';
import reducer from './reducer.js';
import {ACTIVITIES_ADD, ACTIVITIES_REMOVE} from './const';

jest.unmock('moment');

describe('Activities', () => {
    test('Initial State', () => {
        const result = reducer(undefined, {type: 'INIT'});
        expect(_.get(result, 'order')).toBeDefined();
        expect(_.get(result, 'items')).toBeDefined();
    });

    test('Add One', () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    actor: '1',
                    interaction: '1',
                    trigger: '1',
                    event: '1',
                    timeframe: {
                        actual: {
                            start: '2018-07-03T15:31:34.660Z'
                        }
                    }
                }
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a2',
                    actor: '2',
                    interaction: '2',
                    trigger: '2',
                    event: '2',
                    timeframe: {
                        actual: {
                            start: '2018-07-03T15:31:35.660Z'
                        }
                    }
                }
            }
        });

        expect(_.get(result2, 'order')).toEqual(['a1', 'a2']);
        expect(_.get(result2, 'items.a2.id')).toBe('a2');
    });

    test('Add Array', () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    actor: '1',
                    interaction: '1',
                    trigger: '1',
                    event: '1',
                    timeframe: {
                        actual: {
                            start: '2018-07-03T15:31:35.660Z'
                        }
                    }
                }
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    {
                        id: 'a2',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:45.660Z'
                            }
                        }
                    },
                    {
                        id: 'a3',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:35.660Z'
                            }
                        }
                    }
                ]
            }
        });

        expect(_.get(result2, 'order')).toEqual(['a1', 'a3', 'a2']);
        expect(_.get(result2, 'items.a2.id')).toBe('a2');
    });

    test('Remove One', () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    actor: '1',
                    interaction: '1',
                    trigger: '1',
                    event: '1',
                    timeframe: {
                        actual: {
                            start: '2018-07-03T15:31:35.660Z'
                        }
                    }
                }
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    {
                        id: 'a2',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:45.660Z'
                            }
                        }
                    },
                    {
                        id: 'a3',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:35.660Z'
                            }
                        }
                    }
                ]
            }
        });

        const result3 = reducer(result2, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: ['a1']
            }
        });

        expect(_.get(result3, 'order')).toEqual(['a3', 'a2']);
        expect(_.get(result3, 'items.a2.id')).toBe('a2');
    });

    test('Remove One', () => {
        const result1 = reducer(undefined, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: {
                    id: 'a1',
                    actor: '1',
                    interaction: '1',
                    trigger: '1',
                    event: '1',
                    timeframe: {
                        actual: {
                            start: '2018-07-03T15:31:35.660Z'
                        }
                    }
                }
            }
        });

        const result2 = reducer(result1, {
            type: ACTIVITIES_ADD,
            payload: {
                activities: [
                    {
                        id: 'a2',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:45.660Z'
                            }
                        }
                    },
                    {
                        id: 'a3',
                        actor: '2',
                        interaction: '2',
                        trigger: '2',
                        event: '2',
                        timeframe: {
                            actual: {
                                start: '2018-07-03T15:31:35.660Z'
                            }
                        }
                    }
                ]
            }
        });

        const result3 = reducer(result2, {
            type: ACTIVITIES_REMOVE,
            payload: {
                activities: ['a1', 'a2']
            }
        });

        console.log(result2, result3);

        expect(_.get(result3, 'order')).toEqual(['a3']);
        expect(_.get(result3, 'items.a3.id')).toBe('a3');
    });
});
