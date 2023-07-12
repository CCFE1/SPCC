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

// Function to uploadSchedules
export const uploadSchedules = createAsyncThunk(
  "schedules/uploadSchedules",
  async (schedules: any) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data, status } = await axios.post(
        `/api/v1/schedules`,
        schedules,
        config,
      );

      return {
        status,
      };
    } catch (err: any) {
      throw new Error(err);
    }
  },
);

///////////////////////////
// Slice
///////////////////////////
export const uploadScheduleSlice = createSlice({
  name: "loansList",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadSchedules.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(uploadSchedules.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export default uploadScheduleSlice.reducer;

///////////////////////////
// Actions
///////////////////////////
export const { setStatus } = uploadScheduleSlice.actions;

///////////////////////////
// Selectors
///////////////////////////
export const selectStatus = (state: RootState) => state.uploadSchedule.status;
