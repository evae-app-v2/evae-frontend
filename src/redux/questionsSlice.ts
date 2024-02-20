// studentsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {RootState} from "./store";

const initialState = {
    questions: [],
};


export  const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
    },
});

export const { setQuestions } = questionsSlice.actions;
export const questionsLits = (state : RootState)=> state.questions.questions;
