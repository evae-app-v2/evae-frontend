import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {Question, Rubrique, RubriqueQuestionDTOO} from '../../model/RubriqueQuestionInterface';
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import icon from "../../assets/glisser-deposer(2).png";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RubriqueService } from "../../services/RubriqueService";
import { RubriqueQuestions } from "../../model/RubriqueQuestions";
import { Statics } from "../statics";
import QuestionReorderPopup from "./QuestionReordrePopup";

const RubriqueComposeDetails = () => {
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [visibleQuestions, setVisibleQuestions] = useState<{ [key: number]: boolean }>({});
    const [rubriqueQuestionDTOOs, setRubriqueQuestionDTOOs] = useState<RubriqueQuestionDTOO[]>([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [selectedRubriqueId, setSelectedRubriqueId] = useState<number | null>(null);

    const rubriqueQuestionService = new RubriqueQuestionService();
    const rubriqueService = new RubriqueService();

    useEffect(() => {
        loadRubriqueQuestionDTOs();
    }, []);

    const loadRubriqueQuestionDTOs = async () => {
        try {
            let response: RubriqueQuestionDTOO[] = [];
            response = await rubriqueQuestionService.getAll();
            response.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
            setRubriqueQuestionDTOOs(response);
        } catch (error) {
            console.error("Erreur lors du chargement des rubriques:", error);
        }
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const {source, destination} = result;
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
            /*const rubriqueQuestions: RubriqueQuestions[] = reorderedQuestions.map((question, ordre) => ({
                idRubrique: rubriqueId,
                idQuestion: question.id,
                ordre: ordre + 1,
            }));*/

            // await rubriqueQuestionService.updateOrdreRubriqueQuestions(rubriqueQuestions);
            await rubriqueQuestionService.updateOrdreRubriqueQuestions(reorderedQuestions);
            await loadRubriqueQuestionDTOs();
            handleClosePopup();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'ordre des questions:", error);
        }
    };


    return (
        <>
            <Statics/>
            <section className="container px-4 mx-auto" style={{zIndex: 5}}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des rubriques &nbsp;
                        <span
                            className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {rubriques.length}
                        </span>
                    </h2>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div
                                className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
                                style={{maxHeight: 'calc(6 *100px)', overflowY: 'auto'}}
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
                                                <tbody
                                                    className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
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
                                                                                <img src={icon}
                                                                                     style={{width: '25px'}}/>&nbsp;
                                                                                <div>
                                                                                    <h2 className="font-medium text-gray-800 dark:text-white"
                                                                                        style={{textAlign: "center"}}>{rubriqueQuestion.rubrique.designation}</h2>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                                        <div className="flex items-center gap-x-6">
                                                                            {/*<button
                                                                                // onClick={() => handleOpenDialogUpdateOrdre(rubriqueQuestion.rubrique.id)}
                                                                                className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     fill="none"
                                                                                     viewBox="0 0 24 24"
                                                                                     stroke-width="1.5"
                                                                                     stroke="currentColor"
                                                                                     className="w-5 h-5">
                                                                                    <path stroke-linecap="round"
                                                                                          stroke-linejoin="round"
                                                                                          d="M12 6v12m-6-6h12"></path>
                                                                                </svg>
                                                                            </button>*/}
                                                                            <td>
                                                                                <button
                                                                                    onClick={() => handleOpenPopup(rubriqueQuestion.rubrique.id)}>
                                                                                    Ordre
                                                                                </button>
                                                                            </td>
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
                                                                </tr>
                                                            ))}
                                                    </React.Fragment>
                                                ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                {popupOpen && selectedRubriqueId !== null && (
                                    <QuestionReorderPopup
                                        rubriqueId={selectedRubriqueId}
                                        open={popupOpen}
                                        onClose={handleClosePopup}
                                        onReorder={handleQuestionReorder}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default RubriqueComposeDetails;
