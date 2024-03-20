import React, { useEffect, useState } from "react";
import { message, Space } from 'antd';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { RubriqueQuestionService } from "../services/RubriqueQuestionService";
import { RubriqueService } from "../services/RubriqueService";
import { QualificatifService } from "../services/QualificatifService";
import { QuestionService } from "../services/QuestionService";
import toast from "react-hot-toast";
import { faCheckCircle, faTrashAlt, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EvaluationService } from "../services/EvaluationService";
type DialogWithFormProps = {
    title: string;
    messageComp: string;
    open: boolean;
    rubriqueId: any;
    questionId: any;
    questionIntitule: any;
    name: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function ConfirmationDialog({ title, messageComp, rubriqueId, name, questionId, questionIntitule, open, setOpen }: DialogWithFormProps) {
    const [messageApi, contextHolder] = message.useMessage();

    const [service, setService] = useState<any>(null);
    const handleOpen = () => {
        setOpen((prevOpen: any) => !prevOpen);
    };
    useEffect(() => {
        switch (name) {
            case "rubriqueQuestion":
                setService(new RubriqueQuestionService());
                break;
            default:
                break;
        }

    }, [rubriqueId, questionId, name]); // Utilisez searchTerm comme dépendance du useEffect
    const handlValid = () => {
        service.deleteRubriqueQuestion(rubriqueId, questionId)
            .then(() => {
                console.log('Question deleted successfully');
                handleOpen();
                messageApi.open({
                    type: 'success',
                    content: `la supression de la question : "${questionIntitule}" de la rubrique est réalisée avec succès`,
                });
            })
            .catch((error: any) => {
                handleOpen();
                messageApi.open({
                    type: 'error',
                    content: 'Un erreur est survenue lors de la suppression, veuillez reverifier votre demande',
                });
            });
    }


    return (
        <>
            {contextHolder}
            <Dialog open={open} handler={handleOpen} placeholder={undefined}>
                <DialogHeader placeholder={undefined}> Confirmez-vous la suppression ? </DialogHeader>
                <DialogBody placeholder={undefined}> Confirmez-vous la suppression de la question : "{questionIntitule}" de cette rubrique?</DialogBody>
                <DialogFooter placeholder={undefined}>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                        placeholder={undefined}
                    >
                        {/* Icône de la poubelle */}
                        <FontAwesomeIcon icon={faX} className="mr-1" />
                        <span>Annuler</span>
                    </Button>

                    <Button
                        variant="gradient"
                        color="deep-orange"
                        onClick={handlValid}
                        placeholder={undefined}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                        {/* Icône de validation */}
                        <span>Supprimer</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );

}