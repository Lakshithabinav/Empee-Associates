// Helper/LoginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logedin: (state) => {
      state.value = true;
    },
    logedout:(state)=>{
      state.value =false;
    }
  },
});

export const { logedin,logedout } = LoginSlice.actions;
export default LoginSlice.reducer;
