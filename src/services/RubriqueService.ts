import { api } from "../config/axios";
import { Rubrique } from '../model/Rubrique';

export class RubriqueService {
    private apiURL = "rubriques";

    public async getAll(): Promise<Rubrique[]> {
        try {
            const response = await api.get<Rubrique[]>(`${this.apiURL}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateOrdre(updatedRubriquesData: any[]) {
        try {
            const response = await api.post(`${this.apiURL}/update-ordre`, updatedRubriquesData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: number): Promise<Rubrique> {
        try {
            const response = await api.get<Rubrique>(`${this.apiURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getByDesignation(designation: string): Promise<Rubrique | null> {
        try {
            const response = await api.get<Rubrique>(
                `${this.apiURL}/designation/${designation}`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async create(data: Rubrique): Promise<Rubrique> {
        console.log(data);
        try {
            const response = await api.post<Rubrique>(`${this.apiURL}`, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    public async update(data: Rubrique): Promise<Rubrique> {
        try {
            const response = await api.post<Rubrique>(
                `${this.apiURL}/update/${data.id}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async delete(id: any): Promise<void> {
        try {
            await api.get(`${this.apiURL}/delete/${id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async rubriqueIsUsedInEvaluation(id: any): Promise<boolean> {
        try {
            const response = await  api.get(`${this.apiURL}/rubriqueIsUsedInEvaluation/${id}`)
            return response.data;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

}
