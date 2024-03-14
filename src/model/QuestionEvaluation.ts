export class QuestionEvaluation {
    idQuestion: any; // Utilisez un type plus spécifique si possible
    ordre: number;

    constructor(idQuestion : any, ordre: number) {
        this.idQuestion = idQuestion;
        this.ordre = ordre;
    }
}