import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import boardReducer from './features/boardSlice';
import favouriteReducer from './features/favouriteSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    board:boardReducer,
    favourites: favouriteReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
