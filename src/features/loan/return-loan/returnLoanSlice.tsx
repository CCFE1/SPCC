import axios from "axios";
import type { StatusType } from "@models/types";
import type { ReturnLoanState, Tag, ReturnLoanData } from "@models/interfaces";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

///////////////////////////
// State
///////////////////////////
const initialState: ReturnLoanState = {
  status: "idle",
  devicesSelected: [],
};

///////////////////////////
// Async functions
///////////////////////////

// Function to return loan
export const returnLoan = createAsyncThunk(
  "loan/returnLoan",
  async (returnData: ReturnLoanData) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.patch(
      `/api/v1/loan/return`,
      returnData,
      config
    );
    
    return data;
  }
);

///////////////////////////
// Slice
///////////////////////////
export const slice = createSlice({
  name: "returnLoan",
  initialState,
  reducers: {
    setDevicesSelected: (state, action: PayloadAction<Tag[]>) => {
      state.devicesSelected = action.payload;
    },
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(returnLoan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(returnLoan.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(returnLoan.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default slice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setStatus, setDevicesSelected } = slice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectDevicesSelected = (state: RootState) =>
  state.returnLoan.devicesSelected;
