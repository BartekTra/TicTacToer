import { createSlice } from '@reduxjs/toolkit';
import { Axios } from 'axios';
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const initialState = {
  user: isBrowser ? localStorage.getItem('user') : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      console.log(state.user);
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;