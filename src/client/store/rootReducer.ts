import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
    users: userReducer,
    auth: authReducer
});

export default rootReducer;
