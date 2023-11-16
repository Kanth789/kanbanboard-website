import { createSlice } from '@reduxjs/toolkit'

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
  value: BoardItem[];
}



const initialState:BoardState = { value: [] }

export const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavouriteList: (state, action) => {
      state.value = action.payload.data ? action.payload.data : action.payload;
    }
  }
})

export const { setFavouriteList } = favouriteSlice.actions

export default favouriteSlice.reducer