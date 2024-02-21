export class Enseignant {
    id: number;
    emailUbo: string;
    nom: string;
    prenom: string;

    constructor(id: number, emailUbo: string, nom: string, prenom: string) {
        this.id = id;
        this.emailUbo = emailUbo;
        this.nom = nom;
        this.prenom = prenom;
    }
}



