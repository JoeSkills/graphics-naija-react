import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
    },
    resetUserState: (state) => {
      state.user = null;
    },
  },
});

export const { setLogin, resetUserState } = authSlice.actions;
export default authSlice.reducer;
