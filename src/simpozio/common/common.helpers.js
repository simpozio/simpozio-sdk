//@flow

import _ from 'lodash';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import type {SmpzInteractionItemsType, SmpzInteractionModelType} from '../../journey/interactions/reducer';
import {LISTENER_META} from './common.consts';
import type {SmpzTriggerCollectionType, SmpzTriggerType} from '../../journey/triggers/reducer';
import type {SmpzExperiencesModelType} from '../../journey/experiences/reducer';

export const getTimestampFromTimeframe = (item: mixed): number => {
    const timeframe = _.get(item, 'timeframe');
    let timestamp = _.get(item, 'timestamp', moment().valueOf());

    if (timeframe) {
        timestamp = moment(_.get(timeframe, 'actual.start', _.get(timeframe, 'planned.start'))).valueOf();
    }

    return timestamp;
};

export const interactionLinking = (interaction: SmpzInteractionModelType): SmpzInteractionModelType => {
    let sequence;
    let variants;
    let choice;

    const linkItem = (interaction: SmpzInteractionModelType): SmpzInteractionModelType =>
        _.pick(interaction, ['id', 'localId', 'uri']);

    if (interaction.sequence) {
        sequence = _.map(interaction.sequence, linkItem);
    }

    if (interaction.variants) {
        variants = _.map(interaction.variants, linkItem);
    }

    if (interaction.choice) {
        choice = _.map(interaction.choice, linkItem);
    }

    return _.assign(
        {},
        interaction,
        sequence && {
            sequence
        },
        variants && {
            variants
        },
        choice && {
            choice
        }
    );
};

export const getListenerKey = (listener: () => any): string => {
    if (!listener) {
        return '';
    }

    if (!listener.hasOwnProperty(LISTENER_META)) {
        if (!Object.isExtensible(listener)) {
            return 'F';
        }

        Object.defineProperty(listener, LISTENER_META, {
            value: _.uniqueId('SIMPOZIO_LISTENER_')
        });
    }

    return listener[LISTENER_META];
};

export const getItemByDescriptor = (allIitems: any, _descriptor: any): any => {
    let descriptor = _descriptor;

    if (_.isObject(_descriptor)) {
        descriptor = descriptor.localId || descriptor.id || descriptor.uri;
    }

    return _.find(allIitems, (item: SmpzInteractionModelType): boolean => {
        return (
            _.get(item, 'id') === descriptor ||
            _.get(item, 'uri') === descriptor ||
            _.get(item, 'localId') === descriptor
        );
    });
};

export const makelocalIds = (root: any): any => {
    let queue = [root];
    while (queue.length > 0) {
        const item = queue.pop();
        if (!item.localId) {
            _.set(item, 'localId', uuidv4());
        }

        if (item.choice || item.sequence || item.variants)
            queue = _.concat(queue, item.choice || item.sequence || item.variants);
    }

    return root;
};
