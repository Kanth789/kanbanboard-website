import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  value: {
    user?: {
      username?: string;
    };
  };
}

const initialState: UserState = { value: {} };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ data: { user?: { username?: string; [key: string]: any } } }>) => {
      state.value = action.payload.data;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;