import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react";
import { DialogDelete } from "../DialogDelete";
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import { Statics } from "../statics";
import { RubriqueQuestionForm } from "../rubriqueComposee/RubriqueQuestionForm";
import axios from "axios";

interface Qualificatif {
    id: number;
    minimal: string;
    maximal: string;
}

interface Question {
    id: number;
    type: string;
    idQualificatif: Qualificatif;
    intitule: string;
    ordre: number;
}

interface Rubrique {
    id: number;
    type: string;
    designation: string;
    ordre: number;
}

interface RubriqueQuestionDTOO {
    rubrique: Rubrique;
    questions: Question[];
}

const RubriqueQuestion = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idRubrique, setIdRubrique] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [rubriqueToUpdate, setRubriqueToUpdate] = useState<Rubrique | null>(null);
    const [visibleQuestions, setVisibleQuestions] = useState<{ [key: number]: boolean }>({});
    const [rubriqueQuestions, setRubriqueQuestions] = useState<RubriqueQuestionDTOO[]>([]);

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

    useEffect(() => {
        axios.get<RubriqueQuestionDTOO[]>('http://localhost:8085/rubriqueQuestions/getAll')
            .then(response => setRubriqueQuestions(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, );

    //[rubriqueQuestions]

    const handleOpenDialog = (rubrique?: any) => {
        setDialogOpen(true);
        setIsUpdate(false);
    };

    const handleOpenDialogUpdate = (rubrique: Rubrique) => {
        setRubriqueToUpdate(rubrique);
        setIsUpdate(true);
        setDialogOpen(true);
    };

    const handleOpenDialogDelete = (id: any) => {
        setIdRubrique(id);
        setDialogDeleteOpen(true);
    };

    const handleDeleteRubriqueQuestion = async (rubriqueId: number, questionId: number) => {
        try {
            await axios.get(`http://localhost:8085/rubriqueQuestions/delete/${rubriqueId}/${questionId}`);
            const updatedRubriqueQuestions = await axios.get<RubriqueQuestionDTOO[]>('http://localhost:8085/rubriqueQuestions/getAll');
            setRubriqueQuestions(updatedRubriqueQuestions.data);
        } catch (error) {
            console.error('Error deleting rubrique question:', error);
        }
    };

    const handleDeleteRubriqueCompose = async (rubriqueId: number) => {
        try {
            await axios.get(`http://localhost:8085/rubriqueQuestions/delete/${rubriqueId}`);
            const updatedRubriqueQuestions = await axios.get<RubriqueQuestionDTOO[]>('http://localhost:8085/rubriqueQuestions/getAll');
            setRubriqueQuestions(updatedRubriqueQuestions.data);
        } catch (error) {
            console.error('Error deleting rubrique question:', error);
        }
    };

    return (
        <>
            <Statics />
            <section className="container px-4 mx-auto" style={{ zIndex: 5 }}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des rubriques Composées  &nbsp;
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {rubriques.length}
                        </span>
                    </h2>

                    <Button
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span onClick={handleOpenDialog}>Ajouter</span>
                    </Button>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div
                                className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
                                style={{ maxHeight: 'calc(6 * 70px)', overflowY: 'auto' }}
                            >
                                <table
                                    className="w-full divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <button className="flex items-center gap-x-2">
                                                <span>Désignation des rubriques</span>
                                            </button>
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {rubriqueQuestions.map((rubriqueQuestion: RubriqueQuestionDTOO, index) => (
                                        <React.Fragment key={index}>
                                            <tr
                                                tabIndex={0}
                                                className={index === selectedRowIndex ? 'bg-gray-200' : ''}
                                            >
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-x-3">
                                                        <div className="flex items-center gap-x-2">
                                                            <div>
                                                                <h2 className="font-medium text-gray-800 dark:text-white" style={{ textAlign: "center" }}>{rubriqueQuestion.rubrique.designation}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-x-6">
                                                        <button
                                                            onClick={() => handleDeleteRubriqueCompose(rubriqueQuestion.rubrique.id)}
                                                            className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 stroke-width="1.5" stroke="currentColor"
                                                                 className="w-5 h-5">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => handleOpenDialogUpdate(rubriqueQuestion.rubrique)}
                                                            className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                            Ajouter Question
                                                        </button>

                                                        <button onClick={() => setVisibleQuestions((prev) => ({
                                                            ...prev,
                                                            [index]: !prev[index]
                                                        }))}
                                                                className="text-gray-500 transition-colors duration-200 dark:hover:text-blue-500 dark:text-gray-300 hover:text-blue-500 focus:outline-none">
                                                            {visibleQuestions[index] ? 'Masquer Questions' : 'Afficher Questions'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {visibleQuestions[index] && rubriqueQuestion.questions
                                                .sort((a, b) => a.ordre - b.ordre)
                                                .map((question, qIndex) => (
                                                    <tr key={`q${qIndex}`}>
                                                        <td className="px-8 py-2 text-sm font-medium text-gray-700">
                                                            <div className="flex items-center gap-x-2">
                                                                <strong>{question.intitule}</strong>{' '}
                                                                ( {question.idQualificatif.minimal}/{question.idQualificatif.maximal})
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm whitespace-nowrap">
                                                            <button onClick={() => handleDeleteRubriqueQuestion(rubriqueQuestion.rubrique.id, question.id)}
                                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                     stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RubriqueQuestionForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate}
                initialData={rubriqueToUpdate}
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression du rubrique"
                messageComp="Voulez-vous vraiment supprimer cette rubrique ?"
                id={idRubrique}
                name={"rubrique"}
                setOpen={setDialogDeleteOpen}
            />
        </>
    );
}

export default RubriqueQuestion;
