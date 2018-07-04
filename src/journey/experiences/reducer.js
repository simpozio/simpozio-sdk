// @flow
import _ from 'lodash';
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from './const';
import type {SmpzInteractionModelType} from '../interactions/reducer';
import {interactionLinking} from '../../simpozio/common/common.helpers';

export type SmpzExperiencesModelType = {
    id: string,
    type: string,
    touchpoints?: Array<string>,
    slug?: string,
    uri?: string,
    title?: string,
    description?: string,
    tags?: Array<string>,
    targeting?: SmpzGenericDataType,

    // prettier-ignore
    participants?: number | {| min?: number | string, max?: number | string |},

    // prettier-ignore
    duration?: number | string | {| min?: number | string, max?: number | string |},

    sequence?: Array<SmpzInteractionModelType>,
    variants?: Array<SmpzInteractionModelType>,
    choice?: Array<SmpzInteractionModelType>
};

export type SmpzExperiencesCollectionType = {
    items: {[key: string]: SmpzExperiencesModelType}
};

const initialState = {
    items: {}
};

const experienceInteractionsLinking = (
    experiences: SmpzExperiencesModelType | Array<SmpzExperiencesModelType>
): Array<SmpzExperiencesModelType> => {
    return _.map(_.castArray(experiences), interactionLinking);
};

export default (
    experiences: SmpzExperiencesCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzExperiencesCollectionType => {
    switch (action.type) {
        case EXPERIENCES_ADD: {
            const newExperiences = _.castArray(_.get(action, 'payload.experiences', []));
            const newItems = _.assign(
                {},
                experiences.items,
                _.keyBy(experienceInteractionsLinking(newExperiences), 'id')
            );

            return _.assign({}, experiences, {
                items: newItems
            });
        }
        case EXPERIENCES_REMOVE: {
            const newExperiences = _.get(action, 'payload.experiences', []);
            const newItems = _.omit(experiences.items, newExperiences);

            return _.assign({}, experiences, {
                items: newItems
            });
        }
        default: {
            return experiences;
        }
    }
};
