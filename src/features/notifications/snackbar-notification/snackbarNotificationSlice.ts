import axios from "axios";
import { RootState } from "@store/store";

import type { SnackbarState } from "@models/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

///////////////////////////
// State
///////////////////////////
const initialState: SnackbarState = {
  isSnackbarOpen: false,
  message: "",
};

///////////////////////////
// Slice
///////////////////////////
export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setIsSnackbarOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isSnackbarOpen = payload;
    },
    setMessage: (state, { payload }: PayloadAction<string>) => {
      state.message = payload;
    },
  },
});

export default snackbarSlice.reducer;
export const { setIsSnackbarOpen, setMessage } = snackbarSlice.actions;

///////////////////////////
// Selector
///////////////////////////
export const selectIsSnackbarOpen = (state: RootState) =>
  state.snackbar.isSnackbarOpen;
export const selectMessage = (state: RootState) => state.snackbar.message;
