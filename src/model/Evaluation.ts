import { Enseignant } from "./Enseignant";
import { RubriqueComposee } from './RubriqueComposee';


export class Evaluation {
    id: number;
    noEnseignant: Enseignant;
    codeFormation: string;
    codeUE: string;
    codeEC: string | null;
    promotion: string;
    noEvaluation: number;
    designation: string;
    etat: string;
    periode: string;
    debutReponse: string;
    finReponse: string;
    rubriques: RubriqueComposee[];

    constructor(id: number, noEnseignant: Enseignant, codeFormation: string, codeUE: string, codeEC: string | null, promotion: string, noEvaluation: number, designation: string, etat: string, periode: string, debutReponse: string, finReponse: string, rubriques: RubriqueComposee[]) {
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