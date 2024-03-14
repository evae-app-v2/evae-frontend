
import { QuestionEvaluation } from './QuestionEvaluation';


export class RubriqueEvaluation {
    idEvaluation: any; // Utilisez un type plus spécifique si possible
    idRubrique: number;
    ordre: number;
    questionEvaluations: QuestionEvaluation[];

    constructor(idEvaluation : any, idRubrique: number, ordre: number, questionEValuations: QuestionEvaluation[]) {
        this.idEvaluation = idEvaluation;
        this.idRubrique = idRubrique;
        this.ordre = ordre;
        this.questionEvaluations = questionEValuations;
    }

}