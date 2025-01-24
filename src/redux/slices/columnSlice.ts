import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColumnState, Column } from "../types/columnTypes";

const initialState: ColumnState = {
  columns: [],
};

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    updateColumn: (state, action: PayloadAction<Column>) => {
      const index = state.columns.findIndex(col => col.id === action.payload.id);
      if (index !== -1) {
        state.columns[index] = action.payload;
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
    },
  },
});

export const { setColumns, addColumn, updateColumn, deleteColumn } = columnSlice.actions;
export default columnSlice.reducer;
