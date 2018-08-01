// @flow

import type {SmpzApiRequestParamsType} from "../../_api";

export type SmpzGenericDataType = {[key: string]: mixed};

export type SmpzReduxActionMetaType = {
    offline?: {
        // the network action to execute:
        effect?: SmpzApiRequestParamsType,
        // action to dispatch when effect succeeds:
        commit?: SmpzReduxActionType,
        // action to dispatch if network action fails permanently:
        rollback?: SmpzReduxActionType
    }
};

export type SmpzReduxActionType = {
    type: string,
    payload: SmpzGenericDataType,
    meta?: SmpzReduxActionMetaType
};
