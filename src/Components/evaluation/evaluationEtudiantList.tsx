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
import {faEye} from "@fortawesome/free-solid-svg-icons";
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

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const evaluationService = new EvaluationService();
    const navigate = useNavigate();

    useEffect(() => {
        loadEvaluations();
    }, []);

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

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
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
        switch (etat) {
            case "ELA":
                // Traitement à effectuer lorsque etat === "ELA"
                return <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-sm mr-6">En cours d'élaboration</span>;

            case "DIS":
                // Traitement à effectuer lorsque etat === "DIS"
                return <span className="px-2 py-1 font-semibold leading-tight text-green-800 bg-green-100 rounded-sm mr-6">Mise à disposition</span>;

            case "CLO":
                // Traitement à effectuer lorsque etat === "CLO"
                return <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm mr-6">Clôturée</span>;

            default:
                // Traitement par défaut si etat ne correspond à aucun des cas précédents
                break;
        }
    };

    const handleRepondre = (id:any) => {
        // Supposons que vous avez un ID à passer

        // Rediriger vers le nouveau composant avec l'ID dans l'URL
        navigate(`/evae/repondre-evaluation/${id}`);
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
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold" style={{ textAlign: "center" }}>No
                                            Évaluation
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold" style={{ textAlign: "center" }}>Désignation
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold"style={{ textAlign: "center" }}>Code
                                            Formation
                                        </th>

                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold"style={{ textAlign: "center" }}>Enseignant
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold"style={{ textAlign: "center" }}>Promotion
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold"style={{ textAlign: "center" }}>UE
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold" style={{ textAlign: "center" }}>EC
                                        </th>

                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold" style={{ textAlign: "center" }}>État
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold" >Action
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
                                                                style={{textAlign: "center"}}>{handleEtat(evaluation.etat)}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ textAlign: "center" }}>
                                                <div className="flex items-center justify-center gap-x-6">


                                                    <button
                                                        className="text-orange-300 transition-colors duration-200 dark:text-gray-300 focus:outline-none"
                                                        onClick={() => handleOpenDialog(evaluation)}>
                                                        <FontAwesomeIcon icon={faEye} className="w-5 h-5"/>
                                                    </button>
                                                    <button
                                                        disabled={evaluation.etat === "CLO"}
                                                        title={evaluation.etat === "CLO" ? "Évaluation est clôturée" : ""}
                                                        onClick={()=>handleRepondre(evaluation.id)}
                                                    >
                                                        <img
                                                            width="20"
                                                            height="20"
                                                            src="https://img.icons8.com/external-microdots-premium-microdot-graphic/20/external-exam-education-science-vol1-microdots-premium-microdot-graphic.png"
                                                            alt="external-exam-education-science-vol1-microdots-premium-microdot-graphic"
                                                            className={evaluation.etat === "CLO" ? "filter grayscale" : ""}
                                                        />
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