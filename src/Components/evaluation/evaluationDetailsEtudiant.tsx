import React, {useEffect, useState} from "react";
import {Dialog, DialogBody, DialogFooter, Textarea, Typography} from "@material-tailwind/react";
import {Evaluation} from "../../model/Evaluation";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {EvaluationService} from "../../services/EvaluationService";
import {message} from "antd";
import {faChevronDown, faChevronUp, faXmark} from "@fortawesome/free-solid-svg-icons";
import {IconButton, Rating} from "@mui/material";

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialData?: Evaluation; // Type modified to match Evaluation
};

export function EvaluationDetails({open, setOpen, initialData}: DialogWithFormProps) {


    const [messageApi, contextHolder] = message.useMessage();

    const evaluationService = new EvaluationService();
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(initialData); // Use initialData to initialize evaluation
    const [visibleQuestions, setVisibleQuestions] = useState<{ [key: number]: boolean }>({});
    const [visibleCommentaire, setVisibleCommentaire] = useState(false);
    const [showQuestions, setShowQuestions] = useState<boolean[]>(initialData?.rubriques.map(() => false) ?? []);
    const [commentaire, setCommentaire] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // Update evaluation when initial data changes
            if(initialData?.id!=null){
            const response = await evaluationService.isEtudiantRepondreEvaluation(initialData?.id);
            setCommentaire(response.commentaire);}
            setEvaluation(initialData);
            setShowQuestions(initialData?.rubriques.map(() => false) ?? []);
        };

        fetchData();
    }, [initialData]);

    const handleOpenCommentaire = () => {
        setVisibleCommentaire((prevOpen) => !prevOpen);
    };


    function handleAvancerWorkflow(id: number | undefined) {
        const handleSuccess = () => {
            handleOpen();
            messageApi.open({
                type: 'success',
                content: 'Opération réalisé avec succès ',
            });
        };

        const handleFailure = (error: any) => {
            handleOpen();
            messageApi.open({
                type: 'error',
                content: " Opération annulé, demande non valide ",
            });
        };
        evaluationService.avancerWorkflow(id).then(handleSuccess)
            .catch(handleFailure);
    }
    const handleOpen = () => setOpen(cur => !cur);
    const handleClose = () => {
        setOpen(prevOpen => !prevOpen);
        setCommentaire("")
        setVisibleCommentaire(false)
    }
    const handleEtat = (etat: any) => {
        switch (etat) {
            case "ELA":
                return <span
                    className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-sm mr-6">En cours d'élaboration</span>;

            case "DIS":
                return <span
                    className="px-2 py-1 font-semibold leading-tight text-green-800 bg-green-100 rounded-sm mr-6">Mise à disposition</span>;

            case "CLO":
                return <span
                    className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm mr-6">Clôturée</span>;

            default:
                break;
        }
    };

    const toggleQuestionVisibility = (index: number) => {
        setShowQuestions(prev => {
            const updatedVisibility = [...prev];
            updatedVisibility[index] = !updatedVisibility[index];
            return updatedVisibility;
        });
    };

    const handleQuestionDoubleClick = (index: number) => {
        setShowQuestions(prev => {
            const updatedVisibility = [...prev];
            updatedVisibility[index] = false;
            return updatedVisibility;
        });
    };
    return (
        <>
            {contextHolder}

            <Dialog size="xl" open={open} handler={handleOpen} placeholder={undefined}>
                <section className="bg-white dark:bg-gray-900">
                    <div
                        className="w-auto bg-white h-auto tracking-wide border border-black-800 mx-1 rounded-lg relative">
                        <div className="flex justify-between items-center w-auto">
                            <div>
                                <div className="small-banner w-1 h-20 bg-blue-600 absolute rounded-tl-md"></div>
                                <h5 className="text-2xl font-semibold pl-6 pt-6 pr-6 pb-2">
                                    {evaluation?.designation}
                                </h5>
                                <p className="text-md font-regular p-6 pt-2 text-gray-500">
                                    {evaluation?.codeFormation} | {evaluation?.promotion}
                                </p>
                            </div>

                            <div
                                className="min-w-32"> {/* Utilisez la classe min-w-{value} pour spécifier la largeur minimale */}
                                {handleEtat(evaluation?.etat)}
                            </div>

                        </div>

                    </div>

                    <div className="container">
                        <div className="md:col-span-3 h-auto space-y-2 p-3 w-full">

                            <div className="flex ">
                    <span
                        className="text-sm border bg-blue-600 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Unité d'enseignement</span>
                                <p
                                    className="px-4 border-l-0 cursor-default text-blackborder-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6 mt-2"
                                >{evaluation?.codeUE}</p>
                            </div>
                            <div className="flex ">
                    <span
                        className="text-sm border bg-blue-600 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Élément Constitutif</span>
                                <p
                                    className="px-4 border-l-0 cursor-default text-blackborder-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6 mt-2"
                                >{evaluation?.codeEC ? evaluation.codeEC : '-- '}</p>
                            </div>
                            <div className="flex ">
                    <span
                        className="text-sm border bg-blue-600 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Période</span>
                                <p
                                    className="px-4 border-l-0  cursor-default border-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6 mt-2"
                                >{evaluation?.periode}</p>
                            </div>
                        </div></div>
                </section>
                <DialogBody placeholder={undefined}>
                    <div className="px-0" style={{maxHeight: 'calc(8 * 68px)', overflowY: 'auto'}}>
                        <table className="w-full min-w-max table-auto text-left border border-blue-gray-200">
                            <tbody>
                            {evaluation?.rubriques.map((rubrique:any, index:any) => (
                                <React.Fragment key={index}>
                                    <tr onClick={() => {
                                        toggleQuestionVisibility(index);
                                        setVisibleQuestions(prev => ({
                                            ...prev,
                                            [index]: !prev[index]
                                        }));
                                    }}>
                                        <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200" colSpan={4} >
                                            <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70 flex justify-between items-center font-semibold">{rubrique.designation}
                                                <button

                                                    className={`text-gray-500 transition-colors duration-200 focus:outline-none
                                                             ${visibleQuestions[index] ? 'text-blue-500 hover:text-blue-500 dark:text-gray-300' : 'hover:text-blue-500 dark:hover:text-blue-500 dark:text-gray-300'}`}>
                                                    <FontAwesomeIcon
                                                        icon={visibleQuestions[index] ? faChevronUp : faChevronDown}/>
                                                </button>
                                            </p>
                                            {/* Utilisez items-center pour aligner l'icône au centre verticalement */}
                                        </th>

                                    </tr>
                                    {showQuestions[index] && rubrique.questions.map((question:any, indexQ:any) => (
                                        <tr key={indexQ} onDoubleClick={() => handleQuestionDoubleClick(index)}
                                            className="border-b border-blue-gray-200">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{question.intitule}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-5">
                                                    <div className="flex flex-col">
                                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal pr-8">{question.idQualificatif?.minimal}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 flex justify-center">
                                                <div className="flex items-center gap-3">
                                                    <div key={index} className="text-center flex flex-col">
                                                        <Rating
                                                            name={`rating-${question.id}`}
                                                            disabled
                                                            value={question.positionnements} // Utilisez la valeur de positionnements pour la note
                                                            //disabled={!question.idQualificatif} // Désactivez le Rating si idQualificatif n'est pas défini
                                                        />

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3 ">
                                                    <div className="flex flex-col">
                                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{question.idQualificatif?.maximal}</p>
                                                    </div>
                                                </div>
                                            </td>


                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            <tr onClick={handleOpenCommentaire}>
                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200"
                                    colSpan={4}>
                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70 flex justify-between items-center font-semibold"> Commentaire
                                        <button


                                            className={`text-gray-500 transition-colors duration-200 focus:outline-none
                                                             ${visibleCommentaire ? 'text-blue-500 hover:text-blue-500 dark:text-gray-300' : 'hover:text-blue-500 dark:hover:text-blue-500 dark:text-gray-300'}`}>
                                            <FontAwesomeIcon
                                                icon={visibleCommentaire ? faChevronUp : faChevronDown}/>
                                        </button>
                                    </p>
                                </th>

                            </tr>
                            { visibleCommentaire && <tr className="border-b border-blue-gray-200">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{commentaire}</p>
                                        </div>
                                    </div>
                                </td>

                            </tr>}
                            </tbody>
                        </table>
                    </div>
                </DialogBody>

                <DialogFooter placeholder={undefined} className="flex justify-end mb-2">
                    <div className="flex justify-end space-x-4">
                        <button className="flex px-3 py-2 bg-red-400 text-white font-semibold rounded"
                                onClick={handleClose}
                        >
                        <FontAwesomeIcon icon={faXmark} className="w-6 h-6 mr-2" style={{color: "#ffffff"}}/>
                            <span className="ml-1">Fermer</span>
                        </button>
                    </div>
                </DialogFooter>

            </Dialog>

        </>

    )

}