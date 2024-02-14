import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
type DialogWithFormProps = {
    title: string;
    message: string;
    open: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function DialogDelete({ title, message, open, setOpen }: DialogWithFormProps) {
    const handleOpen = () => {
        setOpen((prevOpen:any) => !prevOpen);
    };

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
                    <Button variant="gradient" color="green" onClick={handleOpen} placeholder={undefined}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
