import React, { useEffect, useState } from "react";
import { message } from 'antd';
import { EvaluationService } from "../../services/EvaluationService";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { faBan, faPaperPlane, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Evaluation } from "../../model/Evaluation";

type DialogWithFormProps = {
    title: string;
    messageComp: string;
    open: boolean;
    eva: any;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialData?: Evaluation;
    name: string;
};

export function DialogChangeEtat({ title, messageComp, eva, name, open, setOpen, initialData }: DialogWithFormProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(initialData);
    const evaluationService = new EvaluationService();

    const handleOpen = () => {
        setOpen(prevOpen => !prevOpen);
    };

    useEffect(() => {
        // Effect
    }, [eva, name]);

    function handleSuccess() {
        handleOpen();
        messageApi.open({
            type: 'success',
            content: 'Opération réalisée avec succès',
            duration: 15,
        });
    }

    function handleEtat(etat: string) {
        switch (etat) {
            case "ELA":
                return "Publier l'évaluation ?";
            case "DIS":
                return "Clôturer l'évaluation ?";
            case "CLO":
                return "Cette évaluation est déjà clôturée.";
            default:
                return "Changer l'état de l'évaluation ?";
        }
    }

    function handleAvancerWorkflow(id: number | undefined) {
        if (!eva.rubriques || eva.rubriques.length === 0) {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: "Cette évaluation ne peut pas être publiée car elle ne contient aucune rubrique.",
                duration: 10,
            });
            return; // Arrêter l'exécution de la fonction
        }

        // Vérification si toutes les rubriques ont des questions
        const rubriquesWithoutQuestions = eva.rubriques.filter((rubrique: any) => !rubrique.questions || rubrique.questions.length === 0);
        if (rubriquesWithoutQuestions.length > 0) {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: "Cette évaluation ne peut pas être publiée car une ou plusieurs rubriques ne contiennent pas de questions.",
                duration: 10,
            });
            return; // Arrêter l'exécution de la fonction
        }

        // Si toutes les vérifications sont passées, continuer avec l'avancement du workflow
        const handleFailure = (error: any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: "Opération annulée, demande non valide",
                duration: 15,
            });
        };

        evaluationService.avancerWorkflow(id)
            .then(handleSuccess)
            .catch(handleFailure);
    }


    return (
        <>
            {contextHolder}
            <Dialog open={open} handler={handleOpen} placeholder={undefined}>
                <DialogHeader placeholder={undefined}>{handleEtat(eva?.etat)}</DialogHeader>
                <DialogBody placeholder={undefined}>{messageComp}</DialogBody>
                <DialogFooter placeholder={undefined}>
                    <Button variant="text" color="gray" onClick={handleOpen} className="mr-1" placeholder={undefined}>
                        <FontAwesomeIcon icon={faX} className="mr-1" />
                        <span>Annuler</span>
                    </Button>
                    {eva?.etat !== 'CLO' && (
                        <button  className={`flex px-3 py-2 ${eva?.etat === 'ELA' ? 'bg-green-400' : 'bg-red-400'} text-white font-semibold rounded items-center` }  onClick={() => handleAvancerWorkflow(eva?.id)}>
                            <FontAwesomeIcon icon={eva?.etat === 'ELA' ? faPaperPlane : faBan} />&nbsp;&nbsp;
                            <span className="mr-1">{eva?.etat === 'ELA' ? 'Publier Evaluation' : 'Clôturer Evaluation'}</span>
                        </button>
                    )}
                </DialogFooter>
            </Dialog>
        </>
    );
}
