import {combineReducers} from 'redux';
import terminal from '../terminal/reducer';
import heartbeat from '../heartbeat/reducer';
import activities from '../itinerary/activities/reducer';
import triggers from '../journey/triggers/reducer';

export default combineReducers({
    terminal,
    heartbeat,
    activities,
    triggers
});
