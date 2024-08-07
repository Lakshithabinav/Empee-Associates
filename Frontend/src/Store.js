// Store.js
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Helper/LoginSlice';

export const Store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
