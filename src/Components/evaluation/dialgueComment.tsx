import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    Typography,
    Input,
    Textarea, DialogFooter,
} from "@material-tailwind/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faPaperPlane, faRotateLeft, faX} from "@fortawesome/free-solid-svg-icons";
import {EvaluationService} from "../../services/EvaluationService";
import {ReponseEvaluationDTO} from "../../model/ReponseEvaluationDTO";
import {useNavigate} from "react-router-dom";
import {hideLoading} from "../../redux/alertsSlice";

type DialogWithFormProps = {
    open: boolean;
    data?: ReponseEvaluationDTO;
    onClose?: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DialgueComment({ data, open, setOpen }: DialogWithFormProps) {
    const evaluationService = new EvaluationService();
    const [commentaire, setCommentaire] = useState("");
    const [isOpen, setIsOpen] = useState(open);
    const [openSuccus,setOpenSuccus ] = useState(false);
    const navigate = useNavigate();

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };
    const handleOpenSuccus = () => {
        setOpenSuccus((prevOpen: any) => !prevOpen);
    };
    const handleOpen = () => {
        setOpen((prevOpen: any) => !prevOpen);
    };

    function handleSubmit() {
        if(data!=null){
            data?.setCommentaire(commentaire);
            evaluationService.repondreEvaluation(data);
            handleClose();
            handleOpenSuccus()
        }

    }
    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);}
    const handleGoBack = () => {
        // Perform logout logic, clear local storage, or revoke the authentication token
        navigate("/evae/etud/evaluations"); // Redirect to the login page after logout
    };
    const handleClose2 = () => {
        handleGoBack();
    }

    return (
        <>
            <Dialog  size="sm" open={open} handler={handleOpen} placeholder={undefined}>
                <div className="flex items-center justify-between">
                    <DialogHeader className="flex flex-col items-start" placeholder={undefined}>
                        <Typography className="mb-1" variant="h4" placeholder={undefined}>
                            Commentaire
                        </Typography>
                    </DialogHeader>
                </div>
                <DialogBody placeholder={undefined}>
                    <Typography className="mb-10 -mt-7 " color="gray" variant="lead" placeholder={undefined}>
                        Souhaitez-vous laisser un commentaire ?
                    </Typography>
                    <div className="grid gap-6">
                        <Textarea label="Commentaire" placeholder={undefined} value={commentaire} onChange={(e) => setCommentaire(e.target.value)}/>
                    </div>
                </DialogBody>
                <div className="flex justify-end mt-6 mr-4 mb-4">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                        placeholder={undefined}
                    >

                        <FontAwesomeIcon icon={faX} className="mr-1" />
                        <span>Annuler</span>
                    </Button>
                    <Button  className=" text-white ml-3" style={{backgroundColor:"green"}} onClick={handleSubmit} placeholder={undefined}>
                        <FontAwesomeIcon icon={faPaperPlane} />&nbsp;&nbsp;envoyer les réponses
                    </Button>
                </div>
            </Dialog>{/*
            {isOpen && (            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="rounded-lg bg-gray-50 px-16 py-14">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-200 p-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">Congratulation!!!</h3>
                    <p className="w-[230px] text-center font-normal text-gray-600">Your order have been taken and is
                        being attended to</p>
                    <button
                        className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300">Track
                        Order
                    </button>
                </div>
            </div>)}*/}
            <Dialog
                open={openSuccus}
                size="xs"
                handler={handleOpenSuccus}
                placeholder={undefined}
            >
                <DialogBody placeholder={undefined} >
                    <div className="flex h-auto items-center justify-center bg-gray-100">
                        <div className="rounded-lg bg-gray-100 px-16 py-14">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-200 p-6">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M4.5 12.75l6 6 9-13.5"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">Vous avez terminé l'évaluation !!!</h3>
                            <p className="w-full text-center font-normal text-gray-600">Merci pour votre participation</p>
                            <button
                                className="mx-auto text-white mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300" onClick={()=>handleGoBack()}> <FontAwesomeIcon icon={faRotateLeft} /> Revenir à la page d'accueil
                            </button>
                        </div></div>
                </DialogBody>
            </Dialog>
        </>
    );
}