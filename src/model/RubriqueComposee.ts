import { Question } from './Question';

export class RubriqueComposee {
    id?: number;
    idRubrique?: number; 
    type: string;
    designation: string;
    ordre: number;
    questions: any;

    constructor(id: number, type: string, designation: string, ordre: number, questions: any, idRubrique?: number) {
        this.id = id;
        this.type = type;
        this.designation = designation;
        this.ordre = ordre;
        this.questions = questions;
        this.idRubrique = idRubrique;
    }
}
