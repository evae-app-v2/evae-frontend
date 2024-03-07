
import { QualificatifDTO } from "./QualificatifDTO";

export class QuestionDTO {
    id: number;
    idQualificatif: QualificatifDTO;
    intitule: string;
    ordre: number;
    type: string;
    positionnements?: any

    constructor(id: number, idQualificatif: QualificatifDTO, intitule: string, type: string, ordre: number = 0,positionnements?: any) {
        this.id = id;
        this.idQualificatif = idQualificatif;
        this.intitule = intitule;
        this.type = type;
        this.ordre = ordre;
        this.positionnements = positionnements;
    }
}
