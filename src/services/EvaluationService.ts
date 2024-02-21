import { api } from "../config/axios";
import { Evaluation } from '../model/Evaluation'; 

export class EvaluationService {

    private apiURL = "/api/v1/evaluation";

    public async findAllEvaluations(): Promise<Evaluation[]> {
        try {
            const response = await api.get<Evaluation[]>(this.apiURL);
            return response.data;
        } catch (error) {
            //console.error(error);
            throw error;
        }
    }


}