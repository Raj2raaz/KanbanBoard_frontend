import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthPayload } from "../types/authTypes";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
