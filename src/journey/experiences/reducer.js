// @flow
import _ from 'lodash';
import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from './const';
import type {SmpzInteractionModelType} from '../interactions/reducer';
import {
    getItemByDescriptor,
    getTimestampFromTimeframe,
    interactionLinking
} from '../../simpozio/common/common.helpers';
import {ACTIVITIES_ADD, ACTIVITIES_REGISTER} from '../../itinerary/activities/const';
import type {SmpzActivityModelType} from '../../itinerary/activities/reducer';
import uuidv4 from 'uuid/v4';

export type SmpzExperiencesModelType = {
    id: string,
    localId: string,
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
    done: SmpzExperienceDoneType,
    items: {[key: string]: SmpzExperiencesModelType}
};

export type SmpzExperienceDoneType = Array<string>;

const initialState = {
    done: [],
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
                _.keyBy(experienceInteractionsLinking(newExperiences), 'localId')
            );

            return _.assign({}, experiences, {
                items: newItems
            });
        }
        case ACTIVITIES_REGISTER:
        case ACTIVITIES_ADD: {
            const newActivities = _.castArray(_.get(action, 'payload.activities', []));

            const interactionsDone = _.uniq(
                _.concat(
                    _.keys(_.get(action, 'payload.interactions.done'), {}),
                    _.reduce(
                        newActivities,
                        (acc: Array<string>, activity: SmpzActivityModelType): Array<string> => {
                            const interactionDecsriptor = _.get(activity, 'interaction');
                            acc.push(interactionDecsriptor);
                            return acc;
                        },
                        []
                    )
                )
            );

            return _.assign({}, experiences, {
                done: _.reduce(
                    experiences.items,
                    (acc: SmpzExperienceDoneType, experience: SmpzExperiencesModelType): SmpzExperienceDoneType => {
                        if (
                            _.some(interactionsDone, (interactionDesctiptor: string): SmpzInteractionModelType =>
                                getItemByDescriptor(
                                    _.get(experience, 'choice') || _.get(experience, 'variants'),
                                    interactionDesctiptor
                                )
                            ) ||
                            _.every(
                                _.get(experience, 'sequence'),
                                ({id, uri, localId}: SmpzInteractionModelType): boolean =>
                                    _.includes(interactionsDone, id) ||
                                    _.includes(interactionsDone, uri) ||
                                    _.includes(interactionsDone, localId)
                            )
                        ) {
                            acc.push(experience.localId);
                        }

                        return acc;
                    },
                    []
                )
            });
        }
        case EXPERIENCES_REMOVE: {
            const removeExperiences = _.castArray(_.get(action, 'payload.experiences'));
            const newItems = _.filter(
                experiences.items,
                (item: SmpzExperiencesModelType): boolean =>
                    !_.includes(removeExperiences, item.id) &&
                    !_.includes(removeExperiences, item.uri) &&
                    !_.includes(removeExperiences, item.localId)
            );

            return _.assign({}, experiences, {
                items: newItems
            });
        }
        default: {
            return experiences;
        }
    }
};
