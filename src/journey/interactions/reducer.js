//@flow

import type {SmpzGenericDataType} from '../../simpozio/common/common.types';

export type SmpzInteractionModelType = {
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
    choice?: Array<SmpzInteractionModelType>,
    skippable?: boolean,
    pattern?: string,
    messages?: Array<SmpzInteractionMessageModelType>,
    media?: Array<SmpzInteractionMediaModelType>,
    input?: SmpzInteractionInputModelType,
    hooks?: Array<string>
};

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
    format?: string | {|type: string, regexp?: string, length?: number | {|min?: number | string, max?: number | string |} |},
    default?: string | number | boolean
};
