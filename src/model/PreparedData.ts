import { RubriqueEvaluation } from './RubriqueEvaluation';


export class PreparedData {
    id: any;
    noEnseignant: any;
    codeFormation: any;
    codeUE: any;
    codeEC: any | null;
    promotion: any;
    noEvaluation: any;
    designation: any;
    etat: any;
    periode: any;
    debutReponse: any;
    finReponse: any;
    rubriqueEvaluations: RubriqueEvaluation[] | null;

    constructor(rubriqueEvaluations : RubriqueEvaluation[] | null , id: any, noEnseignant: any, codeFormation: any, codeUE: any, codeEC: any | null, promotion: any, noEvaluation: any, designation: any, etat: any, periode: any, debutReponse: any, finReponse: any) {
        this.rubriqueEvaluations = rubriqueEvaluations;
        this.id = id;
        this.noEnseignant = noEnseignant;
        this.codeFormation = codeFormation;
        this.codeUE = codeUE;
        this.codeEC = codeEC;
        this.promotion = promotion;
        this.noEvaluation = noEvaluation;
        this.designation = designation;
        this.etat = etat;
        this.periode = periode;
        this.debutReponse = debutReponse;
        this.finReponse = finReponse;
    }
}