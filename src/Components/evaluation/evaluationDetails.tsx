import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogBody, DialogFooter, Typography,} from "@material-tailwind/react";
import {Evaluation} from "../../model/Evaluation";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { ColDef } from 'ag-grid-community'; // Importez ColDef depuis ag-grid-community
import { TECollapse } from "tw-elements-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faEye, faXmark} from "@fortawesome/free-solid-svg-icons";
import {EvaluationService} from "../../services/EvaluationService";
import {message} from "antd";
type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialData?: Evaluation; // Type modifié pour correspondre à Evaluation
};

export function EvaluationDetails({ open, setOpen, initialData }: DialogWithFormProps) {

    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    }
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(initialData); // Utilisation de initialData pour initialiser l'évaluation
    const [messageApi, contextHolder] = message.useMessage();

    const handleOpen = () => setOpen((cur) => !cur);
    const evaluationService = new EvaluationService();

    useEffect(() => {
        // Mise à jour de l'évaluation si les données initiales changent
        setEvaluation(initialData);
    }, [initialData]);


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

    return (
            <>
                {contextHolder}

                <Dialog size="xl" open={open} handler={handleOpen} placeholder={undefined}>
                    <section className="bg-white dark:bg-gray-900">
                        <div className="w-auto bg-white h-auto tracking-wide border border-black-800 mx-1 rounded-lg relative">
                            <div className="flex justify-between items-center w-auto">
                                <div>
                                    <div className="small-banner w-1 h-20 bg-blue-600 absolute rounded-tl-md"></div>
                                    <h5 className="text-2xl font-semibold pl-6 pt-6 pr-6 pb-2">
                                        {evaluation?.designation}
                                    </h5>
                                    <p className="text-md font-regular p-6 pt-2 text-gray-500">
                                        Master 2 DOSI
                                    </p>
                                </div>

                                    <div className="min-w-32"> {/* Utilisez la classe min-w-{value} pour spécifier la largeur minimale */}
                                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm mr-6">En Cours</span>
                                    </div>

                            </div>

                        </div>

                        <div className="container px-4 py-8 mx-auto">
                            <div className="grid grid-cols-1 gap-4  l:gap-12 md:grid-cols-3 xl:grid-cols-3"
                                 style={{justifyItems: 'space-between'}}>
                                <div className="bg-white text-black w-full max-w-md flex flex-col rounded-xl shadow-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full w-4 h-4 border border-purple-500"></div>
                                            <div className="text-md font-bold">{evaluation?.codeUE}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-gray-500 font-bold text-sm">
                                        # Unité d'enseignement
                                    </div>
                                </div>
                                <div className="bg-white text-black w-full max-w-md flex flex-col rounded-xl shadow-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full w-4 h-4 border border-purple-500"></div>
                                            <div className="text-md font-bold">{evaluation?.codeEC}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-gray-500 font-bold text-sm">
                                        # Element Constitutif
                                    </div>
                                </div>
                                <div className="bg-white text-black w-full max-w-md flex flex-col rounded-xl shadow-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full w-4 h-4 border border-purple-500"></div>
                                            <div className="text-md font-bold">{evaluation?.periode}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-gray-500 font-bold text-sm">
                                        # Période
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <DialogBody placeholder={undefined}>
                        <div className=" px-0" style={{maxHeight: 'calc(8 * 68px)', overflowY: 'auto'}}>
                            <table className="w-full min-w-max table-auto text-left border border-blue-gray-200">
                                <tbody>
                                {evaluation?.rubriques.map((rubrique, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">{rubrique.designation}</p>
                                                </th>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200"></th>
                      {/*                          <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">1</p>
                                                </th>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">2</p>
                                                </th>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">3</p>
                                                </th>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">4</p>
                                                </th>
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200">
                                                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">5</p>
                                                </th>*/}
                                                <th className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 border border-blue-gray-200"></th>
                                            </tr>
                                            {rubrique.questions.map((question, indexQ) => (
                                                <tr key={indexQ}>
                                                    <td className="p-4 border border-blue-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{question.intitule}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 border border-blue-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{question.idQualificatif?.minimal}</p>
                                                            </div>
                                                        </div>
                                                    </td>
{/*                                                    <td className="p-4  border border-blue-gray-200"></td>
                                                    <td className="p-4  border border-blue-gray-200"></td>
                                                    <td className="p-4  border border-blue-gray-200"></td>
                                                    <td className="p-4  border border-blue-gray-200"></td>
                                                    <td className="p-4  border border-blue-gray-200"></td>*/}
                                                    <td className="p-4  border border-blue-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{question.idQualificatif?.maximal}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>


                    </DialogBody>

                    <DialogFooter placeholder={undefined} className="flex justify-between mb-2">

                        <div className="flex justify-end space-x-4">
                            {evaluation?.etat !== 'CLO' && (
                                <button
                                    className={`flex px-3 py-2 ${evaluation?.etat === 'ELA' ? 'bg-green-400' : 'bg-red-400'} text-white font-semibold rounded items-center`}
                                    onClick={() => handleAvancerWorkflow(evaluation?.id)}
                                >
            <span className="mr-1">
                {evaluation?.etat === 'ELA' ? 'Publier Evaluation' : 'Cloturer Evaluation'}
            </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            )}

                            <button className="flex px-3 py-2 bg-red-400 text-white font-semibold rounded"
                                    onClick={handleClose}
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-6 h-6 mr-2" style={{color: "#ffffff"}}/>
                                <span className="ml-1">Fermer</span>
                        </div>

                    </DialogFooter>
                </Dialog>
            </>
    )
        ;

}
