import React from "react";
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
type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function RubriqueForm({ open, setOpen }:DialogWithFormProps) {
    const handleOpen = () => {
        setOpen((prevOpen:any) => !prevOpen);
    };


    return (
        <>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
                placeholder={undefined}
            >
                <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            Ajouter une rubrique
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                            placeholder={undefined}
                        >
                            Entrez le nom de la nouvelle rubrique.
                        </Typography>
                        <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                            Désignation de la rubrique
                        </Typography>
                        <Input label="Désignation" size="lg" placeholder={undefined} crossOrigin={undefined}/>
                    </CardBody>
                    <CardFooter className="pt-0" placeholder={undefined}>
                        <Button variant="gradient" onClick={handleOpen} fullWidth placeholder={undefined}>
                            Ajouter
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
