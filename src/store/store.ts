import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import devicesReducer from "@devices/deviceSlice";
import coursesReducer from "@courses/courseSlice";
import createLoanReducer from "@loan/create-loan-form/createLoanFormSlice";
import activeLoansListReducer from "@loan/active-loans-list/activeLoansListSlice";
import modifyLoanReducer from "@loan/modify-loan-form/modifyLoanFormSlice";
import returnLoanReducer from "@loan/return-loan/returnLoanSlice";
import loansListReducer from "@loan/loans-list/loansListSlice";
import uploadScheduleReducer from "@schedule/upload-schedule/uploadScheduleSlice";
import reportsReducer from "@reports/reportsSlice";

export const store = configureStore({
  reducer: {
    devices: devicesReducer,
    courses: coursesReducer,
    createLoan: createLoanReducer,
    activeLoans: activeLoansListReducer,
    modifyLoan: modifyLoanReducer,
    returnLoan: returnLoanReducer,
    loansList: loansListReducer,
    uploadSchedule: uploadScheduleReducer,
    reports: reportsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
