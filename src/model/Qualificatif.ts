export class Qualificatif {
    id?: any;
    maximal: any;
    minimal: any;

    constructor(maximal?: string, minimal?: string, id?: any) {
        if (maximal !== undefined && minimal !== undefined) {
            this.id = id !== undefined ? id : null;
            this.maximal = maximal;
            this.minimal = minimal;
        } else {
            // Si les arguments maximal et minimal ne sont pas fournis, initialisez-les à null
            this.maximal = null;
            this.minimal = null;
            this.id = null;
        }
    }
}
