import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import type { Prestamo, CreateLoanState } from "@models/interfaces";
import axios from "axios";

///////////////////////////
// State
///////////////////////////
const initialState: CreateLoanState = {
  isLoading: false,
  error: false,
};

///////////////////////////
// Async functions
///////////////////////////

// Function to upload loan
export const uploadLoan = createAsyncThunk(
  "loan/uploadLoan",
  async (prestamo: Prestamo) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data, status } = await axios.post(`/api/v1/loan`, prestamo, config);
    return {
      data,
      status,
    };
  },
);

///////////////////////////
// Slice
///////////////////////////
export const createLoanSlice = createSlice({
  name: "createLoan",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadLoan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadLoan.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });
  },
});

export default createLoanSlice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setIsLoading } = createLoanSlice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectLoanIsLoading = (state: RootState) =>
  state.createLoan.isLoading;
