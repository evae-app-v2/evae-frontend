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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

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
    const [intituleError, setIntituleError] = useState<string | null>(null);
    const INTITULE_LIMIT = 64;
    const handleIntituleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > INTITULE_LIMIT) {

            setIntituleError("Vous avez atteint la limite maximale de caractères. (64 max)");
        } else {

            setIntitule(value);
            setIntituleError(null);
        }
    };
    const isFormValid = () => {
        return intitule.length <= INTITULE_LIMIT && !intituleError;
    };
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
    useEffect(() => {
        if (!open) {
            setIntitule("");
            setIdQualificatif("");
        }
    }, [open]);

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
        const trimmedIntitule = intitule.trim();

        const newQuestion = new Question(
            "QUS", // À remplir avec le type approprié
            idQualificatif,
            trimmedIntitule
        );
        if (isUpdate) {
            newQuestion.id = initialData?.id;
        }

        const questionService = new QuestionService();

        const handleSuccess = () => {
            setIntitule("");
            setIdQualificatif(null);
            handleOpen();
            if (isUpdate) {
                messageApi.open({
                    type: 'success',
                    content: `La modification de la question : ${intitule}  est réalisée avec succès.`,
                    duration: 10,
                });}else {
                messageApi.open({
                    type: 'success',
                    content: `La création de la question : ${intitule}  est réalisée avec succès.`,
                    duration: 10,
                });
            }
        };

        const handleFailure = (error: any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: `Opération annulée, la question : ${intitule}  existe déjà.`,
                duration: 10,});
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
                            {isUpdate ? "Modifier une Question" : "Créer une Question "}
                        </Typography>

                        <Input
                            label="Intitulé *"
                            size="lg"
                            value={intitule}
                            onChange={handleIntituleChange}
                            placeholder={undefined} crossOrigin={undefined}/>
                        {intituleError && <p className="text-sm text-red-500">{intituleError}</p>}
                        {/* Ici, vous pouvez ajouter d'autres champs pour les autres propriétés de la question */}
                        <Select
                            label="Couple Qualificatif *"
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
                            color="green"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={!intitule || intitule.length < 2 || !idQualificatif}
                            placeholder={undefined}
                        > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                        </svg>
                            {isUpdate ? "Modifier" : "Créer"}
                        </Button>
                    </CardFooter>
                    <CardFooter className="pt-0" style={{marginTop: '-3%'}} placeholder={undefined}>
                        <Button variant="gradient" color="red" onClick={handleClose} fullWidth placeholder={undefined}>
                            <FontAwesomeIcon icon={faX} className="mr-1" />

                            Annuler
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
