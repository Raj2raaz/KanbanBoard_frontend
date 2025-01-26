import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthPayload } from "../types/authTypes";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
};

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthPayload>) => {
      //@ts-ignore
      state.accessToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
