export class Promotion {
    anneePro: string;
    codeFormation: string;
    siglePro: string;
    nbEtuSouhaite: number | null;
    etatPreselection: string;
    dateRentree: Date;
    lieuRentree: string;
    dateReponseLp: Date;
    commentaire: string;
    dateReponseLalp: Date;
    processusStage: string;

    constructor(
        anneePro: string,
        codeFormation: string,
        siglePro: string,
        nbEtuSouhaite: number | null,
        etatPreselection: string,
        dateRentree: Date,
        lieuRentree: string,
        dateReponseLp: Date,
        commentaire: string,
        dateReponseLalp: Date,
        processusStage: string
    ) {
        this.anneePro = anneePro;
        this.codeFormation = codeFormation;
        this.siglePro = siglePro;
        this.nbEtuSouhaite = nbEtuSouhaite;
        this.etatPreselection = etatPreselection;
        this.dateRentree = dateRentree;
        this.lieuRentree = lieuRentree;
        this.dateReponseLp = dateReponseLp;
        this.commentaire = commentaire;
        this.dateReponseLalp = dateReponseLalp;
        this.processusStage = processusStage;
    }
}
