import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
    users: userReducer
});

export default rootReducer;
