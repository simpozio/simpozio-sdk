// @flow

export type SmpzGenericDataType = {[key: string]: mixed};

export type SmpzReduxActionType = {
    type: string,
    payload: SmpzGenericDataType
};
