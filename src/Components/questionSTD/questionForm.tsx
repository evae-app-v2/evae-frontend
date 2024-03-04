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
        const newQuestion = new Question(
            "QUS", // À remplir avec le type approprié
            idQualificatif,
            intitule
        );

        if (isUpdate) {
            newQuestion.id = initialData?.id;
        }

        const questionService = new QuestionService();

        const handleSuccess = () => {
            setIntitule("");
            setIdQualificatif(null);
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
            questionService.updateQuestion(newQuestion)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            questionService.addQuestion(newQuestion)
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
