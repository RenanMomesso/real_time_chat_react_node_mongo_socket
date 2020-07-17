import {combineReducers} from 'redux'
import chat from './chat_reducer';

const rootReducer = combineReducers({
    chat:chat
})
export default rootReducer;