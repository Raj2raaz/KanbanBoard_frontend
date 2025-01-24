import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskState, Task } from "../types/taskTypes";

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
