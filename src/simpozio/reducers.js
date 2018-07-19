import {combineReducers} from 'redux';
import terminal from '../_terminal/reducer';
import heartbeat from '../heartbeat/reducer';
import activities from '../itinerary/activities/reducer';
import triggers from '../journey/triggers/reducer';
import interactions from '../journey/interactions/reducer';
import experiences from '../journey/experiences/reducer';
import next from '../next/reducer';

export default combineReducers({
    activities,
    experiences,
    interactions,
    terminal,
    heartbeat,
    triggers,
    next,
    requests
});
