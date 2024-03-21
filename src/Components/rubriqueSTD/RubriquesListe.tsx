import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from "@material-tailwind/react";
import icon from "../../assets/glisser-deposer(2).png";
import { DialogDelete } from "../DialogDelete";
import { Rubrique } from "../../model/Rubrique";
import { RubriqueService } from "../../services/RubriqueService";
import { Statics } from "../statics";
import { RubriqueForm } from "./RubriqueForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const RubriqueListe = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idRubrique, setIdRubrique] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [rubriqueToUpdate, setRubriqueToUpdate] = useState<Rubrique | null>(null);
    const rubriqueService = new RubriqueService();

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadRubriques();
    }, [rubriques, searchTerm]);

    const loadRubriques = async () => {
        try {
            let response: Rubrique[] = [];
            if (searchTerm) {
                const rubrique = await rubriqueService.getByDesignation(searchTerm);
                if (rubrique) {
                    response = [rubrique];
                }
            } else {
                response = await rubriqueService.getAll();

                const sortedRubriques = response.sort((a, b) =>
                    (a.ordre || 0) - (b.ordre || 0)
                );

                setRubriques(sortedRubriques);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des rubriques:", error);
        }
    };

    const handleOpenDialog = (rubrique?: any) => {
        setDialogOpen(true);
        setIsUpdate(false);
    };

    const handleOpenDialogUpdate = (rubrique: Rubrique) => {
        setRubriqueToUpdate(rubrique);
        setIsUpdate(true);
        setDialogOpen(true);
    };

    const handleOpenDialogDelete = (id: any) => {
        console.log(id);
        setIdRubrique(id);
        setDialogDeleteOpen(true);
    };

    const onDragEnd = async (result:any) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;
        const updatedRubriques = Array.from(rubriques);

        // Check if the item is dropped at the end
        const isDroppedAtEnd = destination.index === rubriques.length;

        // If it's dropped at the end, update the order accordingly
        if (isDroppedAtEnd) {
            const [movedItem] = updatedRubriques.splice(source.index, 1);
            updatedRubriques.push(movedItem);
        } else {
            // Otherwise, perform the usual reordering
            const [movedItem] = updatedRubriques.splice(source.index, 1);
            updatedRubriques.splice(destination.index, 0, movedItem);
        }

        setRubriques(updatedRubriques);

        const updatedRubriquesData = updatedRubriques.map((rubrique, index) => ({
            ...rubrique,
            ordre: index + 1,
        }));

        try {
            await rubriqueService.updateOrdre(updatedRubriquesData);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'ordre:", error);
        }
    };

    return (
        <>
            <section className="container px-4 mx-auto mt-7">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Listes des rubriques &nbsp;
                        <span
                            className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {rubriques.length}
            </span>
                    </h2>

                    <Button onClick={handleOpenDialog}
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span >Ajouter</span>
                    </Button>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div
                                className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
                                style={{maxHeight: 'calc(6 * 100px)', overflowY: 'auto'}}
                            >
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="rubriques">
                                        {(provided) => (
                                            <table
                                                className="w-full divide-y divide-gray-200 dark:divide-gray-700"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">

                                                        <button className="flex items-center gap-x-2">
                                                            <span>Désignation des rubriques</span>
                                                        </button>
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">

                                                        Action
                                                    </th>
                                                </tr>
                                                </thead>
                                                <Droppable droppableId="rubriques" direction="vertical">
                                                    {(provided) => (
                                                        <tbody
                                                            className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                        >
                                                        {rubriques.map((rubrique: Rubrique, index) => (
                                                            <Draggable
                                                                key={index}
                                                                draggableId={index.toString()}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <tr
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        tabIndex={0}
                                                                        className={index === selectedRowIndex ? 'bg-gray-200' : ''}
                                                                    >
                                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                                            <div
                                                                                className="inline-flex items-center gap-x-3">
                                                                                <div
                                                                                    className="flex items-center gap-x-2">
                                                                                    <img src={icon} style={{ width: '25px' }} />&nbsp;
                                                                                    <div>
                                                                                        <h2 className="font-medium text-gray-800 dark:text-white"
                                                                                            style={{textAlign: "center"}}>{rubrique.designation}</h2>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>

                                                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                                            <div className="flex items-center gap-x-6">

                                                                                <button
                                                                                    onClick={() => handleOpenDialogUpdate(rubrique)}
                                                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none" viewBox="0 0 24 24"
                                                                                        stroke-width="1.5"
                                                                                        stroke="currentColor"
                                                                                        className="w-5 h-5">
                                                                                        <path stroke-linecap="round"
                                                                                              stroke-linejoin="round"
                                                                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                                                                    </svg>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleOpenDialogDelete(rubrique.id)}
                                                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none" viewBox="0 0 24 24"
                                                                                        stroke-width="1.5"
                                                                                        stroke="currentColor"
                                                                                        className="w-5 h-5">
                                                                                        <path stroke-linecap="round"
                                                                                              stroke-linejoin="round"
                                                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                                                    </svg>
                                                                                </button>

                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        </tbody>
                                                    )}
                                                </Droppable>
                                            </table>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RubriqueForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate}
                initialData={rubriqueToUpdate}
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression du rubrique"
                messageComp="Voulez-vous vraiment supprimer cette rubrique ?"
                id={idRubrique}
                name={"rubrique"}
                setOpen={setDialogDeleteOpen}
            />
        </>
    );
}

export default RubriqueListe;
