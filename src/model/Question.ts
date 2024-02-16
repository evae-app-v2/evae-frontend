import { Qualificatif } from './Qualificatif'; // Assurez-vous d'importer correctement la classe Qualificatif

export class Question {
    id?: number;
    type: string;
    idQualificatif: Qualificatif | null;
    intitule: string;

    constructor(type: string, idQualificatif: Qualificatif | null, intitule: string, id?: number) {
        this.id = id;
        this.type = type;
        this.idQualificatif = idQualificatif;
        this.intitule = intitule;
    }
}
