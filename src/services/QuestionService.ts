import { Question } from '../model/Question';
import {api} from "../config/axios";
import {AxiosResponse} from "axios"; // Assurez-vous d'importer correctement le modèle Question

export class QuestionService {
    private apiURL = "/api/v1/question";

    public async addQuestion(question: Question): Promise<string> {
        console.log(question)
        try {
            const questionSned= {
                type: question.type,
                    minimal: question.idQualificatif?.minimal,
                    intitule: question.intitule
            };
            const response: AxiosResponse<string> = await api.post<string>(`${this.apiURL}/ajouter`, questionSned);
            console.log("Test test")
            console.log(question)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async findAllQuestions(): Promise<Question[]> {
        try {
            const response: AxiosResponse<Question[]> = await api.get<Question[]>(this.apiURL);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async findQuestionById(id: number): Promise<Question> {
        try {
            const response: AxiosResponse<Question> = await api.get<Question>(`${this.apiURL}/${id}`);
            return response.data;
        } catch (error:any) {
            console.log(error.response.data.message);
            return  Promise.reject(error);
        }
    }

    public async updateQuestion(question: Question): Promise<string> {
        const questionSned= {
            id: question.id,
            minimal: question.idQualificatif?.minimal,
            intitule: question.intitule,
            type: question.type,

        };
        console.log(questionSned)
        try {


            const response: AxiosResponse<string> = await api.post<string>(`${this.apiURL}/update`, questionSned);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            await api.get(`${this.apiURL}/delete/${id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async questionIsUsedInRubriqueOrEvaluation(id: any): Promise<boolean> {
        try {
            const response = await  api.get(`${this.apiURL}/questionIsUsedInRubriqueOrEvaluation/${id}`)
            return response.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}
