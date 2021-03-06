// @flow

import _ from 'lodash';
import {EXPERIENCES_ADD, EXPERIENCES_REMOVE} from './const';
import type {SmpzExperiencesModelType} from './reducer';
import type {SmpzReduxActionType} from '../../simpozio/common/common.types';
import {makelocalIds} from "../../simpozio/common/common.helpers";

export const experiencesAddAction = (data?: SmpzExperiencesModelType | Array<SmpzExperiencesModelType>): SmpzReduxActionType => ({
    type: EXPERIENCES_ADD,
    payload: {
        experiences: _.map(_.castArray(data), (item: SmpzExperiencesModelType): SmpzExperiencesModelType => makelocalIds(item))
    }
});

export const experiencesRemoveAction = (data?: string | Array<string>): SmpzReduxActionType => ({
    type: EXPERIENCES_REMOVE,
    payload: {
        experiences: _.castArray(data)
    }
});
