//@flow

import _ from 'lodash';
import moment from 'moment';
import type {SmpzInteractionModelType} from '../../journey/interactions/reducer';
import {LISTENER_META} from './common.consts';

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

    const linkItem = (interaction: SmpzInteractionModelType | string): string | SmpzInteractionModelType =>
        typeof interaction !== 'string' && interaction.id ? interaction.id : interaction;

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
