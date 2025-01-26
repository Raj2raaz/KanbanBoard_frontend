import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define API base URL
const API_BASE_URL = "http://localhost:4000"; // Update this as per your backend

// Async thunk to add a new task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  //@ts-ignore
  async ({ boardId, columnId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/boards/${boardId}/columns/${columnId}/tasks`,
        taskData
      );
      return response.data;
    } catch (error) {
       //@ts-ignore
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
