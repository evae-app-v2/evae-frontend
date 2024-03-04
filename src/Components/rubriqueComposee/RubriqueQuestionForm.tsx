import React, {ChangeEvent, useEffect, useState} from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {Question} from "../../model/Question";
import {QuestionService} from "../../services/QuestionService";
import {message} from "antd";
import {RubriqueQuestions} from "../../model/RubriqueQuestions";
import {RubriqueQuestionService} from "../../services/RubriqueQuestionService";

type DialogWithFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate: boolean;
  initialData?: any;
};

export function RubriqueQuestionForm({ open, setOpen, isUpdate, initialData }: DialogWithFormProps) {

  const [idQuestion, setIdQuestion] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const questionsService=new QuestionService();
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    loadQuestions();
    if (initialData) {
     // setIntitule(initialData.intitule);
      setIdQuestion(initialData.idQuestion);
    }
  }, [initialData]);

  const loadQuestions = async () => {
    try {
      let response: Question[] = [];
      response = await questionsService.findAllQuestions();
      setQuestions(response);
    } catch (error:any) {
      console.log(error.response.data.message)
      console.error("Erreur lors du chargement des rubriques:", error);
    }
  }
  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = () => {
    setOpen((prevOpen) => !prevOpen);
    //setIntitule("");
    setIdQuestion("");
  }
  const handleSubmit = async () => {
    const idQuestionAsNumber = idQuestion ? parseInt(idQuestion) : 0;
    const newRubriqueQuestion = new RubriqueQuestions(
        1,
        idQuestionAsNumber,
        3
    );

    if (isUpdate) {
      newRubriqueQuestion.idRubrique = initialData?.id;
    }

    const rubriqueQuestionService = new RubriqueQuestionService();

    const handleSuccess = () => {
      // setIntitule("");
      setIdQuestion(null);
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
        content: error.response.data.message,});
    };

    if (isUpdate) {
      rubriqueQuestionService.addQuestion(newRubriqueQuestion)
          .then(handleSuccess)
          .catch(handleFailure);
    } else {
      rubriqueQuestionService.addQuestion(newRubriqueQuestion)
          .then(handleSuccess)
          .catch(handleFailure);
    }
  };


  return (
      <>
        {contextHolder}
        <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
            style={{zIndex: 10}}
            placeholder={undefined}
        >
          <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
            <CardBody className="flex flex-col gap-4" placeholder={undefined}>
              <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                {isUpdate ? "Modifier " : "Ajouter "}
              </Typography>
              <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                la nouvelle question
              </Typography>
              <Select
                  label=" Question "
                  value={idQuestion ? idQuestion.id || "" : ""}
                  onChange={(value: string | undefined) => {
                    if (value) {
                      const selectedId = parseInt(value);
                      console.log("test id", selectedId);
                      setIdQuestion(
                          questions.find((q) => q.id === selectedId) || null
                      );
                    }
                  }}
                  placeholder={undefined}
              >
                {questions.map((q) => (
                    <Option key={q.id} value={q.id !== undefined ? q.id.toString() : "0"}>
                      {q.intitule}
                    </Option>
                ))}
              </Select>


            </CardBody>
            <CardFooter className="pt-0"  placeholder={undefined}>
              <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  fullWidth
                  // disabled={!intitule || intitule.length < 2}
                  placeholder={undefined}
              >
                {isUpdate ? "Modifier" : "Ajouter"}
              </Button>
            </CardFooter>
            <CardFooter className="pt-0" style={{marginTop: '-3%'}}  placeholder={undefined}>
              <Button variant="gradient" onClick={handleClose} fullWidth placeholder={undefined}>
                Annuler
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </>
  );
}
