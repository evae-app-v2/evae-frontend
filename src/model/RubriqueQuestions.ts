
export class RubriqueQuestions {
    idRubrique: number ;
    idQuestion: number;
    ordre: number;

    constructor( idRubrique: number , idQuestion: number, ordre: number) {
        this.idRubrique = idRubrique;
        this.idQuestion = idQuestion;
        this.ordre = ordre;
    }
}

