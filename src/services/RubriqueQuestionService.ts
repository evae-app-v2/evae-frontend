import { api } from "../config/axios";
import {RubriqueQuestions} from "../model/RubriqueQuestions";
import {AxiosResponse} from "axios";
import {Question, RubriqueQuestionDTOO} from "../model/RubriqueQuestionInterface";
export class RubriqueQuestionService {
    private apiURL = "rubriqueQuestions";

    public async getAll(): Promise<RubriqueQuestionDTOO[]> {
        try {
            const response = await api.get<RubriqueQuestionDTOO[]>(`${this.apiURL}/getAll`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async deleteRubriqueQuestion(rubriqueId: number, questionId: number): Promise<void> {
        try {
            await api.get(`${this.apiURL}/delete/${rubriqueId}/${questionId}`);
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

    public async createMultipleRubriqueQuestions(idRubrique: number, idQuestions: number[]): Promise<string> {
        try {
            const response: AxiosResponse<string> = await api.post(`${this.apiURL}/add-multiple/${idRubrique}`, { idQuestions });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



    public async getQuestionsNotInRubriqueId(rubriqueId: number): Promise<Question[]> {
        try {
            const response = await api.get<Question[]>(
                `${this.apiURL}/getQuestions/${rubriqueId}`
            );
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

    public async updateOrdreRubriqueQuestions(rubriqueQuestionDTOs: RubriqueQuestions[]): Promise<void> {
        try {
            await api.post<void>(`${this.apiURL}/update-ordre-question`, rubriqueQuestionDTOs);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getQuestionsByRubriqueId(rubriqueId: number): Promise<Question[]> {
        try {
            const rubriqueQuestionsDTOs = await this.getAll();

            const filteredQuestions = rubriqueQuestionsDTOs
                .filter(rubriqueQuestion => rubriqueQuestion.rubrique.id === rubriqueId)
                .flatMap(rubriqueQuestion => rubriqueQuestion.questions);

            const sortedQuestions = filteredQuestions.sort((a, b) => a.ordre - b.ordre);

            return sortedQuestions;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



}