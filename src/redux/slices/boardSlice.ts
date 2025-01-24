import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardState, Board } from "../types/boardTypes";

const initialState: BoardState = {
  boards: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
  },
});

export const { setBoards, addBoard } = boardSlice.actions;
export default boardSlice.reducer;
