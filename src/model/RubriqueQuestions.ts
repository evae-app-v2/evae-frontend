
import { RubriqueDTO } from "./RubriqueDTO";
import { QuestionDTO } from "./QuestionDTO";
export class RubriqueQuestions {
    idRubrique?: number | null;
    idQuestion?: number;
    ordre: number;
    rubriqueDTO?: RubriqueDTO;
    questionDTO?: QuestionDTO;

    constructor(ordre: number, idRubrique?: number | null, idQuestion?: number, rubriqueDTO?: RubriqueDTO, questionDTO?: QuestionDTO) {
        this.idRubrique = idRubrique !== undefined ? idRubrique : null;
        this.idQuestion = idQuestion;
        this.ordre = ordre;
        this.rubriqueDTO = rubriqueDTO;
        this.questionDTO = questionDTO;
    }
}





