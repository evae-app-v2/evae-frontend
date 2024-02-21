import { api } from "../config/axios";
import { RubriqueQuestions } from '../model/RubriqueQuestions';

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

    // public async getById(id: number ): Promise<RubriqueQuestions> {
    //     try {
    //         const response = await api.get<RubriqueQuestions>(`${this.apiURL}/${id}/questions`);
    //         return response.data;
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }
}