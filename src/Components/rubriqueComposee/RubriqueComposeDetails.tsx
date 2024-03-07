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
type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialData?: Evaluation; // Type modifié pour correspondre à Evaluation
};

export function RubriqueComposeDetails({ open, setOpen, initialData }: DialogWithFormProps) {

    const handleClose = () => {
        setOpen((prevOpen) => !prevOpen);
    }
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(initialData); // Utilisation de initialData pour initialiser l'évaluation

    const handleOpen = () => setOpen((cur) => !cur);

    useEffect(() => {
        // Mise à jour de l'évaluation si les données initiales changent
        setEvaluation(initialData);
    }, [initialData]);


    return (
        <>
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
                    <div className=" px-0" style={{maxHeight: 'calc(6 * 40px)', overflowY: 'auto'}}>
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
                                        {rubrique.questions.map((question:any, indexQ:any) => (
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


                    <button className="flex px-3 py-2 bg-orange-400 text-white font-semibold rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/>
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="ml-1">Modifier</span>
                    </button>
                    <button className="flex px-3 py-2 bg-red-400 mr-1 text-white font-semibold rounded"
                            onClick={handleClose}>

                        <FontAwesomeIcon icon={faXmark} className="w-6 h-6 mr-2" style={{color: "#ffffff",}} />
                        <span className="ml-1">Fermer</span>
                    </button>
                </DialogFooter>
            </Dialog>
        </>
    )
        ;

}
