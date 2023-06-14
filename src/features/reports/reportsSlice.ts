import type { StatusType } from "@models/types";
import { RootState } from "@store/store";
import axios from "axios";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

///////////////////////////
// State
///////////////////////////
const initialState: {
  status: StatusType;
} = {
  status: "idle",
};

///////////////////////////
// Async functions
///////////////////////////

export const fetchReports = createAsyncThunk("loan/getLoans", async (dataToSend: any) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const { data } = await axios.post(
    `/api/v1/reports`,
    dataToSend,
    config
  );
  return data;
});

///////////////////////////
// Slice
///////////////////////////
export const reportsSlice = createSlice({
  name: "reportsList",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(fetchReports.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default reportsSlice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setStatus } = reportsSlice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectStatus = (state: RootState) => state.reports.status;
