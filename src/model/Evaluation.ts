import { Enseignant } from "./Enseignant";
import { RubriqueComposee } from './RubriqueComposee';


export class Evaluation {
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
    rubriques: any | RubriqueComposee[] ;

    constructor(id: any, noEnseignant: any, codeFormation: any, codeUE: any, codeEC: any | null, promotion: any, noEvaluation: any, designation: any, etat: any, periode: any, debutReponse: any, finReponse: any, rubriques: any) {
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
        this.rubriques = rubriques;
    }
}