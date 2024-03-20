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
import {Qualificatif} from "../../model/Qualificatif";
import {QualificatifService} from "../../services/QualificatifService";
import toast from "react-hot-toast";
import {message} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean;
    initialData?: any;
};

export function QualificatifForm({ open, setOpen ,isUpdate,initialData}: DialogWithFormProps) {
    const [maximal, setMaximal] = useState("");
    const [minimal, setMinimal] = useState("");
    const [alertMessage, setALertMessage] = useState<string | null>(null); // Variable d'état pour stocker le message d'erreur
    const [messageApi, contextHolder] = message.useMessage();
    const [maximalError, setMaximalError] = useState<string | null>(null);
    const [minimalError, setMinimalError] = useState<string | null>(null);
    const MAXIMAL_LIMIT = 16;
    const MINIMAL_LIMIT = 16;

    const handleMaximalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > MAXIMAL_LIMIT) {
            setMaximalError("Vous avez atteint la limite maximale de caractères. (16 max)");
        } else {
            setMaximal(value);
            setMaximalError(null);
        }
    };

    const handleMinimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > MINIMAL_LIMIT) {
            setMinimalError("Vous avez atteint la limite maximale de caractères. (16 max)");
        } else {
            setMinimal(value);
            setMinimalError(null);
        }
    };

    const isFormValid = () => {
        return maximal.length <= MAXIMAL_LIMIT && minimal.length <= MINIMAL_LIMIT && !maximalError && !minimalError;
    };


    useEffect(() => {
        if (initialData) {
            console.log(" initialisation ")
            setMaximal(initialData.maximal);
            setMinimal(initialData.minimal);
        }
    }, [initialData]);
    useEffect(() => {
        if (!open) {
            setMinimal("");
            setMaximal("");
            setMaximalError(null);
            setMinimalError(null);
        }
    }, [open]);

    const handleOpen = () => {
        setOpen((prevOpen) => !prevOpen);
        if (!isUpdate) {
            setMinimal("");
            setMaximal("");
        }
    };
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
        setMinimal("");
        setMaximal("");
        if (!isUpdate) {
            setMinimal("");
            setMaximal("");
        }
    }
    const handleSubmit = async () => {
        const trimmedMinimal = minimal.trim();
        const trimmedMaximal = maximal.trim();

        const newQualificatif = new Qualificatif(
            trimmedMaximal,
            trimmedMinimal,
            null
        );

        if (isUpdate) {
            newQualificatif.id = initialData?.id;
        }

        const qualificatifService = new QualificatifService();

        const handleSuccess = () => {
            setMinimal("");
            setMaximal("");
            handleOpen();
            if (isUpdate) {
                messageApi.open({
                    type: 'success',
                    content: `La modification du couple de qualificatifs : ${minimal} / ${maximal} est réalisée avec succès.`,
                    duration: 10,
                });}else {
                messageApi.open({
                    type: 'success',
                    content: `La création du couple de qualificatifs : ${minimal} / ${maximal} est réalisée avec succès.`,
                    duration: 10,
                });
            }
        };

        const handleFailure = (error: any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: `Opération annulée, le minimal : ${minimal} ,ou, le maximal : ${maximal} existe déjà.`,
                duration: 10,
            });
        };

        if (isUpdate) {
            qualificatifService.updateQualificatif(newQualificatif)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            qualificatifService.addQualificatif(newQualificatif)
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
                style={{ zIndex: 10 }} // Assurez-vous que la boîte de dialogue a un z-index inférieur à celui de l'alerte
            >
                <Card className="mx-auto w-full max-w-[55rem]" placeholder={undefined}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            {isUpdate ? "Modifier un Couple de Qualificatifs" : "Créer un Couple de Qualificatifs "}
                        </Typography>


                        <Input label="Minimal *" size="lg" placeholder={undefined} value={minimal}
                               onChange={handleMinimalChange}  crossOrigin ={undefined} />
                        {minimalError && <p className="text-sm text-red-500">{minimalError}</p>}
                        <Input label="Maximal *" size="lg" placeholder={undefined} value={maximal}
                               onChange={handleMaximalChange} crossOrigin={undefined} />
                        {maximalError && <p className="text-sm text-red-500">{maximalError}</p>}
                    </CardBody>
                    <CardFooter className="pt-0 flex items-center justify-center" placeholder={undefined}>
                        <Button  placeholder={undefined}
                                 variant="gradient" color={"green"} onClick={handleSubmit} fullWidth disabled={ !maximal || maximal.length < 2 && !minimal || minimal.length < 2}>


                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                            </svg>
                            <span>{isUpdate ? "Modifier" : "Créer"}</span>
                        </Button>
                    </CardFooter>
                    <CardFooter className="pt-0" placeholder={undefined} style={{marginTop:'-3%'}}>
                        <Button variant="gradient" color={"red"} onClick={handleClose} fullWidth placeholder={undefined}>
                            <FontAwesomeIcon icon={faX} className="mr-1" />

                            Annuler
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>

        </>
    );
}