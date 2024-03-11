import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import { Question } from "../../model/RubriqueQuestionInterface";
import { RubriqueQuestions } from "../../model/RubriqueQuestions";
import icon from "../../assets/glisser-deposer(2).png";

interface QuestionReorderPopupProps {
    rubriqueId: number;
    open: boolean;
    onClose: () => void;
    onReorder: (rubriqueId: number, reorderedQuestions: RubriqueQuestions[]) => void;
}

const QuestionReorderPopup: React.FC<QuestionReorderPopupProps> = ({ rubriqueId, open, onClose, onReorder }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const rubriqueQuestionService = new RubriqueQuestionService();

    useEffect(() => {
        loadQuestionsByRubriqueId();
    }, [rubriqueId]);

    const loadQuestionsByRubriqueId = async () => {
        try {
            const questionsByRubrique = await rubriqueQuestionService.getQuestionsByRubriqueId(rubriqueId);
            setQuestions(questionsByRubrique);
        } catch (error) {
            console.error("Erreur lors du chargement des questions par rubrique:", error);
        }
    };

    return (
        <Dialog
            size="xl"
            open={open}
            handler={onClose}
            className="bg-transparent shadow-none"
            style={{ zIndex: 10, maxHeight: '80vh', overflowY: 'auto', width: '160vh' }}
            placeholder={undefined}
        >
            <Card
                className="mx-auto w-full max-w-[48rem]"
                placeholder={undefined}
            >
                <CardBody
                    className="flex flex-col gap-4"
                    placeholder={undefined}
                >
                    <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                        Ordonnancer
                    </Typography>
                    <DragDropContext
                        onDragEnd={(result) => {
                            if (!result.destination) {
                                return;
                            }

                            const reorderedQuestions = Array.from(questions);
                            const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
                            reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
                            setQuestions(reorderedQuestions);
                        }}
                    >
                        <Droppable droppableId="questions">
                            {(provided) => (
                                <table
                                    className="w-full border-collapse table-auto"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <tbody>
                                    {questions.map((question, index) => (
                                        <Draggable
                                            key={question.id}
                                            draggableId={`question-${question.id}`}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div
                                                            className="flex items-center gap-x-2">
                                                            <img src={icon} style={{width: '25px'}}/>&nbsp;
                                                            <div>
                                                                <h2 className="font-medium text-gray-800 dark:text-white"
                                                                    style={{textAlign: "center"}}>{question.intitule}</h2>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </Droppable>
                    </DragDropContext>
                </CardBody>
                <CardFooter placeholder={undefined}>
                    <div className="flex justify-end">
                        <Button
                            variant="gradient"
                            onClick={onClose}
                            placeholder={undefined}
                            style={{marginRight: '8px'}}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="gradient"
                            onClick={() => onReorder(rubriqueId, questions.map((question, ordre) => ({
                                idRubrique: rubriqueId,
                                idQuestion: question.id,
                                ordre: ordre + 1,
                            })))}
                            placeholder={undefined}
                        >
                            Enregistrer
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Dialog>
    );
};

export default QuestionReorderPopup;
