import { api } from "../config/axios";
import { Qualificatif } from '../model/Qualificatif'; // Assurez-vous d'importer correctement le modèle Qualificatif

export class QualificatifService {
    private apiURL = "/qualificatifs";

    public async addQualificatif(qualificatif: Qualificatif): Promise<Qualificatif> {
        try {
            console.log(qualificatif)
            const response = await api.post<Qualificatif>("/addQualificatif", qualificatif);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async findAllQualificatifs(): Promise<Qualificatif[]> {
        try {
            const response = await api.get<Qualificatif[]>(this.apiURL);
            return response.data;
        } catch (error) {
            //console.error(error);
            throw error;
        }
    }

    public async findQualificatifById(id: number): Promise<Qualificatif> {
        try {
            const response = await api.get<Qualificatif>(`/qualificatif/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateQualificatif(qualificatif: Qualificatif): Promise<Qualificatif> {
        try {
            console.log(qualificatif)
            const response = await api.post<Qualificatif>("/update", qualificatif);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async delete(id: any): Promise<void> {
        try {
            return api.get(`/delete/${id}`)
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    public async qualificatifIsUsedInQuestion(id: any): Promise<boolean> {
        try {
            const response = await  api.get(`/qualificatifIsUsedInQuestion/${id}`)
            return response.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }



}
