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
            const newQualificatif = new Qualificatif(
                maximal,
                minimal,
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
                messageApi.open({
                    type: 'success',
                    content: 'Opération réalisé avec succès ',
                    duration: 15,
                });
            };

            const handleFailure = (error: any) => {
                handleOpen();
                messageApi.open({
                    type: 'error',
                    content: " Opération annulé, demande non valide ",
                    duration: 15,
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
                <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            {isUpdate ? "Modifier " : "Ajouter "}
                        </Typography>

                        <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                            Le nouveau qualificatif
                        </Typography>
                        <Input label="Minimal *" size="lg" placeholder={undefined} value={minimal}
                               onChange={(e) => setMinimal(e.target.value)} crossOrigin={undefined} />
                        <Input label="Maximal *" size="lg" placeholder={undefined} value={maximal}
                               onChange={(e) => setMaximal(e.target.value)} crossOrigin={undefined} />
                    </CardBody>
                    <CardFooter className="pt-0" placeholder={undefined}>
                        <Button variant="gradient" onClick={handleSubmit} fullWidth placeholder={undefined}
                                disabled={!maximal || maximal.length < 2 && !minimal || minimal.length < 2}>
                            {isUpdate ? "Modifier" : "Ajouter"}
                        </Button>
                    </CardFooter>
                    <CardFooter className="pt-0" placeholder={undefined} style={{marginTop:'-3%'}}>
                        <Button variant="gradient" onClick={handleClose} fullWidth placeholder={undefined}>
                            Annuler
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>

        </>
    );
}
