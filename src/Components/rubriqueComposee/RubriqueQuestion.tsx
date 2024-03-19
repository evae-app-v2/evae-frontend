import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react";
import { DialogDelete } from "../DialogDelete";
import { RubriqueQuestionForm } from "./RubriqueQuestionForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronUp, faChevronDown, faArrowDown19} from '@fortawesome/free-solid-svg-icons';
import { Rubrique, RubriqueQuestionDTOO } from '../../model/RubriqueQuestionInterface';
import {RubriqueQuestionService} from "../../services/RubriqueQuestionService";
import {RubriqueForm} from "../rubriqueSTD/RubriqueForm";
import icon from "../../assets/glisser-deposer(2).png";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {RubriqueService} from "../../services/RubriqueService";
import {RubriqueQuestions} from "../../model/RubriqueQuestions";
import QuestionReorderPopup from "./QuestionReordrePopup";


const RubriqueQuestion = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idRubrique, setIdRubrique] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [rubriqueToUpdate, setRubriqueToUpdate] = useState<Rubrique | null>(null);
    const [visibleQuestions, setVisibleQuestions] = useState<{ [key: number]: boolean }>({});
    const [rubriqueQuestionDTOOs, setRubriqueQuestionDTOOs] = useState<RubriqueQuestionDTOO[]>([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [deletionData, setDeletionData] = useState<{ rubriqueId: number; questionId: number } | null>(null);
    const [dialogRubriqueFormOpen, setDialogRubriqueFormOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [selectedRubriqueId, setSelectedRubriqueId] = useState<number | null>(null);
    const [disabledButtons, setDisabledButtons] = useState<{[id: number]: boolean}>({});

    const rubriqueQuestionService = new RubriqueQuestionService();
    const rubriqueService = new RubriqueService();
    
    useEffect(() => {
        fetchData();
    }, [rubriqueQuestionDTOOs, rubriques]);

    const fetchData = async () => {
        try {
            const response = await rubriqueQuestionService.getAll();
            response.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
            setRubriqueQuestionDTOOs(response);

            const updatedRubriques = response.map(dto => dto.rubrique);
            setRubriques(updatedRubriques);

            const updatedDisabledButtons: { [id: number]: boolean } = {};
            const promises = updatedRubriques.map(async (rubrique) => {
                const isDisabled = await testDisabled(rubrique.id);
                updatedDisabledButtons[rubrique.id ?? ''] = isDisabled;
            });
            await Promise.all(promises);
            setDisabledButtons(updatedDisabledButtons);
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
            setRubriques([]);
            setRubriqueQuestionDTOOs([]);
            setDisabledButtons({});
        }
    };

    const testDisabled = async (id: any): Promise<boolean> => {
        try {
            const response = await rubriqueService.rubriqueIsUsedInEvaluation(id);
            console.log(id);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
            return false;
        }
    };


    //Add Rubrique
    const handleOpenDialog = (rubrique?: any) => {
        setRubriqueToUpdate(rubrique);
        setIsUpdate(false);
        setDialogRubriqueFormOpen(true);
    };
    //Update Rubrique
    const handleOpenDialogRubriqueForm = (rubrique: Rubrique) => {
        setRubriqueToUpdate(rubrique);
        setIsUpdate(true);
        setDialogRubriqueFormOpen(true);
    };

    //Delete Rubrique
    const handleOpenDialogDelete = (id: any) => {
        setIdRubrique(id);
        setDialogDeleteOpen(true);
    };
    //Add Question
    const handleOpenDialogUpdate = (id: any) => {
        setIdRubrique(id);
        setIsUpdate(true);
        setDialogOpen(true);
    };

    //Delete Question
    const handleDeleteRubriqueQuestion = async (rubriqueId: number, questionId: number) => {
        setConfirmationDialogOpen(true);
        setDeletionData({ rubriqueId, questionId });
    };

    const handleConfirmDeletion = async () => {
        if (deletionData) {
            try {
                await rubriqueQuestionService.deleteRubriqueQuestion(deletionData.rubriqueId, deletionData.questionId);
                const updatedRubriqueQuestions = await rubriqueQuestionService.getAll();
                setRubriqueQuestionDTOOs(updatedRubriqueQuestions);
                setConfirmationDialogOpen(false);
            } catch (error) {
                console.error('Error deleting rubrique question:', error);
            }
        }
    };

    //DRAG AND DOWN RUB
    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;
        const updatedRubriqueQuestionDTOOs = Array.from(rubriqueQuestionDTOOs);
        const isDroppedAtEnd = destination.index === rubriqueQuestionDTOOs.length;
        if (isDroppedAtEnd) {
            const [movedItem] = updatedRubriqueQuestionDTOOs.splice(source.index, 1);
            updatedRubriqueQuestionDTOOs.push(movedItem);
        } else {
            const [movedItem] = updatedRubriqueQuestionDTOOs.splice(source.index, 1);
            updatedRubriqueQuestionDTOOs.splice(destination.index, 0, movedItem);
        }
        setRubriqueQuestionDTOOs(updatedRubriqueQuestionDTOOs);

        const updatedRubriquesData = updatedRubriqueQuestionDTOOs.map((rubriqueQuestion, index) => ({
            ...rubriqueQuestion.rubrique,
            ordre: index + 1,
        }));

        try {
            await rubriqueService.updateOrdre(updatedRubriquesData);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'ordre:", error);
        }
    };

    //DRAG AND DOWN QUESTIONS
    const handleOpenPopup = (rubriqueId: number) => {
        setSelectedRubriqueId(rubriqueId);
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setSelectedRubriqueId(null);
        setPopupOpen(false);
    };

    const handleQuestionReorder = async (rubriqueId: number, reorderedQuestions: RubriqueQuestions[]) => {
        try {
            await rubriqueQuestionService.updateOrdreRubriqueQuestions(reorderedQuestions);
            await fetchData();
            handleClosePopup();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'ordre des questions:", error);
        }
    };

    return (
        <>
            <section className="container px-4 mx-auto" style={{ zIndex: 5 }}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des rubriques &nbsp;
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
                                style={{ maxHeight: 'calc(6 *100px)', overflowY: 'auto' }}
                            >
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="rubriques">
                                        {(provided) => (
                                <table
                                    className="w-full divide-y divide-gray-200 dark:divide-gray-700"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">

                                            <button className="flex items-center gap-x-2">
                                                <span>Désignation des rubriques</span>
                                            </button>
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {rubriqueQuestionDTOOs.map((rubriqueQuestion: RubriqueQuestionDTOO, index) => (
                                        <React.Fragment key={index}>
                                            <Draggable
                                                key={index}
                                                draggableId={index.toString()}
                                                index={index}>
                                                {(provided) => (
                                            <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                tabIndex={0}
                                                className={index === selectedRowIndex ? 'bg-gray-150' : 'bg-gray-100 dark:bg-gray-700'}
                                            >
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                    <div
                                                        className="inline-flex items-center gap-x-3">
                                                        <div
                                                            className="flex items-center gap-x-2">
                                                            <img src={icon} style={{width: '25px'}}/>&nbsp;
                                                            <div>
                                                                <h2 className="font-medium text-gray-800 dark:text-white"
                                                                    style={{textAlign: "center"}}>{rubriqueQuestion.rubrique.designation}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-x-6">
                                                        <button
                                                            onClick={() => handleOpenDialogUpdate(rubriqueQuestion.rubrique.id)}
                                                            className="text-green-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24" stroke-width="1.5"
                                                                 stroke="currentColor" className="w-5 h-5">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                      d="M12 6v12m-6-6h12"></path>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => handleOpenPopup(rubriqueQuestion.rubrique.id)}>
                                                            <FontAwesomeIcon icon={faArrowDown19}/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDialogRubriqueForm(rubriqueQuestion.rubrique)}
                                                            disabled={disabledButtons[rubriqueQuestion.rubrique.id ?? '']}
                                                            className={`transition-colors duration-200 hover:text-blue-600 focus:outline-none ${disabledButtons[rubriqueQuestion.rubrique.id] ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-blue-600 dark:hover:text-yellow-400"}`}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                className="w-5 h-5">
                                                                <path stroke-linecap="round"
                                                                      stroke-linejoin="round"
                                                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDialogDelete(rubriqueQuestion.rubrique.id)}
                                                            disabled={disabledButtons[rubriqueQuestion.rubrique.id ?? '']}
                                                            title={disabledButtons[rubriqueQuestion.rubrique.id ?? ''] ? "Impossible de supprimer la question car elle est déjà utilisée" : ""}
                                                            className={`transition - colors duration-200 hover:text-red-500 focus:outline-none ${disabledButtons[rubriqueQuestion.rubrique.id] ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-red-500 dark:hover:text-red-400"}`}>

                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 stroke-width="1.5" stroke="currentColor"
                                                                 className="w-5 h-5">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className={`text-gray-500 transition-colors duration-200 focus:outline-none
                                                                ${rubriqueQuestion.questions.length > 0 ? 'hover:text-blue-500 dark:hover:text-blue-500 dark:text-gray-300' : 'hidden'}`}
                                                            onClick={() => setVisibleQuestions((prev) => ({
                                                                ...prev,
                                                                [index]: !prev[index]
                                                            }))}>
                                                            <FontAwesomeIcon
                                                                icon={visibleQuestions[index] ? faChevronUp : faChevronDown}/>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>)}
                                            </Draggable>
                                            {visibleQuestions[index] && rubriqueQuestion.questions
                                                .sort((a, b) => a.ordre - b.ordre)
                                                .map((question, qIndex) => (
                                                    <tr key={`q${qIndex}`}>
                                                    <td className="px-16 py-2 text-sm font-medium text-gray-700">
                                                            <div className="flex items-center gap-x-2">
                                                                <strong>{question.intitule}</strong>{' '}
                                                                ( {question.idQualificatif.minimal}/{question.idQualificatif.maximal})
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleDeleteRubriqueQuestion(rubriqueQuestion.rubrique.id, question.id)}
                                                                className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" stroke-width="2" stroke="red"
                                                                     className="w-5 h-5">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                          d="M6 18L18 6M6 6l12 12"></path>
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <RubriqueQuestionForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate}
                //initialData={rubriqueToUpdate}
                id={idRubrique}
                designation="designation"

            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression d'une rubrique question"
                messageComp="Voulez-vous vraiment supprimer cette rubrique question ?"
                id={idRubrique}
                name={"rubriqueQuestion"}
                setOpen={setDialogDeleteOpen}
            />
            <RubriqueForm
                open={dialogRubriqueFormOpen}
                setOpen={setDialogRubriqueFormOpen}
                isUpdate={isUpdate}
                initialData={rubriqueToUpdate}
            />

            {confirmationDialogOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md">
                        <p>Confirmez-vous la suppression ?</p>
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={() => setConfirmationDialogOpen(false)}
                                color="gray"
                                placeholder="annuler"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleConfirmDeletion}
                                color="gray"
                                className="ml-2"
                                placeholder="supprimer"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {popupOpen && selectedRubriqueId !== null && (
                <QuestionReorderPopup
                    rubriqueId={selectedRubriqueId}
                    open={popupOpen}
                    onClose={handleClosePopup}
                    onReorder={handleQuestionReorder}
                />
            )}
        </>
    );
}

export default RubriqueQuestion;
