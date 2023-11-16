import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoardItem {
  _id: string;
  user: string;
  title: string;
  description: string;
  position: number;
  favourite: boolean;
  favouritePosition: number;
  __v: number;
}

interface BoardState {
  boards: BoardItem[];
}

const initialState: BoardState = {
  boards: [],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards =  action.payload.data ? action.payload.data : action.payload; 
    },
  },
});

export const { setBoards } = boardSlice.actions;

export default boardSlice.reducer;