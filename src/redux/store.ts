import {Action} from "redux";
import {alertsSlice} from "./alertsSlice";
import {userSlice} from "./userSlice";
import {questionsSlice} from "./questionsSlice";
import {configureStore, ThunkAction} from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    alerts: alertsSlice.reducer,
    user: userSlice.reducer,
    questions: questionsSlice.reducer,
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
