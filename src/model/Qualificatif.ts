export class Qualificatif {
    id?: number | null;
    maximal: string;
    minimal: string;

    constructor(maximal: string, minimal: string, id?: any) {
        this.id = id !== undefined ? id : null;
        this.maximal = maximal;
        this.minimal = minimal;
    }
}
