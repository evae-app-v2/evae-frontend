import React, {useEffect, useState} from 'react';
import {RubriqueQuestionForm} from "./RubriqueQuestionForm";
import {Button} from "@material-tailwind/react";
import {DialogDelete} from "../DialogDelete";
import {RubriqueQuestions} from "../../model/RubriqueQuestions";
import {RubriqueQuestionService} from '../../services/RubriqueQuestionService';
import {Statics} from "../statics";


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {QualificatifDTO} from "../../model/QualificatifDTO";
import {QuestionDTO} from "../../model/QuestionDTO";
import {RubriqueDTO} from "../../model/RubriqueDTO";
import {RubriqueComposeDTO} from "../../model/RubriqueComposeDTO";

export const RubriqueQuestion = () => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idRubrique, setIdRubrique] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [rubriques, setrubriques] = useState<RubriqueQuestions[]>([]); // Spécifiez le type Etudiant pour l'état initial
    const [searchTerm, setSearchTerm] = useState(""); // Ajoutez une variable d'état pour le terme de recherche
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Ajoutez un état pour le tri
    const [rubriqueToUpdate, setRubriqueToUpdate] = useState<RubriqueQuestions | null>(null); // Nouvelle variable d'état pour la rubrique à mettre à jour
    const rubriqueQuestionService = new RubriqueQuestionService();
    const [designation, setDesignation] = useState<string>(""); // Nouvelle variable d'état pour la désignation
    const [question, setQuestion] = useState<string>(""); // Nouvelle variable d'état pour la désignation
    const [uniqueDesignations, setUniqueDesignations] = useState<string[]>([]);

    // Création des instances de QualificatifDTO
    const qualificatif1 = new QualificatifDTO(1, "Maximal value 1", "Minimal value 1");
    const qualificatif2 = new QualificatifDTO(2, "Maximal value 2", "Minimal value 2");

// Création des instances de QuestionDTO
    const question1 = new QuestionDTO(1, qualificatif1, "Sample question 1", "Type 1", 1);
    const question2 = new QuestionDTO(2, qualificatif2, "Sample question 2", "Type 2", 2);

// Création des instances de RubriqueDTO
    const rubrique1 = new RubriqueDTO(1, "Type 1", "Sample designation 1", 1);
    const rubrique2 = new RubriqueDTO(2, "Type 2", "Sample designation 2", 2);

// Création des instances de RubriqueQuestions pour chaque rubrique
    const rubriqueQuestions1 = new RubriqueQuestions(1, rubrique1.id, question1.id, rubrique1, question1);
    const rubriqueQuestions2 = new RubriqueQuestions(2, rubrique2.id, question2.id, rubrique2, question2);

// Création de l'instance de RubriqueComposeDTO avec les rubriques et les questions correspondantes
    const rubriqueCompose = new RubriqueComposeDTO(1, [rubriqueQuestions1, rubriqueQuestions2]);

