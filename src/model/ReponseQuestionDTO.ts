export class ReponseQuestionDTO {
    idQuestionEvaluation: number;
    positionnement: number;

    constructor(idQuestionEvaluation: number, positionnement: number) {
        this.idQuestionEvaluation = idQuestionEvaluation;
        this.positionnement = positionnement;
    }
}
