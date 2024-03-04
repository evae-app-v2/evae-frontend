import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Evaluation } from '../../model/Evaluation';
import { DialogDelete } from '../DialogDelete';
import { EvaluationDetails } from './evaluationDetails';
import { Qualificatif } from '../../model/Qualificatif';
import { Statics } from '../statics';
import {EvaluationService} from "../../services/EvaluationService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const EvaluationsList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idQualificatif, setIdQualificatif] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [evaluationToUpdate, setEvaluationToUpdate] = useState<Evaluation >();

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const evaluationService = new EvaluationService();

    useEffect(() => {
        loadEvaluations();
    }, [evaluations]);

    const loadEvaluations = async () => {
        try {
            const response = await evaluationService.findAllEvaluations();
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


    return (
        <>
            <section className="container px-4 mx-auto mt-7 ">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">

                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des évaluations &nbsp;
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{evaluations.length}</span>
                    </h2>
                    <Button
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200  rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span >Créer une evaluation</span>
                    </Button>
                </div>

                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg" style={{maxHeight: 'calc(6 * 90px)', overflowY: 'auto'}}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No Évaluation</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code Formation</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Promotion</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UE</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EC</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Désignation</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">État</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {evaluations.map((evaluation, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.noEvaluation}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.codeFormation}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.promotion}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.codeUE}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.codeEC}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.designation}</h2></div></div></div>
                                        </td>  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                            style={{textAlign: "center"}}>{evaluation.etat}</h2></div></div></div>
                                        </td>

                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-6">
                                                <button onClick={() => handleOpenDialogDelete(1)}
                                                        className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                         className="w-5 h-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                    </svg>
                                                </button>

                                                <button
                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                         className="w-5 h-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                    onClick={() => handleOpenDialog(evaluation)} >
                                                    <FontAwesomeIcon icon={faEye} className="w-5 h-5"/>
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
                setOpen={setDialogDeleteOpen} />
        </>
    );
}

export default EvaluationsList;