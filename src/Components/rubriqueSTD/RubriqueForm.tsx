import React, {useEffect, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
} from "@material-tailwind/react";
import {RubriqueService} from "../../services/RubriqueService";
import {Rubrique} from "../../model/Rubrique";
import AlertComp from "../../utils/alert";
import toast from "react-hot-toast";
import {message} from "antd";
import Spinner from "../../utils/Spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean; // Nouvelle propriété pour indiquer si c'est une mise à jour
    initialData?: any; // Nouvelle propriété pour les données initiales
};

export function RubriqueForm({ open, setOpen ,isUpdate,initialData}: DialogWithFormProps) {
    const [designation, setDesignation] = useState("");
    const [alertMessage, setALertMessage] = useState<string | null>(null); // Variable d'état pour stocker le message d'erreur
    const [messageApi, contextHolder] = message.useMessage();


    const [designationError, setDesignationError] = useState<string | null>(null);
    const DESIGNATION_LIMIT = 32;
    const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > DESIGNATION_LIMIT) {
            setDesignationError("Vous avez atteint la limite maximale de caractères. (32 max)");
        } else {
            setDesignation(value);
            setDesignationError(null);
        }
    };


    const isFormValid = () => {
        return designation && designation.length <= DESIGNATION_LIMIT && !designationError;
    };

    useEffect(() => {
        if (initialData) {
            console.log("hani pour update")
            setDesignation(initialData.designation);
        }
    }, [initialData]);
    const handleOpen = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
        setDesignation("");
    };

    const handleSubmit = async () => {
        const trimmedDesignation = designation.trim();

        const newRubrique = new Rubrique(
            'RBS',
            null,
            trimmedDesignation,
            null
        );

        if (isUpdate) {
            newRubrique.id = initialData?.id;
            console.log("id update " + newRubrique.id);
        }

        const rubriqueService = new RubriqueService();

        const handleSuccess = () => {
            setDesignation("");
            handleOpen();
            if(isUpdate){
            messageApi.open({
                type: 'success',
                content: `La modification de la designation du rubrique ${designation} est réalisée avec succès`,
                duration: 10,
            });}
            else{
            messageApi.open({
                type: 'success',
                content: `La création de la rubrique ${designation} est réalisée avec succès`,
                duration: 10,
            });}
        };

        const handleFailure = (error:any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: `Opération annulée, une rubrique avec la designation : ${designation} existe déjà.`,
                duration: 10,
                style:{
                    zIndex:"1000000 !important"
                }
        });
        };

        if (isUpdate) {
            rubriqueService.update(newRubrique)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            rubriqueService.create(newRubrique)
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
                placeholder={undefined}
                style={{ zIndex: 9999}} // Assurez-vous que la boîte de dialogue a un z-index inférieur à celui de l'alerte
            >
            <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            {isUpdate ? "Modifier une Rubrique " : "Créer une Rubrique"}
                        </Typography>
                        <Input label="Désignation *" size="lg" placeholder={undefined} value={designation}
                               onChange={handleDesignationChange} crossOrigin={undefined} />
                        {designationError && <p className="text-sm text-red-500">{designationError}</p>}
                    </CardBody>
                    <CardFooter className="pt-0" placeholder={undefined}>
                        <Button variant="gradient" color="green" onClick={handleSubmit} fullWidth placeholder={undefined}
                                disabled={!designation || designation.length < 2}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                            </svg>
                            {isUpdate ? "Modifier" : "Créer"}
                        </Button>
                    </CardFooter>
                <CardFooter className="pt-0" placeholder={undefined} style={{marginTop: '-3%'}}>
                    <Button variant="gradient" color="red" onClick={handleClose} fullWidth placeholder={undefined}>
                        <FontAwesomeIcon icon={faX} className="mr-1" />Annuler
                    </Button>
                </CardFooter>
            </Card>
            </Dialog>
        </>
    );
}
