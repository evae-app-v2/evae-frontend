import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Evaluation } from '../../model/Evaluation';
import { DialogDelete } from '../DialogDelete';
import { EvaluationDetails } from './evaluationDetailsEtudiant';
import { Qualificatif } from '../../model/Qualificatif';
import { Statics } from '../statics';
import {EvaluationService} from "../../services/EvaluationService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheckCircle, faEye, faGear, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {faPlay} from "@fortawesome/free-solid-svg-icons/faPlay";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import RepondreEvaluation from "./repondreEvaluation";
import {useNavigate} from "react-router-dom";

const EvaluationEtudiantList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idQualificatif, setIdQualificatif] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [evaluationToUpdate, setEvaluationToUpdate] = useState<Evaluation >();
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(); // Use initialData to initialize evaluation
    const [disabledButtons, setDisabledButtons] = useState<{ [id: number]: boolean }>({});

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const evaluationService = new EvaluationService();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData().then((data)=>{
            console.log(disabledButtons)
        })
        // loadEvaluations();
    }, [evaluations]);

    const loadEvaluations = async () => {
        try {
            const response = await evaluationService.getEvaluationsEtudiant();
            response.sort((a, b) => b.noEvaluation - a.noEvaluation);
            setEvaluations(response);
        } catch (error) {
            console.error("Erreur lors du chargement des évaluations:", error);
            toast.error("Erreur lors du chargement des évaluations.");
        }
    };
    const fetchData = async () => {
        try {
            const response = await evaluationService.getEvaluationsEtudiant();
            response.sort((a, b) => b.noEvaluation - a.noEvaluation);
            setEvaluations(response);

            const updatedDisabledButtons: { [id: number]: boolean } = {};
            const promises = evaluations.map(async (evaluation) => {
                const isDisabled = await testDisabled(evaluation.id);
                updatedDisabledButtons[evaluation.id ?? ''] = isDisabled;
            });
            await Promise.all(promises);
            setDisabledButtons(updatedDisabledButtons);
        } catch (error) {
            console.error("Erreur lors du chargement des évaluations:", error);
            toast.error("Erreur lors du chargement des évaluations.");
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
    /* const estRepondre = async (id: any): Promise<boolean> => {
         try {
             const response = await evaluationService.isEtudiantRepondreEvaluation(id);
             return response?.estRepondre; // Utilisez !! pour convertir la valeur en booléen
         } catch (error) {
             console.error("Une erreur s'est produite lors de la récupération des données :", error);
             return false; // Retourner une valeur par défaut ou gérer l'erreur selon les besoins de votre application
         }
     };*/
    const estRepondre = async (id: any): Promise<boolean> => {
        try {
            const response = await evaluationService.isEtudiantRepondreEvaluation(id);
            return response?.estRepondre; // Utilisez !! pour convertir la valeur en booléen
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des données :", error);
            return false; // Retourner une valeur par défaut ou gérer l'erreur selon les besoins de votre application
        }
    };



    const testDisabled=async (id: any) => {
        return await estRepondre(id);
    }

    const handleOpenDialog = (evaluation:any) => {
        setEvaluationToUpdate(evaluation)
        setDialogOpen(true);
        console.log(evaluation)


    };
    const handleOpenDialogUpdate = (evaluation: Evaluation) => {
        setEvaluationToUpdate(evaluation);
        setIsUpdate(true);
        setDialogOpen(true);
    };
    const handleOpenDialogDelete = (id: any) => {
        console.log(id);
        setIdQualificatif(id)
        setDialogDeleteOpen(true);
    };


    const handleEtat = (etat: string) => {
        // Style pour les spans
        const spanStyle: React.CSSProperties = {
            padding: '0.3rem 1rem', // Ajustez les valeurs de marge selon vos besoins
            fontWeight: '600',
            borderRadius: '0.5rem', // Arrondi des coins
            display: 'inline-block',
            textAlign: 'center' as React.CSSProperties['textAlign'], // Forcer le type TextAlign
            minWidth: '13rem', // Largeur fixe pour les spans
        };

        switch (etat) {
            case "ELA":
                return <span style={{ ...spanStyle, color: '#D18000', backgroundColor: '#FFDAB9' }}> En cours d'élaboration</span>;

            case "DIS":
                return <span style={{ ...spanStyle, color: '#008000', backgroundColor: '#98FB98' }}> Mise à disposition</span>;

            case "CLO":
                return <span style={{ ...spanStyle, color: '#8B0000', backgroundColor: '#FFC0CB' }}>  Clôturée</span>;

            default:
                return null;
        }
    };
    const handleRepondre = (id:any) => {
        // Supposons que vous avez un ID à passer

        // Rediriger vers le nouveau composant avec l'ID dans l'URL
        navigate(`/evae/repondre-evaluation/${id}`);
    };

    const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear().toString();
        return `${jour}-${mois}-${annee}`;
    };


    return (
        <>
            <section className="container px-4 mx-auto mt-7 ">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">

                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des évaluations &nbsp;
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{evaluations.length}</span>
                    </h2>

                </div>

                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg" style={{maxHeight: 'calc(6 * 90px)', overflowY: 'auto'}}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" style={{ textAlign: "center" }}>No
                                            Évaluation
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" style={{ textAlign: "center" }}>Désignation
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold"style={{ textAlign: "center" }}>Code
                                            Formation
                                        </th>

                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold"style={{ textAlign: "center" }}>Enseignant
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold"style={{ textAlign: "center" }}>Promotion
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold"style={{ textAlign: "center" }}>UE
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" style={{ textAlign: "center" }}>EC
                                        </th><th scope="col"
                                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" style={{ textAlign: "center" }}>Fin de réponse
                                    </th>


                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" style={{ textAlign: "center" }}>État
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider font-semibold" >Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {evaluations.map((evaluation, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div >
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.noEvaluation}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.designation}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.codeFormation}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.noEnseignant.prenom + ' ' + evaluation.noEnseignant.nom}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.promotion}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.codeUE}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{evaluation.codeEC ? evaluation.codeEC : '--'}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}> {formatDate(evaluation.finReponse)}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{handleEtat(evaluation.etat)}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="flex items-center justify-center gap-x-6">
                                                    <button
                                                        disabled={!disabledButtons[evaluation.id]}
                                                        className={`transition - colors duration-200 hover:text-blue-900 focus:outline-none ${!disabledButtons[evaluation.id] ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-blue-900 dark:hover:text-blue-900"}`}
                                                        title={!disabledButtons[evaluation.id ?? '']? "Vous ne pouvez pas accéder à vos réponses car vous n'avez pas encore fourni de réponse." : ""}
                                                        onClick={() => handleOpenDialog(evaluation)}>
                                                        <FontAwesomeIcon icon={faEye} className="w-5 h-5"/>
                                                    </button>
                                                    <button
                                                        disabled={disabledButtons[evaluation.id] || evaluation.etat=="CLO"}
                                                        className={`transition - colors duration-200 hover:text-green-900 focus:outline-none ${(disabledButtons[evaluation.id] || evaluation.etat=="CLO") ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-green-900 dark:hover:text-green-900"}`}
                                                        title={disabledButtons[evaluation.id] ? "Vous avez déjà répondu à cette Évaluation." : ""}
                                                        onClick={() => handleRepondre(evaluation.id)}
                                                    >
                                                        <div>
                                                            <FontAwesomeIcon
                                                                className={`text - light - green - 800 ${disabledButtons[evaluation.id] ? "filter grayscale" : ""}`}
                                                                icon={faCheckCircle}
                                                                style={{
                                                                    width: '1.25rem',
                                                                    height: '1.25rem'
                                                                }} // Taille personnalisée pour correspondre à celle de l'icône "eye"
                                                            />
                                                        </div>
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <EvaluationDetails
                open={dialogOpen}
                setOpen={setDialogOpen}
                initialData={evaluationToUpdate} // Passe les données de la rubrique à mettre à jour
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression du couple qualificatif"
                messageComp="Voulez-vous vraiment supprimer ce couple qualificatif ?"
                id={idQualificatif}
                name={"qualificatif"}
                setOpen={setDialogDeleteOpen}/>
        </>
    );
}

export default EvaluationEtudiantList;