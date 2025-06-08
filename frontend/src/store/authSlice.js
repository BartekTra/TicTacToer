import { createSlice } from '@reduxjs/toolkit';
import { Axios } from 'axios';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const initialState = {
  user: isBrowser ? localStorage.getItem('user') : null,
  token: isBrowser ? localStorage.getItem('token') : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', state.user);
      localStorage.setItem('token', state.token);
      console.log(state.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      delete axios.defaults.headers.common['access-token'];
      delete axios.defaults.headers.common['client'];
      delete axios.defaults.headers.common['uid'];
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
