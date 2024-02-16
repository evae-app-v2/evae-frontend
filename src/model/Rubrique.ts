export class Rubrique {
    id?: number | null;
    type: string;
    noEnseignant: any | null;
    designation: string;
    ordre: number | null;

    constructor(type: string, noEnseignant: number | null, designation: string, ordre: number | null, id?: number) {
        this.id = id !== undefined ? id : null;
        this.type = type;
        this.noEnseignant = noEnseignant;
        this.designation = designation;
        this.ordre = ordre;
    }
}