//     const navigate = useNavigate();
    useEffect(() => {
        //setRubriqueToUpdate(null);
        loadRubriques();
    }, [searchTerm]); // Utilisez searchTerm comme dépendance du useEffect


    const loadRubriques = async () => {
        let uniqueRubriqueDesignations: Set<string> = new Set();

        rubriqueCompose.listRubriqueQuestion.forEach((rq)=>{
            if (rq.rubriqueDTO) {
                uniqueRubriqueDesignations.add(rq.rubriqueDTO.designation);}

        })
        setUniqueDesignations(Array.from(uniqueRubriqueDesignations));
       /* try {
            let response: RubriqueQuestions[] = await rubriqueQuestionService.getAll();
            let uniqueRubriqueDesignations: Set<string> = new Set();

            // Filtrer les désignations uniques
            response.forEach((rubrique) => {
                if (rubrique.rubriqueDTO) {
                    uniqueRubriqueDesignations.add(rubrique.rubriqueDTO.designation);
                }
            });

            setrubriques(response);
            setUniqueDesignations(Array.from(uniqueRubriqueDesignations));
        } catch (error) {
            console.error("Erreur lors du chargement des rubriques composees:", error);
        }*/
    };
    const toggleSortOrder = () => {
        // Inverser l'ordre de tri lorsque l'icône est double-cliquée
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
    const handleOpenDialog = (rubrique?: any) => {
        setDialogOpen(true);
        setIsUpdate(false);

    };

    const handleView = async (idRubrique: any) => {
        try {
            // Load rubrique details
            const rubriqueDetails = await new RubriqueQuestionService().getQuestionsByRubrique(idRubrique);
            console.log("rubrique details:", rubriqueDetails);
            //   setRubriqueDetails(rubriqueDetails);

            //   // Open rubrique details form
            //   setDialogDetailsOpen(true);
        } catch (error) {
            console.error('Error loading rubrique details:', error);
        }
    };

    // const handleView = (idRubrique: any) => {

    //     setDialogOpen(true);
    //     setIsUpdate(false);
    // }

    const handleOpenDialogDelete = (idRubrique: any) => {
        console.log("idRubrique :", idRubrique);
        setIdRubrique(idRubrique);
        setDialogDeleteOpen(true);
    };


//     // @ts-ignore
    return (
        <>
            <Statics/>
            <section className="container px-4 mx-auto" style={{zIndex: 5}}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">


                    <Button
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200  rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span onClick={handleOpenDialog}>Ajouter </span>
                    </Button>
                </div>

                {/*
                <div className="mt-6 md:flex md:items-center md:justify-between">
                    <div
                        className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">

                        <select
                            className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                            <option
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Filter
                            </option>
                            <option
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard
                            </option>
                            <option
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard
                            </option>
                            <option
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard
                            </option>
                            <option
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard
                            </option>
                        </select>
                    </div>

                    <div className="relative flex items-center mt-4 md:mt-0">
        <span className="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
        </span>
                        <input type="text" placeholder="Search"
                               className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                               value={searchTerm} // Liez la valeur du champ de recherche à searchTerm
                               onChange={(e) => setSearchTerm(e.target.value)} // Mettez à jour searchTerm lorsqu'il y a un changement
                        />
                    </div>
                </div>
*/}


                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
                                 style={{maxHeight: 'calc(6 * 70px)', overflowY: 'auto'}}>
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>

                                        <th scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-x-2">
                                                <span>Nom de la rubrique</span>

                                                <svg className="h-3" viewBox="0 0 10 11" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg" onClick={toggleSortOrder}>
                                                    {/* Le contenu de l'icône */}
                                                    <path
                                                        d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                                        fill="currentColor" stroke="currentColor"
                                                        stroke-width="0.1"/>
                                                    <path
                                                        d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                                        fill="currentColor" stroke="currentColor"
                                                        stroke-width="0.1"/>
                                                    <path
                                                        d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                                        fill="currentColor" stroke="currentColor"
                                                        stroke-width="0.3"/>
                                                </svg>
                                            </button>
                                        </th>

                                        {/* <th scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-x-2">
                                                <span>Question</span>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24"
                                                     stroke-width="2" stroke="currentColor" className="w-4 h-4">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
                                                </svg>
                                            </button>
                                        </th> */}

                                        <th scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {uniqueDesignations.map((designation, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>
                                                                {designation}
                                                            </h2>

                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{rubrique?.questionDTO?.intitule}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td> */}

                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-6">
                                                    {/* Le bouton "Delete" peut être placé ici */}
                                                    <button
                                                        onClick={() => handleOpenDialogDelete((rubriques.find(rubrique => rubrique?.idRubrique))?.idRubrique)}
                                                        className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             stroke-width="1.5" stroke="currentColor"
                                                             className="w-5 h-5">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleView((rubriques.find(rubrique => rubrique?.idRubrique))?.idRubrique)}
                                                        className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                        <FontAwesomeIcon icon={faEye}/>

                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <RubriqueQuestionForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate} // Indique si c'est une mise à jour ou une création
                initialData={rubriqueToUpdate} // Passe les données de la rubrique à mettre à jour
            />
            <RubriqueQuestionForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate} // Indique si c'est une mise à jour ou une création
                initialData={rubriqueToUpdate} // Passe les données de la rubrique à mettre à jour
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression du rubrique composee"
                messageComp="Voulez-vous vraiment supprimer cette rubrique composee ?"
                id={idRubrique}
                name={"rubriqueQuestion"}
                setOpen={setDialogDeleteOpen}/>

        </>
    );
}

export default RubriqueQuestion;
