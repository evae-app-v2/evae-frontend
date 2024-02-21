export class RubriqueDTO {
    id: number;
    type: string;
    designation: string;
    ordre: number;

    constructor(id: number, type: string, designation: string, ordre: number = 0) {
        this.id = id;
        this.type = type;
        this.designation = designation;
        this.ordre = ordre;
    }
}
