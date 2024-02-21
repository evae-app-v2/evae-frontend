
import { RubriqueDTO } from "./RubriqueDTO";
import { QuestionDTO } from "./QuestionDTO";
import {RubriqueQuestions} from "./RubriqueQuestions";
export class RubriqueComposeDTO {
    id?: number | null;
    listRubriqueQuestion:RubriqueQuestions[];


    constructor(id: number | null, listRubriqueQuestion: RubriqueQuestions[]) {
        this.id = id;
        this.listRubriqueQuestion = listRubriqueQuestion;
    }
}





