import React, {useEffect, useState} from 'react';
import {Button} from "@material-tailwind/react";
import {DialogDelete} from "../DialogDelete";
import {Question} from "../../model/Question";
import {QuestionService} from "../../services/QuestionService";
import {QuestionForm} from "./questionForm";
import {useDispatch, useSelector} from "react-redux";
import {loadQuestionsAsync} from "../../redux/actionsAsyncThunk";
import {AppDispatch} from "../../redux/store";
import {questionsLits} from "../../redux/questionsSlice";
import {Statics} from "../statics";

const QuestionSTDList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idQuestion, setIdQuestion] = useState();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [rubriqueToUpdate, setRubriqueToUpdate] = useState<Question | null>(null);
    const [disabledButtons, setDisabledButtons] = useState<{[id: number]: boolean}>({});
    const questionService=new QuestionService();
    const questionToDelete = questions.find(question => question.id === idQuestion);

    useEffect(() => {
        //setRubriqueToUpdate(null);
        loadQuestions().then(async r => await fetchData());
    }, [questions]);
    const testDisabled = async (id: any): Promise<boolean> => {
        try {
            const response = await questionService.questionIsUsedInRubriqueOrEvaluation(id);
            console.log(id);
            console.log(response);
            return response; // Retourne la valeur de la réponse obtenue de la promesse
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
            return false;
        }
    };
    const loadQuestions = async () => {
        try {
            let response: Question[] = [];
            response = await questionService.findAllQuestions();
            if (sortOrder === "asc") {
                response.sort((a, b) => a.intitule.localeCompare(b.intitule));
            } else {
                response.sort((a, b) => b.intitule.localeCompare(a.intitule));
            }
            console.log(response)
            setQuestions(response);
        } catch (error) {
            console.error("Erreur lors du chargement des rubriques:", error);
        }
    }

    const fetchData = async () => {
        try {
            const updatedDisabledButtons: { [id: number]: boolean } = {};
            const promises = questions.map(async (question) => {
                const isDisabled = await testDisabled(question.id);
                updatedDisabledButtons[question.id ?? ''] = isDisabled;
                console.log("Question : "+question.intitule +" etat :"+isDisabled)
            });
            await Promise.all(promises);
            // Mettre à jour l'état des boutons désactivés
            setDisabledButtons(updatedDisabledButtons);
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
            // Désactiver tous les boutons en cas d'erreur
            setDisabledButtons({});
        }
    };

    const toggleSortOrder = () => {
        // Inverser l'ordre de tri lorsque l'icône est double-cliquée
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
    const handleOpenDialog = (rubrique?:any) => {
        setDialogOpen(true);
        setIsUpdate(false);

    };
    const handleOpenDialogUpdate = (question: Question) => {
        setRubriqueToUpdate(question); // Met à jour la variable d'état avec les données de la rubrique à mettre à jour
        setIsUpdate(true);
        setDialogOpen(true); // Ouvre la boîte de dialogue avec le formulaire pré-rempli
    };
    const handleOpenDialogDelete = (id:any) => {
        console.log(id);
        setIdQuestion(id)
        setDialogDeleteOpen(true);
    };
    // @ts-ignore
    return (
        <>
            <section className="container px-4 mx-auto mt-7">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-x-3 ">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Liste des questions standards &nbsp;
                        <span
                            className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{questions.length}</span>
                    </h2>

                    <Button
                        className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200  rounded-lg sm:shrink-0 gap-x-2 "
                        placeholder={undefined} onClick={handleOpenDialog}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span > Ajouter</span>
                    </Button>
                </div>



                <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
                                 style={{maxHeight: 'calc(6 * 100px)', overflowY: 'auto'}}>
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0" >
                                    <tr>

                                        <th scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">
                                            <button className="flex items-center gap-x-2">
                                                <span>Intitulé</span>

                                                <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleSortOrder}>
                                                    {/* Le contenu de l'icône */}                                                            <path
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
                                        {/*
                                                <th scope="col"
                                                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <button className="flex items-center gap-x-2">
                                                        <span>Type</span>

                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             stroke-width="2" stroke="currentColor" className="w-4 h-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
                                                        </svg>
                                                    </button>
                                                </th>
                                                */}

                                        <th scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">
                                            Couple de qualificatifs
                                        </th>
                                        <th scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-400 dark:text-gray-400">
                                            Action
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {questions.map((question:Question,index:any) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>{question.intitule}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/*
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                        <div className="flex items-center gap-x-2">
                                                            <p className="px-3 py-1 text-xs text-indigo-500 rounded-full dark:bg-gray-800 bg-indigo-100/60">Standard</p>
                                                        </div>
                                                    </td>
                                                    */}
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white"
                                                                style={{textAlign: "center"}}>
                                                                <span>{question.idQualificatif?.minimal}</span>
                                                                <span style={{margin: "0 5px"}}> | </span>
                                                                <span>{question.idQualificatif?.maximal}</span>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-6">
                                                    <button onClick={() => handleOpenDialogUpdate(question)}
                                                            disabled={disabledButtons[question.id ?? '']}
                                                            className={`transition-colors duration-200 hover:text-blue-600 focus:outline-none ${disabledButtons[question.id] ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-blue-600 dark:hover:text-yellow-400"}`}
                                                            title={disabledButtons[question.id ?? ''] ? "Impossible de modifier la question car elle est déjà utilisée" : ""}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             className="w-5 h-5"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDialogDelete(question.id)}
                                                        disabled={disabledButtons[question.id ?? '']}
                                                        title={disabledButtons[question.id ?? '']? "Impossible de supprimer la question car elle est déjà utilisée" : ""}
                                                        className={`transition - colors duration-200 hover:text-red-500 focus:outline-none ${disabledButtons[question.id] ? "text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50" : "text-red-500 dark:hover:text-red-400"}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             className="w-5 h-5"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <QuestionForm
                open={dialogOpen}
                setOpen={setDialogOpen}
                isUpdate={isUpdate} // Indique si c'est une mise à jour ou une création
                initialData={rubriqueToUpdate} // Passe les données de la rubrique à mettre à jour
            />
            <DialogDelete
                open={dialogDeleteOpen}
                onClose={() => setDialogDeleteOpen(false)}
                title="Suppression du Question"
                messageComp={`Voulez-vous vraiment supprimer la question : "${questionToDelete?.intitule}" ?`}

                id={idQuestion}
                name={"question"}
                setOpen={setDialogDeleteOpen}/>
        </>
    );
}

export default QuestionSTDList;