import _ from 'lodash';

export const makeTrigger = ({id, interaction, after, on}) => ({
    id: id,
    priority: 1,
    if: {
        conditions: {
            after,
            on: _.castArray(on)
        }
    },
    do: [
        {
            interaction
        }
    ]
});

export const makeActivity = ({id, timestamp, interaction}) => ({
    id: id,
    actor: 'actor',
    interaction: interaction,
    trigger: 'trigger',
    event: 'event',
    timeframe: {
        actual: {
            start: timestamp
        }
    }
});

export const makeInteraction = ({id, data}) =>
    _.assign(
        {},
        {
            id: id,
            type: 'event'
        },
        data
    );
