//@flow

import type {SmpzGenericDataType, SmpzReduxActionType} from '../../simpozio/common/common.types';
import _ from 'lodash';
import {interactionLinking} from '../../simpozio/common/common.helpers';
import {INTERACTIONS_ADD, INTERACTIONS_REMOVE} from './const';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from '../experiences/const';
import type {SmpzExperiencesModelType} from '../experiences/reducer';

export type SmpzInteractionModelType =
    | {
          id: string,
          type: string,
          touchpoints?: Array<string>,
          slug?: string,
          uri?: string,
          title?: string,
          description?: string,
          tags?: Array<string>,
          targeting?: SmpzGenericDataType,
          experienceId?: string,
          // prettier-ignore
          participants?: number | {| min?: number | string, max?: number | string |},

          // prettier-ignore
          duration?: number | string | {| min?: number | string, max?: number | string |},
          sequence?: Array<SmpzInteractionModelType> | Array<string>,
          variants?: Array<SmpzInteractionModelType> | Array<string>,
          choice?: Array<SmpzInteractionModelType> | Array<string>,
          skippable?: boolean,
          pattern?: string,
          messages?: Array<SmpzInteractionMessageModelType>,
          media?: Array<SmpzInteractionMediaModelType>,
          input?: SmpzInteractionInputModelType,
          hooks?: Array<string>
      }
    | string;

export type SmpzInteractionMediaModelType = {
    url: string,
    type: string,
    width?: number,
    height?: number,
    depth?: number,
    duration?: number | string,
    thumbnails?: Array<SmpzInteractionMediaModelType>
};

export type SmpzInteractionMessageModelType = {
    title?: string,
    text?: string | Array<string>,
    media?: SmpzInteractionMediaModelType | Array<SmpzInteractionMediaModelType>,
    emotion?: {
        sadness?: number,
        joy?: number,
        fear?: number,
        disgust?: number,
        anger?: number
    }
};
export type SmpzInteractionInputModelType = {
    // prettier-ignore
    format?: string | {| type: string, regexp?: string, length?: number | {| min?: number | string, max?: number | string |} |},
    default?: string | number | boolean
};

export type SmpzInteractionsCollectionType = {
    items: SmpzInteractionItemsType
};

export type SmpzInteractionItemsType = {[key: string]: SmpzInteractionModelType} | {};

const initialState = {
    items: {}
};

const experienceInteractionsLinking = (
    interactions: SmpzInteractionModelType | Array<SmpzInteractionModelType>
): Array<SmpzInteractionModelType> => {
    return _.map(_.castArray(interactions), interactionLinking);
};

export default (
    interactions: SmpzInteractionsCollectionType = initialState,
    action: SmpzReduxActionType
): SmpzInteractionsCollectionType => {
    switch (action.type) {
        case INTERACTIONS_ADD: {
            const newInteractions = _.castArray(_.get(action, 'payload.interactions', []));
            const newItems = _.assign(
                {},
                interactions.items,
                _.keyBy(experienceInteractionsLinking(newInteractions), 'id')
            );

            return _.assign({}, interactions, {
                items: newItems
            });
        }
        case INTERACTIONS_REMOVE: {
            const newInteractions = _.get(action, 'payload.interactions', []);
            const newItems = _.omit(interactions.items, newInteractions);

            return _.assign({}, interactions, {
                items: newItems
            });
        }
        case EXPERIENCES_ADD: {
            const experiences = _.castArray(_.get(action, 'payload.experiences', []));
            const recursiveHelper = (
                root: SmpzInteractionModelType,
                acc: SmpzInteractionItemsType = {},
                experienceId: string
            ) => {
                if (typeof root === 'string') {
                    return;
                }

                const items = root.sequence || root.variants || root.choice;

                if (!_.isEmpty(items)) {
                    _.forEach(items, (item: SmpzInteractionModelType) => {
                        if (typeof item !== 'string') {
                            acc[item.id] = experienceId
                                ? _.assign({}, interactionLinking(item), {
                                      experienceId
                                  })
                                : interactionLinking(item);
                            recursiveHelper(item, acc, experienceId);
                        }
                    });
                }

                acc[root.id] = experienceId
                    ? _.assign({}, interactionLinking(root), {
                          experienceId
                      })
                    : interactionLinking(root);
            };

            return _.assign({}, interactions, {
                items: _.reduce(
                    experiences,
                    (acc: SmpzInteractionItemsType, experience: SmpzExperiencesModelType): SmpzInteractionItemsType => {
                        const items = experience.sequence || experience.variants || experience.choice;
                        return _.assign(
                            {},
                            acc,
                            _.reduce(
                                items,
                                (
                                    acc: SmpzInteractionItemsType,
                                    item: SmpzInteractionModelType
                                ): SmpzInteractionItemsType => {
                                    if (typeof item !== 'string') {
                                        recursiveHelper(item, acc, experience.id);
                                        return _.assign({}, acc, {
                                            [item.id]: _.assign({}, interactionLinking(item), {
                                                experienceId: experience.id
                                            })
                                        });
                                    }

                                    return acc;
                                },
                                {}
                            )
                        );
                    },
                    {}
                )
            });
        }
        case EXPERIENCES_REMOVE: {
            const experiences = _.castArray(_.get(action, 'payload.experiences', []));
            const newItems = _.reduce(
                experiences,
                (items: SmpzInteractionItemsType, experienceId: string): SmpzInteractionItemsType => {
                    return _.omitBy(
                        items,
                        (interaction: SmpzInteractionModelType): boolean =>
                            typeof interaction !== 'string' && interaction.experienceId === experienceId
                    );
                },
                interactions.items
            );

            return _.assign({}, interactions, {
                items: newItems
            });
        }
        default: {
            return interactions;
        }
    }
};
