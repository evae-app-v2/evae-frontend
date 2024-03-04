import { api } from "../config/axios";
import { QuestionDTO } from "../model/QuestionDTO";
import {RubriqueQuestions} from "../model/RubriqueQuestions";
import {Question} from "../model/Question";
import {AxiosResponse} from "axios";
export class RubriqueQuestionService {
    private apiURL = "rubriqueQuestions";

    public async getAll(): Promise<RubriqueQuestions[]> {
        try {
            const response = await api.get<RubriqueQuestions[]>(`${this.apiURL}/getAll`);
            console.log("response data getAll : ",response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addQuestion(rubriqueQuestion: RubriqueQuestions): Promise<string> {
        console.log(rubriqueQuestion)
        try {
            const rubriqueQuestionSned= {
                idRubrique: rubriqueQuestion.idRubrique,
                idQuestion: rubriqueQuestion.idQuestion,
                ordre: rubriqueQuestion.ordre
            };
            const response: AxiosResponse<string> = await api.post<string>(`${this.apiURL}/add`, rubriqueQuestionSned);
            console.log("Test test")
            console.log(rubriqueQuestion)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


public async delete(idRubrique: number): Promise<void> {
    try {
        await api.get<void>(`${this.apiURL}/delete/${idRubrique}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/*
async getQuestionsByRubrique(rubriqueId: number): Promise<QuestionDTO[]> {
    try {
        const response = await api.get<RubriqueQuestions[]>(`${this.apiURL}/${rubriqueId}/questions`);

        // Assuming RubriqueQuestions has a property named 'questionDTO'
        const questions = response.data
            .map((rubriqueQuestion) => rubriqueQuestion.questionDTO)
            .filter((questionDTO): questionDTO is QuestionDTO => questionDTO !== undefined);

        return questions;
    } catch (error) {
        console.error('Error fetching questions by rubrique:', error);
        throw error;
    }
}*/


}