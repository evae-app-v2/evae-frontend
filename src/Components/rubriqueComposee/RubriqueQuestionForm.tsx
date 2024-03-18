import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Select,
  Option,
  CardHeader
} from "@material-tailwind/react";
import { message } from "antd";
import { Question } from "../../model/Question";
import { QuestionService } from "../../services/QuestionService";
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownAZ} from "@fortawesome/free-solid-svg-icons";


type DialogWithFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate: boolean;
  id: any;
};

export function RubriqueQuestionForm({ open, setOpen, isUpdate, id }: DialogWithFormProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRubriqueId, setSelectedRubriqueId] = useState<number | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const rubriqueQuestionService = new RubriqueQuestionService();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setSelectedRubriqueId(id);
    loadQuestions();
  }, [id]);

  const loadQuestions = async () => {
    try {
      //const response: Question[] = await questionService.findAllQuestions();
      const response: Question[] = await rubriqueQuestionService.getQuestionsNotInRubriqueId(id);
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
    setSelectedRubriqueId(null);
  };

  const handleSubmit = async () => {
    if (selectedRubriqueId !== null && selectedQuestionIds.length > 0) {
      console.log(selectedRubriqueId)
      rubriqueQuestionService.createMultipleRubriqueQuestions(selectedRubriqueId, selectedQuestionIds)
          .then(handleSuccess)
          .catch(handleFailure);
    } else {
      console.error("Veuillez sélectionner au moins une question et une rubrique.");
    }
  };


  const handleSuccess = () => {
    setSelectedQuestionId(null);
    handleOpen();
    messageApi.open({
      type: 'success',
      content: 'Opération réussie',
    });
  };

  const handleFailure = (error: any) => {
    handleOpen();
    messageApi.open({
      type: 'error',
      content: error.response.data.message,
    });
  };

  const handleCheckboxChange = (questionId: number) => {
    if (selectedQuestionIds.includes(questionId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, questionId]);
    }
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
            <Typography className=" mx-8 mt-7 -mb-2" variant="h6" placeholder={undefined}>
              <span>Les nouvelles questions <FontAwesomeIcon icon={faArrowDownAZ} /> </span>
            </Typography>
            <CardBody className=" mx-6 flex flex-col gap-4 overflow-y-auto max-h-[50vh]" placeholder={undefined}>
              {questions
                  .sort((a, b) => a.intitule.localeCompare(b.intitule))
                  .map((q) => ((
                      <div key={q.id} >
                        <input
                            type="checkbox"
                            checked={selectedQuestionIds.includes(q.id !== undefined ? q.id : 0)}
                            onChange={() => handleCheckboxChange(q.id !== undefined ? q.id : 0)}
                            className="mx-6"
                            style={{ transform: "scale(1.2)" }}
                        />
                        <span className="text-black">  {q.intitule} </span>

                      </div>

                  )))}
            </CardBody>
            <CardFooter className="mx-auto  border border-gray-300 w-full " placeholder={undefined}>
              <div className="flex space-x-4  max-w-[24rem]  ">
                <Button
                    onClick={handleClose}
                    fullWidth
                    placeholder={undefined}
                    className="bg-red-400"
                >
                  Annuler
                </Button>
                <Button
                    variant="gradient"
                    onClick={handleSubmit}
                    fullWidth
                    placeholder={undefined}
                >
                  {isUpdate ? "Ajouter" : "Ajouter"}
                </Button>

              </div>
            </CardFooter >
          </Card>
        </Dialog>
      </>
  );
}