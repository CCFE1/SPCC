import type { StatusType } from "@models/types";
import { RootState } from "@store/store";
import { getRowsData } from "./LoansListUtils";
import axios from "axios";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

///////////////////////////
// State
///////////////////////////
const initialState: {
  loansList: any;
  status: StatusType;
} = {
  loansList: [],
  status: "loading",
};

///////////////////////////
// Async functions
///////////////////////////

// Function to getLoans
export const fetchLoans = createAsyncThunk("loan/getLoans", async (arg) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const { data, status } = await axios.get(`/api/v1/loans`, config);
  return getRowsData(data.data);
});

///////////////////////////
// Slice
///////////////////////////
export const loansListSlice = createSlice({
  name: "loansList",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.status = "idle";
        state.loansList = action.payload;
      })
      .addCase(fetchLoans.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default loansListSlice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setStatus } = loansListSlice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectStatus = (state: RootState) => state.loansList.status;
export const selectLoansList = (state: RootState) => state.loansList.loansList;
