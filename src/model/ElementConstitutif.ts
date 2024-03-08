export class ElementConstitutif {
    designation: string;
    description: string;
    codeEc: string;

    constructor(designation: string, description: string, codeEc: string) {
        this.designation = designation;
        this.description = description;
        this.codeEc = codeEc;
    }
}