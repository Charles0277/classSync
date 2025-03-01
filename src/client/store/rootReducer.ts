import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import courseReducer from './slices/courseSlice';
import courseUnitReducer from './slices/courseUnitSlice';
import feedbackReducer from './slices/feedbackSlice';
import holidayReducer from './slices/holidaySlice';
import roomReducer from './slices/roomSlice';
import scheduleReducer from './slices/scheduleSlice';
import userReducer from './slices/userSlice';

export const RESET_STATE = 'RESET_STATE';

const appReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    room: roomReducer,
    course: courseReducer,
    courseUnit: courseUnitReducer,
    schedule: scheduleReducer,
    class: classReducer,
    feedback: feedbackReducer,
    holiday: holidayReducer
});

const rootReducer = (state: any, action: any) => {
    if (action.type === RESET_STATE) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
