import { ReponseQuestionDTO } from './ReponseQuestionDTO';

export class ReponseEvaluationDTO {
    idEvaluation?: number;
    commentaire?: string;
    reponseQuestionDTOs?: ReponseQuestionDTO[];

    constructor();
    constructor(idEvaluation: number, commentaire: string, reponseQuestionDTOs: ReponseQuestionDTO[]);
    constructor(idEvaluation?: number, commentaire?: string, reponseQuestionDTOs?: ReponseQuestionDTO[]) {
        this.idEvaluation = idEvaluation;
        this.commentaire = commentaire;
        this.reponseQuestionDTOs = reponseQuestionDTOs;
    }
    setCommentaire(commentaire: string) {
        this.commentaire = commentaire;
    }
}
