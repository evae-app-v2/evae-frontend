import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Evaluation } from '../../model/Evaluation';
import { DialogDelete } from '../DialogDelete';
import { EvaluationDetails } from './evaluationDetails';
import { Qualificatif } from '../../model/Qualificatif';
import { Statics } from '../statics';
import { EvaluationService } from "../../services/EvaluationService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faEye, faGear, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { EvaluationForm } from './evaluationForm';
import { DialogChangeEtat } from "./dialogueChangeEtat";


const EvaluationsList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idQualificatif, setIdQualificatif] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [dialogueChangeOpen, setDialogeChangeOpen] = useState(false);

    const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [evaluationToUpdate, setEvaluationToUpdate] = useState<Evaluation | undefined>();
    const [idEvaluation, setIdEvaluation] = useState();
    const [evaluationToShow, setEvaluationToShow] = useState<Evaluation>();
    const [isEvaluationFormOpen, setIsEvaluationFormOpen] = useState(false);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [evaluation, setEvaluation] = useState<Evaluation>();
    const evaluationService = new EvaluationService();
    const [messageToDelete, setMessageToDelete] = useState("");
    const [initialLoadDone, setInitialLoadDone] = useState(false); // Etat pour suivre si le chargement initial est effectué



    useEffect(() => {
        loadEvaluations();
    }, [evaluations]);

    const loadEvaluations = async () => {
        try {
            const response = await evaluationService.findAllEvaluations();
            response.sort((a, b) => b.noEvaluation - a.noEvaluation);
            setEvaluations(response);
        } catch (error) {
            console.error("Erreur lors du chargement des évaluations:", error);
            toast.error("Erreur lors du chargement des évaluations.");
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    /*    const handleOpenDialog = (evaluation: Evaluation) => {
            setEvaluationToUpdate(evaluation);
            setDialogOpen(true);
        };*/

    const handleOpenDialog = (evaluation: any) => {
        setEvaluationToShow(evaluation);
        setDialogOpen(true);
        console.log(evaluation)
        setIsUpdate(false);
    };

    const handleOpenDialogUpdate = (evaluation: Evaluation) => {
        setEvaluationToUpdate(evaluation);
        setIsUpdate(true);
        setIsEvaluationFormOpen(true);
    };
    const handleOpenDialogDelete = (id: any, evaluation: Evaluation) => {
        console.log(id);
        setIdEvaluation(id)
        setEvaluation(evaluation);
        const message = `Voulez-vous vraiment supprimer l'évaluation "${evaluation.designation}" ?`;
        setMessageToDelete(message);
        setDialogDeleteOpen(true);

    };

    const handleCreateNewEvaluation = () => {
        setIsUpdate(false); // Indique que ce n'est pas une mise à jour
        setIsEvaluationFormOpen(true);
        setEvaluationToUpdate(undefined);

        // Ouvre le formulaire
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
                return <span style={{ ...spanStyle, color: '#D18000', backgroundColor: '#FFDAB9' }}> <FontAwesomeIcon icon={faGear} /> En cours d'élaboration</span>;

            case "DIS":
                return <span style={{ ...spanStyle, color: '#008000', backgroundColor: '#98FB98' }}> <FontAwesomeIcon icon={faPaperPlane} /> Mise à disposition</span>;

            case "CLO":
                return <span style={{ ...spanStyle, color: '#8B0000', backgroundColor: '#FFC0CB' }}> <FontAwesomeIcon icon={faBan} /> Clôturée</span>;

            default:
                return null;
        }
    };
    function handleEtat2(etat: string, evaluation: any) {
        switch (etat) {
            case "ELA":
                return `Êtes-vous sûr(e) de vouloir publier l'évaluation "${evaluation.designation}" ?`;
            case "DIS":
                return `Êtes-vous sûr(e) de vouloir clôturer l'évaluation "${evaluation.designation}" ?`;
            case "CLO":
                return `Impossible de changer l'état de l'évaluation "${evaluation.designation}" car elle est déjà clôturée.`;
            default:
                return "Changer l'état de l'évaluation !";
        }
    }


    const handleChange = (evaluation: any) => {
        setEvaluation(evaluation);
        setDialogeChangeOpen(true);


    }

    return (
        <>
            <section className="container px-4 mx-auto mt-7 ">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des évaluations &nbsp;
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{evaluations.length}</span>
                    </h2>
                    <Button
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined}
                        onClick={handleCreateNewEvaluation}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Ajouter</span>
                    </Button>
                </div>

                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg" style={{ maxHeight: 'calc(6 * 90px)', overflowY: 'auto' }}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 ">
                                    <tr>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>No Évaluation</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>Désignation</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>Formation</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>Promotion</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>UE</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>EC</th>
                                        <th scope="col" className="px-4 py-4 text-sm font-normal text-center rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>État</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400" style={{ textAlign: "center" }}>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {evaluations.map((evaluation, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.noEvaluation}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.designation}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.codeFormation}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.promotion}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.codeUE}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" style={{ textAlign: "center" }}>{evaluation.codeEC ? evaluation.codeEC : '--'}</td>
                                            <td className="px-4 py-4 text-sm font-medium  text-center text-gray-700 whitespace-nowrap"><button onClick={() => handleChange(evaluation)}> {handleEtat(evaluation.etat)}</button></td>

                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-x-6">
                                                    <button
                                                        className="text-blue-900 transition-colors duration-200 dark:hover:text-green-500 dark:text-gray-300 hover:text-green-500 focus:outline-none" onClick={() => handleOpenDialog(evaluation)} >
                                                        <FontAwesomeIcon icon={faEye} className="w-5 h-5" />

                                                    </button>

                                                    <button
                                                        onClick={() => handleOpenDialogUpdate(evaluation)}
                                                        disabled={evaluation.etat !== "ELA"}
                                                        title={evaluation.etat !== "ELA" ? "Impossible de modifier cette évaluation car elle n'est plus en cours d'élaboration." : ""}
                                                        className={`transition-colors duration-200 hover:text-blue-600 focus:outline-none ${evaluation.etat !== "ELA" ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-blue-600 dark:hover:text-yellow-400"}`}                                                        >

                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDialogDelete(evaluation.noEvaluation, evaluation)}

                                                        disabled={evaluation.etat !== "ELA"}
                                                        title={evaluation.etat !== "ELA" ? "Impossible de supprimer cette évaluation car elle n'est plus en cours d'élaboration." : ""}

                                                        className={`transition-colors duration-200 hover:text-red-500 focus:outline-none ${evaluation.etat !== "ELA" ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-red-500 dark:hover:text-red-400"}`}                                                        >

                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
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

            <EvaluationForm
                open={isEvaluationFormOpen}
                setOpen={setIsEvaluationFormOpen}
                isUpdate={isUpdate} // Indique si c'est une mise à jour ou une création
                initialData={evaluationToUpdate}
            />


            <EvaluationDetails
                open={dialogOpen}
                setOpen={setDialogOpen}
                initialData={evaluationToShow} // Passe les données de la rubrique à mettre à jour
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression d'une évaluation"
                messageComp={messageToDelete}
                id={idEvaluation}
                name="evaluation"
                setOpen={setDialogDeleteOpen}
            />


            <DialogChangeEtat
                open={dialogueChangeOpen}
                onClose={() => setDialogeChangeOpen(false)}
                title="Faire Avancé l'état d'une evaluation"
                messageComp={handleEtat2(evaluation?.etat,evaluation)}
                eva={evaluation}
                name={"evaluation"}
                setOpen={setDialogeChangeOpen} />


        </>
    );
}

export default EvaluationsList;