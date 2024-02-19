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
import AlertComp from "../../utils/alert";
import {Qualificatif} from "../../model/Qualificatif";
import {QualificatifService} from "../../services/QualificatifService";
import toast from "react-hot-toast";
import {message} from "antd";

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean;
    initialData?: any;
};

export function QuestionForm({ open, setOpen, isUpdate, initialData }: DialogWithFormProps) {
    const [intitule, setIntitule] = useState("");
    const [idQualificatif, setIdQualificatif] = useState<any>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);
    const qualificatifsService=new QualificatifService();
    const [showSpinner, setShowSpinner] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // Chargez la liste des qualificatifs au chargement du composant
        // Cette logique doit être adaptée à votre cas d'utilisation pour charger les qualificatifs disponibles depuis le service approprié
        // Ici, je simule juste une liste de qualificatifs
        loadQualificatifs();
        if (initialData) {
            setIntitule(initialData.intitule);
            setIdQualificatif(initialData.idQualificatif);
        }
    }, [initialData]);

    const loadQualificatifs = async () => {
        try {
            let response: Qualificatif[] = [];
            response = await qualificatifsService.findAllQualificatifs();
            // Triez les rubriques en fonction de l'ordre alphabétique
            setQualificatifs(response);
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
        setIntitule("");
        setIdQualificatif("");
    }
    const handleSubmit = async () => {
        try {
            const newQuestion = new Question(
                "QUS", // À remplir avec le type approprié
                idQualificatif,
                intitule
            );

            try {
                if (isUpdate) {
                    newQuestion.id = initialData?.id;
                }

                const savedQuestion = isUpdate
                    ? await new QuestionService().updateQuestion(newQuestion)
                    : await new QuestionService().addQuestion(newQuestion);

                setIntitule("");
                setIdQualificatif(null);
                handleOpen();
                messageApi.open({
                    type: 'success',
                    content: 'Operation avec succus',
                });
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    console.log("TESTGHHHHHHHHHHHHHH")
                    setAlertMessage(error.response.data.message);
                    setShowSpinner(true);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire de la question :", error);
        }
    };


    return (
        <>
            {showSpinner && (
                <div id="toast-success"
                     className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                     role="alert">
                    <div
                        className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">{alertMessage}</div>
                    <button type="button"
                            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                            data-dismiss-target="#toast-success" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            )}
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
                            {isUpdate ? "Modifier une question" : "Ajouter une question"}
                        </Typography>
                        <Typography className="mb-3 font-normal" variant="paragraph" color="gray"
                                    placeholder={undefined}>
                            Entrez le texte de la nouvelle question.
                        </Typography>
                        <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                            Intitulé de la question
                        </Typography>
                        <Input
                            label="Intitulé"
                            size="lg"
                            value={intitule}
                            onChange={(e) => setIntitule(e.target.value)}
                            placeholder={undefined} crossOrigin={undefined}/>
                        {/* Ici, vous pouvez ajouter d'autres champs pour les autres propriétés de la question */}
                        <Select
                            label="Couple Qualificatif"
                            value={idQualificatif ? idQualificatif.id || "" : ""}
                            onChange={(value: string | undefined) => {
                                if (value) {
                                    const selectedId = parseInt(value);
                                    console.log("test id", selectedId);
                                    setIdQualificatif(
                                        qualificatifs.find((q) => q.id === selectedId) || null
                                    );
                                }
                            }}
                            placeholder={undefined}
                        >
                            {qualificatifs.map((q) => (
                                <Option key={q.id} value={q.id}>
                                    {q.minimal + " | " + q.maximal}
                                </Option>
                            ))}
                        </Select>


                    </CardBody>
                    <CardFooter className="pt-0"  placeholder={undefined}>
                        <Button
                            variant="gradient"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={!intitule || intitule.length < 2}
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
