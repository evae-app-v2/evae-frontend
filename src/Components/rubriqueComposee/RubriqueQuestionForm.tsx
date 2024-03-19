import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { message } from "antd";
import { Question } from "../../model/Question";
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faX } from "@fortawesome/free-solid-svg-icons";

type DialogWithFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate: boolean;
  id: any;
  designation: any;
};

export function RubriqueQuestionForm({
                                       open,
                                       setOpen,
                                       isUpdate,
                                       id,
                                       designation,
                                     }: DialogWithFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const rubriqueQuestionService = new RubriqueQuestionService();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) {
      loadQuestions();
    }
  }, [open]);

  const loadQuestions = async () => {
    try {
      const response: Question[] = await rubriqueQuestionService.getQuestionsNotInRubriqueId(
          id
      );
      setQuestions(response);
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
    }
  };

  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen((prevOpen) => !prevOpen);
    setSelectedQuestionIds([]);
  };

  const handleSubmit = async () => {
    if (selectedQuestionIds.length === 0 || !id) {
      console.error("Veuillez sélectionner au moins une question et une rubrique.");
      return;
    }

    try {
      await rubriqueQuestionService.createMultipleRubriqueQuestions(
          id,
          selectedQuestionIds
      );
      handleSuccess();
    } catch (error) {
      handleFailure(error);
    }
  };

  const handleSuccess = () => {
    setSelectedQuestionIds([]);
    handleOpen();
    messageApi.open({
      type: "success",
      content: `Ajout des nouvelles questions dans la rubrique ${designation} réussi`,
    });
  };

  const handleFailure = (error: any) => {
    handleOpen();
    messageApi.open({
      type: "error",
      content: error.response?.data?.message || "Une erreur est survenue.",
    });
  };

  const handleCheckboxChange = (questionId: number) => {
    setSelectedQuestionIds((prevIds) =>
        prevIds.includes(questionId)
            ? prevIds.filter((id) => id !== questionId)
            : [...prevIds, questionId]
    );
  };

  return (
      <>
        {contextHolder}
        <Dialog
            size="xl"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
            placeholder={undefined}
        >
          <Card className="mx-auto w-full max-w-[48rem]" placeholder={undefined}>
            <Typography className="mx-8 mt-7 -mb-2" variant="h6" placeholder={undefined}>
            <span>
              Les nouvelles questions <FontAwesomeIcon icon={faArrowDownAZ} />
            </span>
            </Typography>
            <CardBody className="mx-6 flex flex-col gap-4 overflow-y-auto max-h-[50vh]" placeholder={undefined}>
              {questions.length > 0 ? (
                  questions
                      .sort((a, b) => a.intitule.localeCompare(b.intitule))
                      .map((q) => (
                          <div key={q.id}>
                            <input
                                type="checkbox"
                                checked={selectedQuestionIds.includes(q.id)}
                                onChange={() => handleCheckboxChange(q.id)}
                                className="mx-6"
                                style={{ transform: "scale(1.2)" }}
                            />
                            <span className="text-black"> {q.intitule} </span>
                          </div>
                      ))
              ) : (
                  <p>Tous les questions disponibles sont déjà ajoutées à cette rubrique.</p>
              )}
            </CardBody>
            <CardFooter className="mx-auto flex justify-end gap-4 border border-gray-300 w-full" placeholder={undefined}>
              <div className="flex space-x-4 max-w-[24rem]">
                <Button onClick={handleClose} fullWidth className="bg-red-400" placeholder="annuler">
                  <FontAwesomeIcon icon={faX} className="mr-1" />
                  Annuler
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={handleSubmit}
                    fullWidth
                    className="flex items-center justify-center gap-2"
                    placeholder={undefined}
                    disabled={selectedQuestionIds.length === 0}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  {isUpdate ? " Ajouter" : " Ajouter"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Dialog>
      </>
  );
}
