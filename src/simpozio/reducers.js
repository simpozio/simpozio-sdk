import {combineReducers} from 'redux';
import terminal from '../terminal/reducers';
import heartbeat from '../heartbeat/reducers';

export default combineReducers({
    terminal,
    heartbeat
});
