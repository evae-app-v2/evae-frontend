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
        const newRubrique = new Rubrique(
            'RBS',
            null,
            designation,
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
            messageApi.open({
                type: 'success',
                content: 'Opération réalisée avec succès',
            });
        };

        const handleFailure = (error:any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: 'Opération refusé, demande non valide',
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
                            {isUpdate ? "Modifier " : "Ajouter "}
                        </Typography>
                        <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                            la nouvelle rubrique
                        </Typography>
                        <Input label="Désignation *" size="lg" placeholder={undefined} value={designation}
                               onChange={(e) => setDesignation(e.target.value)} crossOrigin={undefined} />
                    </CardBody>
                    <CardFooter className="pt-0" placeholder={undefined}>
                        <Button variant="gradient" onClick={handleSubmit} fullWidth placeholder={undefined}
                                disabled={!designation || designation.length < 2}>
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
