export class RubriqueQuestions {
    idRubrique?: number | undefined ;
    idQuestion?: number | undefined;
    ordre: number;
    

    constructor(ordre: number , idRubrique?: number | undefined , idQuestion?: number | undefined ) {
        this.idRubrique = idRubrique;
        this.idQuestion = idQuestion;
        this.ordre = ordre;
    }
}