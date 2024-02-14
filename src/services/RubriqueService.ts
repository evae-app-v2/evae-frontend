import { api, headerAPI } from "../config/axios";
import {Rubrique} from "../model/Rubrique";


export class PersonService {

    private apiURL = "v1/rubrique";

    public async getAll() {
        try {
            console.log("Consulto")
            const response = await api.get<Rubrique[]>(`${this.apiURL}`)
            return await response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async post(data:Rubrique) {
        try {
            const response = await api.post<Rubrique>(`${this.apiURL}`, data, headerAPI)
            return await response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async getById(id:number){
        try {
            const response = await api.get<Rubrique>(`${this.apiURL}/${id}`, headerAPI)
            const data: Rubrique = response.data
            return data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async put(data:Rubrique) {
        try {
            const response = await api.put<Rubrique>(`${this.apiURL}/${data.id}`, data, headerAPI)
            return await response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async delete(data:Rubrique) {
        try {
            const response = await api.delete(`${this.apiURL}/${data.id}`, headerAPI)
            return await response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

}