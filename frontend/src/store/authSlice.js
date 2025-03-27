import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: JSON.parse(localStorage.getItem('token')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', JSON.stringify(state.token));
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
