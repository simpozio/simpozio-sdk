import _ from 'lodash';
import uuidv4 from 'uuid/v4';

export const makeTrigger = ({id, interaction, after, on}) => ({
    id: id,
    localId: uuidv4(),
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
    localId: uuidv4(),
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

export const makeInteraction = ({uri, data}) =>
    _.assign(
        {},
        {
            localId: uuidv4(),
            uri,
            type: 'event'
        },
        data
    );
