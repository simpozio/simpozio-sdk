import {combineReducers} from 'redux';
import terminal from '../terminal/reducer';
import heartbeat from '../heartbeat/reducer';
import activities from '../itinerary/activities/reducer';
import triggers from '../journey/triggers/reducer';
import interactions from '../journey/interactions/reducer';

export default combineReducers({
    activities,
    interactions,
    terminal,
    heartbeat,
    triggers
});
