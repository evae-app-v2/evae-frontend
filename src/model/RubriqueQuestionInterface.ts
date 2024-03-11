
export interface Qualificatif {
    id: number;
    minimal: string;
    maximal: string;
}

export interface Question {
    id: number;
    type: string;
    idQualificatif: Qualificatif;
    intitule: string;
    ordre: number;
}

export interface Rubrique {
    id: number;
    type: string;
    designation: string;
    ordre: number;
}

export interface RubriqueQuestionDTOO {
    rubrique: Rubrique;
    questions: Question[];
}
