import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import boardReducer from "./slices/boardSlice";
import columnReducer from "./slices/columnSlice";
import taskReducer from "./slices/taskSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    column: columnReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
