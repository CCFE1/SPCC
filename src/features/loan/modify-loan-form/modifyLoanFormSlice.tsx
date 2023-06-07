import axios from "axios";
import { RootState } from "@store/store";
import type { StatusType } from "@models/types";

import type { Prestamo, DataToSend, ModifyLoanState } from "@models/interfaces";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

///////////////////////////
// State
///////////////////////////
const initialState: ModifyLoanState = {
  selectedLoan: undefined,
  status: "idle",
};

///////////////////////////
// Async functions
///////////////////////////

// Function to modify loan devices
export const modifyLoan = createAsyncThunk(
  "loan/modifyLoan",
  async (modifyData: DataToSend) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data, status } = await axios.patch(
      `/api/v1/loan/modify`,
      modifyData,
      config
    );
    return {
      data,
      status,
    };
  }
);

///////////////////////////
// Slice
///////////////////////////
export const slice = createSlice({
  name: "modifyLoan",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
    setSelectedLoan: (state, action: PayloadAction<Prestamo | undefined>) => {
      state.selectedLoan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(modifyLoan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyLoan.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(modifyLoan.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default slice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setStatus, setSelectedLoan } = slice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectStatus = (state: RootState) => state.modifyLoan.status;
export const selectSelectedLoan = (state: RootState) =>
  state.modifyLoan.selectedLoan;
