import { api } from "../config/axios";
import { Evaluation } from '../model/Evaluation';
import { ElementConstitutif } from "../model/ElementConstitutif";
import { Promotion } from "../model/Promotion";
import { UniteEnseignement } from "../model/UniteEnseignement";
import { PreparedData } from "../model/PreparedData";
import {ReponseEvaluationDTO} from "../model/ReponseEvaluationDTO";


export class EvaluationService {

    private apiURL = "/api/v1/evaluation";

    public async findAllEvaluations(): Promise<Evaluation[]> {
        try {
            const response = await api.get<Evaluation[]>(this.apiURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getEvaluationsEtudiant(): Promise<Evaluation[]> {
        try {
            const response = await api.get<Evaluation[]>(`${this.apiURL}/etudiant`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async avancerWorkflow(idEvaluation:any): Promise<any> {
        try {
            const response = await api.post<Evaluation[]>(`${this.apiURL}/avancerWorkflow/${idEvaluation}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getPromotionsByEnseignant(): Promise<Promotion[]> {
        try {
            const response = await api.get<Promotion[]>(`${this.apiURL}/get-Promotions-By-Enseignant`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getPromotionsByEnseignantAndFormation(anneePro: string): Promise<Promotion[]> {
        try {
            const response = await api.get<Promotion[]>(`${this.apiURL}/get-Formations-By-Enseignant-And-Annee/${anneePro}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }    

    public async getUniteEnseignementByCodeFormationAndNoEnseignant(codeFormation: string): Promise<UniteEnseignement[]> {
        try {
            const response = await api.get<UniteEnseignement[]>(`${this.apiURL}/get-Ue-By-Enseignant-And-Formation/${codeFormation}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getElementConstitutifByNoEnseignantAndCodeFormationAndCodeUe(codeFormation: string, codeUe: string): Promise<ElementConstitutif[]> {
        try {
            const response = await api.get<ElementConstitutif[]>(`${this.apiURL}/get-Ec-By-Enseignant-And-Formation/${codeFormation}/${codeUe}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async addEvaluation(Evaluation: Evaluation): Promise<Evaluation> {
        try {
            console.log(Evaluation)
            const response = await api.post<Evaluation>(`${this.apiURL}/ajouter`, Evaluation);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateEvaluation(Evaluation: Evaluation): Promise<Evaluation> {
        try {
            console.log(Evaluation)
            const response = await api.post<Evaluation>(`${this.apiURL}/update`, Evaluation);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async delete(id: any): Promise<void> {
        try {
            return api.get(`${this.apiURL}/delete/${id}`)
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    public async getEvaluationById(id:any): Promise<Evaluation> {
        try {
            const response = await api.get<Evaluation>(`${this.apiURL}/getEvaluationById/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async repondreEvaluation(reponseEvaluationDTO:ReponseEvaluationDTO): Promise<any> {
        try {
            const response = await api.post<string>(`${this.apiURL}/repondre`,reponseEvaluationDTO);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async isEtudiantRepondreEvaluation(id:any): Promise<any> {
        try {
            const response = await api.get<any>(`${this.apiURL}/isEtudiantRepondreEvaluation/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }




}