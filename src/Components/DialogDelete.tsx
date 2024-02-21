import React, {useEffect, useState} from "react";
import {  message, Space } from 'antd';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { RubriqueQuestionService } from "../services/RubriqueQuestionService";
import {RubriqueService} from "../services/RubriqueService";
import {QualificatifService} from "../services/QualificatifService";
import {QuestionService} from "../services/QuestionService";
import toast from "react-hot-toast";
type DialogWithFormProps = {
    title: string;
    messageComp: string;
    open: boolean;
    id: any;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    name:string
};
export function DialogDelete({ title, messageComp,id, name,open, setOpen }: DialogWithFormProps) {
    const [messageApi, contextHolder] = message.useMessage();

    const [service, setService] = useState<any>(null);
    const handleOpen = () => {
        setOpen((prevOpen:any) => !prevOpen);
    };
    useEffect(() => {
        switch (name) {
            case "rubrique":
                setService(new RubriqueService());
                break;
            case "qualificatif":
                setService(new QualificatifService());
                break;
            case "question":
                setService(new QuestionService());
                break;
            case "rubriqueQuestion":
                setService(new RubriqueQuestionService());
                break;
            default:
                break;
        }

    }, [id,name]); // Utilisez searchTerm comme dépendance du useEffect
    const handlValid= () => {
// Appeler la méthode delete de votre service
        service.delete(id)
            .then(() => {
                // Gérer la suppression réussie, par exemple en actualisant la liste des qualificatifs
                console.log('Qualificatif deleted successfully');
                handleOpen();
                messageApi.open({
                    type: 'success',
                    content: 'Operation réalisé avec succès',
                });
            })
            .catch((error: any) => {
                // Afficher l'erreur dans un toast ou toute autre forme de notification à l'utilisateur
                handleOpen();
                //toast.error(error.response.data.message)
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message,
                });
                // Vous pouvez utiliser ici une bibliothèque comme react-toastify pour afficher un message d'erreur à l'utilisateur
            });

        // Si la suppression réussit, effectuer les actions appropriées


    }


    return (
        <>
            {contextHolder}
            <Dialog open={open} handler={handleOpen} placeholder={undefined}>
                <DialogHeader placeholder={undefined}>{title}</DialogHeader>
                <DialogBody placeholder={undefined}>{messageComp}</DialogBody>
                <DialogFooter placeholder={undefined}>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                        placeholder={undefined}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handlValid} placeholder={undefined}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );

}