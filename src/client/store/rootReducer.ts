import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import schoolWeekConfigReducer from './slices/schoolWeekConfigSlice';

const rootReducer = combineReducers({
    users: userReducer,
    auth: authReducer,
    schoolWeekConfig: schoolWeekConfigReducer
});

export default rootReducer;
