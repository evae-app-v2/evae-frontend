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
    public async getEvaluationsEtudiant(): Promise<Evaluation[]> {
        try {
            const response = await api.get<Evaluation[]>(`${this.apiURL}/etudiant`);
            return response.data;
        } catch (error) {
            //console.error(error);
            throw error;
        }
    }
    public async avancerWorkflow(idEvaluation:any): Promise<any> {
        try {
            const response = await api.post<Evaluation[]>(`${this.apiURL}/avancerWorkflow/${idEvaluation}`);
            return response.data;
        } catch (error) {
            //console.error(error);
            throw error;
        }
    }


}