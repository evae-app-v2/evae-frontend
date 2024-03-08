import React, { useEffect, useState } from "react";
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Select, Option } from "@material-tailwind/react";
import { message } from "antd";
import { Question } from "../../model/Question";
import { QuestionService } from "../../services/QuestionService";
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";


type DialogWithFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate: boolean;
  //initialData?: any;
  id: any;
};

export function RubriqueQuestionForm({ open, setOpen, isUpdate, id }: DialogWithFormProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRubriqueId, setSelectedRubriqueId] = useState<number | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const questionService = new QuestionService();
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
      /*<>
        {contextHolder}
        <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
            style={{ zIndex: 10 }}
            placeholder={undefined}
        >
          <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
            <CardBody className="flex flex-col gap-4" placeholder={undefined}>
              <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                Ajouter des questions
              </Typography>
              {questions.map((q) => (
                  <div key={q.id}>
                    <input
                        type="checkbox"
                        checked={selectedQuestionIds.includes(q.id!== undefined ? q.id : 0)}
                        onChange={() => handleCheckboxChange(q.id!== undefined ? q.id : 0)}
                    />
                    {q.intitule}
                  </div>
              ))}
            </CardBody>
            <CardFooter className="pt-0" placeholder={undefined}>
              <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  fullWidth
                  placeholder={undefined}
              >
                {isUpdate ? "Ajouter" : "Ajouter"}
              </Button>
            </CardFooter>
            <CardFooter className="pt-0" style={{ marginTop: '-3%' }} placeholder={undefined}>
              <Button variant="gradient" onClick={handleClose} fullWidth placeholder={undefined}>
                Annuler
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </>*/
      <>
        {contextHolder}
        <Dialog
            size="xl" // Adjust the size as needed
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
            style={{ zIndex: 10, maxHeight: '80vh', overflowY: 'auto', width:'160vh' }} // Add max height and scrollbar
            placeholder={undefined}
        >
          <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
            <CardBody className="flex flex-col gap-4" placeholder={undefined}>
              <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                Ajouter des questions
              </Typography>
              {questions.map((q) => (
                  <div key={q.id}>
                    <input
                        type="checkbox"
                        checked={selectedQuestionIds.includes(q.id !== undefined ? q.id : 0)}
                        onChange={() => handleCheckboxChange(q.id !== undefined ? q.id : 0)}
                    />
                    {q.intitule}
                  </div>
              ))}
            </CardBody>
            <CardFooter className="pt-0" placeholder={undefined}>
              <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  fullWidth
                  placeholder={undefined}
              >
                {isUpdate ? "Ajouter" : "Ajouter"}
              </Button>
            </CardFooter>
            <CardFooter className="pt-0" style={{ marginTop: '-3%' }} placeholder={undefined}>
              <Button variant="gradient" onClick={handleClose} fullWidth placeholder={undefined}>
                Annuler
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </>
  );
}
