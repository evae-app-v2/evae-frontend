import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import {RubriqueService} from "../services/RubriqueService";
import {QualificatifService} from "../services/QualificatifService";
type DialogWithFormProps = {
    title: string;
    message: string;
    open: boolean;
    id: any;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    name:string
};
export function DialogDelete({ title, message,id, name,open, setOpen }: DialogWithFormProps) {
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
            default:
                break;
        }

    }, [id,name]); // Utilisez searchTerm comme dépendance du useEffect
    const handlValid= () => {
        service.delete(id);
        handleOpen();

    }


    return (
        <>
            <Dialog open={open} handler={handleOpen} placeholder={undefined}>
                <DialogHeader placeholder={undefined}>{title}</DialogHeader>
                <DialogBody placeholder={undefined}>{message}</DialogBody>
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