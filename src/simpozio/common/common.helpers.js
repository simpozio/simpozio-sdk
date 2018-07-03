//@flow

import _ from 'lodash';
import moment from 'moment';

export const getTimestampFromTimeframe = (item: mixed): number => {
    const timeframe = _.get(item, 'timeframe', {});
    let timestamp = _.get(item, 'timestamp', moment().valueOf());

    if (timeframe) {
        timestamp = moment(_.get(timeframe, 'actual.start', _.get(timeframe, 'planned.start'))).valueOf();
    }

    return timestamp;
};
