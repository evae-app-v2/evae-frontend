import { Question } from './Question';

export class RubriqueComposee {
    id?: number;
    idRubrique?: number; 
    type: string;
    designation: string;
    ordre: number;
    questions: Question[]; 

    constructor(id: number, type: string, designation: string, ordre: number, questions: Question[], idRubrique?: number) {
        this.id = id;
        this.type = type;
        this.designation = designation;
        this.ordre = ordre;
        this.questions = questions;
        this.idRubrique = idRubrique;
    }
}
