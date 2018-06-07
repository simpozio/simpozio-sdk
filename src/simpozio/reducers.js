import {combineReducers} from 'redux';
import terminal from '../terminal/reducer';
import heartbeat from '../heartbeat/reducer';

export default combineReducers({
    terminal,
    heartbeat
});
