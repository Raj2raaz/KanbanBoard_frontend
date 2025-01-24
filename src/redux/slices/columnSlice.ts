import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Column {
  id: string;
  title: string;
  items: string[];
}

interface ColumnState {
  columns: Column[];
}

const initialState: ColumnState = {
  columns: [],
};

const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter((col) => col.id !== action.payload);
    },
  },
});

export const { setColumns, addColumn, removeColumn } = columnSlice.actions;
export default columnSlice.reducer;
