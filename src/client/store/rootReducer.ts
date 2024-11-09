import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import schoolWeekConfigReducer from './slices/schoolWeekConfigSlice';
import roomReducer from './slices/roomSlice';
import courseReducer from './slices/courseSlice';

const rootReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    schoolWeekConfig: schoolWeekConfigReducer,
    room: roomReducer,
    course: courseReducer
});

export default rootReducer;
