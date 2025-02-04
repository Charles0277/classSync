import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import courseUnitReducer from './slices/courseUnitSlice';
import roomReducer from './slices/roomSlice';
import scheduleReducer from './slices/scheduleSlice';
import schoolWeekConfigReducer from './slices/schoolWeekConfigSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    schoolWeekConfig: schoolWeekConfigReducer,
    room: roomReducer,
    course: courseReducer,
    courseUnit: courseUnitReducer,
    schedule: scheduleReducer
});

export default rootReducer;
