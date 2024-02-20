import { createAsyncThunk } from "@reduxjs/toolkit";
import {Question} from "../model/Question";
import {QuestionService} from "../services/QuestionService";

export const loadQuestionsAsync = createAsyncThunk(
    "questions/loadQuestions",
    async () => {
        try {
            const response: Question[] | undefined = await (new QuestionService()).findAllQuestions();
            if (response) {
                console.log(response)
                return response;
            } else {
                return []; // Set questions to an empty array if response is undefined
            }
        } catch (error) {
            console.error("Error loading questions:", error);
            throw error;
        }
    }
);