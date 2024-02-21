export class QualificatifDTO {
    id: number;
    maximal: string;
    minimal: string;

    constructor(id: number, maximal: string, minimal: string) {
        this.id = id;
        this.maximal = maximal;
        this.minimal = minimal;
    }
}
