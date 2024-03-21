import React, {useEffect, useState} from 'react';
import {IconButton, Rating} from "@mui/material";
import {
    faChevronDown,
    faChevronUp,
    faCircleQuestion,
    faPaperPlane,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {EvaluationService} from "../../services/EvaluationService";
import {Evaluation} from "../../model/Evaluation";
import {Dialog} from "@material-tailwind/react";
import {useParams} from "react-router-dom";
import {EvaluationDetails} from "./evaluationDetailsEtudiant";
import {ReponseQuestionDTO} from "../../model/ReponseQuestionDTO";
import {ReponseEvaluationDTO} from "../../model/ReponseEvaluationDTO";
import {DialgueComment} from "./dialgueComment";

const RepondreEvaluation = () => {
    const [value, setValue] = useState(null);
    const evaluationService = new EvaluationService();
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>();
    const [data, setData] = useState<ReponseEvaluationDTO | undefined>();
    const { id } = useParams();
    const [active, setActive] = useState(0); // Commencez par l'indice 0 pour accéder aux rubriques
    const [questions, setQuestions] = useState<any[]>([]); // État pour stocker les questions de la rubrique active
    const [userResponses, setUserResponses] = useState<{ [questionId: number]: { positionnement?: number } }>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rubriqueId, setRubriqueId] = useState(0);


    useEffect(() => {
        if (!id) return;

        evaluationService.getEvaluationById(id).then(date => {
            setEvaluation(date);
            console.log(date)

            if (date && date.rubriques && date.rubriques.length > 0) {
                setQuestions(date.rubriques[0].questions);
                setRubriqueId(date.rubriques[0].idRubrique)
                console.log("test1: "+date.rubriques[0].idRubrique)// Initialisez les questions avec celles de la première rubrique
                //console.log(date.rubriques[1].idRubrique)// Initialisez les questions avec celles de la première rubrique
                //console.log(date.rubriques[2].idRubrique)// Initialisez les questions avec celles de la première rubrique
            }
        });

        return () => {
            // Nettoyage si nécessaire
        };
    }, [id]);

    useEffect(() => {
        console.log("Réponses utilisateur :");
        console.log("Réponses utilisateur :");
        Object.entries(userResponses).forEach(([questionId, response]) => {
            console.log(`Question ID: ${questionId}, Positionnement: ${response.positionnement}, Taille du tableau: ${Object.keys(userResponses).length}`);
        });
        console.log("ITs me :"+isDisbledOrNot())
        console.log("Taille me :"+(Object.entries(userResponses).length))
        isDisbledOrNot()

    }, [userResponses]);
    const next = () => {
        if (active + 1 != evaluation?.rubriques.length) {
            setActive(active + 1);
            setQuestions(evaluation?.rubriques[active + 1].questions); // Mettez à jour les questions avec celles de la rubrique suivante
        }else{
            const reponseEvaluationDTO=mapUserResponsesToDTO()
            setData(reponseEvaluationDTO);
            setDialogOpen(true)
            //saveUserResponses();

        }
    };
    const isDisbledOrNot = (): any => {
        return (active + 1 === evaluation?.rubriques.length) && (Object.entries(userResponses).length==0);
    }
    const prev = () => {
        if (active > 0) {
            setActive(active - 1);
            setQuestions(evaluation?.rubriques[active - 1].questions); // Mettez à jour les questions avec celles de la rubrique précédente
        }
    };
    const handleRubriqueClick = (rubriqueId: number) => {
        setActive(rubriqueId);
        setQuestions(evaluation?.rubriques[rubriqueId].questions);

    };


    /*   const handleResponseChange = (questionId: any, newValue: number) => {
           console.log(newValue);
           setUserResponses(prevState => ({
               ...prevState,
               [questionId]: {
                   ...prevState[questionId],
                   positionnement: newValue // Ajoutez 'positionnement' ici
               }
           }));
       };*/
    const handleResponseChange = (questionId: any, newValue: number | null) => {
        console.log(newValue);
        if (newValue !== null) {
            setUserResponses(prevState => ({
                ...prevState,
                [questionId]: {
                    ...prevState[questionId],
                    positionnement: newValue // Ajoutez 'positionnement' ici
                }
            }));
        } else {
            setUserResponses(prevState => {
                const updatedUserResponses = { ...prevState };
                delete updatedUserResponses[questionId];
                return updatedUserResponses;
            });
        }
    };




    const saveUserResponses = () => {
        // Enregistrer les réponses des utilisateurs dans votre système de stockage (base de données, API, etc.)
        console.log("Réponses enregistrées :", userResponses);
        // Vous pouvez appeler une fonction de service pour enregistrer les réponses ici
        const reponseEvaluationDTO=mapUserResponsesToDTO()
        evaluationService.repondreEvaluation(reponseEvaluationDTO)
    };
    const handleOpenDialogUpdate = () => {
        setDialogOpen(true);
    };

    function handlChangeRubrique(rubrique:any) {
        console.log(rubrique)
        setRubriqueId(rubrique.idRubrique)// Initialisez les questions avec celles de la première rubrique
        console.log("rubriqueId : "+rubrique.idRubrique)

    }
    const mapUserResponsesToDTO = (): ReponseEvaluationDTO => {
        const reponseQuestionDTOs: ReponseQuestionDTO[] = Object.entries(userResponses).map(([questionId, response]) => {
            return new ReponseQuestionDTO(parseInt(questionId), response.positionnement || 0);
        });

        const reponseEvaluationDTO = new ReponseEvaluationDTO(evaluation?.id || null, "", reponseQuestionDTOs);

        // Maintenant, vous pouvez sauvegarder reponseEvaluationDTO ou faire autre chose avec lui
        console.log("ReponseEvaluationDTO :", reponseEvaluationDTO);

        return reponseEvaluationDTO;
    };



    return (
        <>

            <section style={{width: '90%', marginTop: '2%'}} className="m-auto ">
                <div
                    className="bg-white shadow-xl shadow-gray-100 w-full  flex flex-col sm:flex-row gap-3 sm:items-center justify-between px-5 py-4 rounded-md">
                    <div>
                        <h3 className="font-bold mt-px">{evaluation?.designation}</h3>
                        <div
                            className=" text-white font-medium mt-1 rounded-md flex items-center">
                                <span
                                    className="text-purple-800 text-sm">Créé par {evaluation?.noEnseignant.prenom + " " + evaluation?.noEnseignant.nom}</span>
                        </div>
                    </div>
                    <div>

                        <div className="flex items-center mt-2">
                            <div className="mr-2">
                                <span
                                    className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm"
                                    style={{marginLeft: '-2%'}}>{'Code UE : ' + evaluation?.codeUE}</span>
                            </div>
                            <span className="mr-2">&#47;</span>
                            <div>
                                <span
                                    className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm"
                                    style={{marginLeft: '-2%'}}>{'Code EC :  ' + (evaluation?.codeEC?evaluation?.codeEC:"--")}</span>
                            </div>


                        </div>

                    </div>
                </div>
            </section>

            <div className="flex justify-start items-center h-screen " style={{/*border:'2px blue solid'*/}}>
                <div style={{width: '90%',/*border:'2px red solid' ,*/marginTop: '2%'}} className="m-auto">
                    {/* Stepper Nav */}
                    {/* End Stepper Nav */}

                    <div>

                        <div
                            className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
                        >
                            <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                                {
                                    evaluation?.rubriques.map((rubrique: any, index: any) => (
                                        <li className="flex items-center gap-2 bg-white p-2" key={index}
                                            onClick={() => {
                                                handleRubriqueClick(index);
                                                handlChangeRubrique(rubrique);
                                            }}
                                        >
                              <span
                                  className={`size-6 rounded-full text-center text-[10px]/6 font-bold`}
                                  style={
                                      active === index
                                          ? {
                                              backgroundColor: "-webkit-linear-gradient(90deg, #ea5c54, #bb6dec)",
                                              background: "linear-gradient(90deg, #ea5c54, #bb6dec)",
                                              color: "white"
                                          }
                                          : {
                                              backgroundColor: "-webkit-linear-gradient(90deg, #cccccc, #dddddd)",
                                              background: "linear-gradient(90deg, #cccccc, #dddddd)"
                                          }
                                  }
                              >
    {index + 1}
</span>


                                            <button><span
                                                className={` hidden sm:block font-bold ${active === index ? 'text-purple-800 ' : 'text-gray-500'}`}
                                            > {rubrique.designation} </span>
                                            </button>
                                        </li>
                                    ))
                                }

                            </ol>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-12 "  >
                        <div className="w-full h-full"  style={{ maxHeight: 'calc(5 * 100px)', overflowY: 'auto' }}>
                            <div
                                className="p-2 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl border-2"
                            >
                                <div className=" mx-auto">
                                    <div className="px-10 sm:px-16">
                                        <div className="ml-2 ">
                                            <div className="flex-col my-8">
                                                <table className="w-full">
                                                    <tbody>
                                                    <React.Fragment>

                                                        {questions.map((question, index) => (
                                                            <tr key={index}>
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className="hidden sm:flex items-center justify-center mr-3 rounded-full text-xl font-semibold">
                                                                            <FontAwesomeIcon icon={faCircleQuestion}
                                                                                             className="text-indigo-500"/>
                                                                        </div>
                                                                        <div className="text-md w-full flex justify-between">
                                                                            <h1 className="text-gray-900 font-semibold mb-2"
                                                                            >{question.intitule}</h1>
                                                                        </div></div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex justify-end gap-3"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal pr-8">{question.idQualificatif?.minimal}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 flex justify-center">
                                                                    <div className="flex items-center gap-3">

                                                                        <div className="text-center flex flex-col">
                                                                            <Rating
                                                                                className=""
                                                                                name={`rating-${question.id}`}
                                                                                value={userResponses[question.id]?.positionnement || null} // Utilisez la réponse de l'utilisateur s'il existe
                                                                                onChange={(event, newValue: any) => {
                                                                                    handleResponseChange(question.id, newValue); // Mettez à jour les réponses de l'utilisateur
                                                                                }}
                                                                                style={{flex: '50%'}} // Rating prend 50% de l'espace
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
                                                    </tbody>

                                                </table>
                                            </div></div></div></div></div></div>
                        {/* Stepper Content
                    <div className="mt-12 sm:mt-12 ">
                        <div className="w-full h-full">
                            <div
                                className="p-4 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl border-2"
                                style={{height: '600px'}}>
                                <div className=" mx-auto">
                                    <div className="px-10 sm:px-16">
                                        <div className="ml-2 ">
                                            <div className="flex-col my-8">
                                                {questions.map((question, index) => (
                                                    <div key={index} className="flex items-start my-8">
                                                        <div
                                                            className="hidden sm:flex items-center justify-center mr-3 rounded-full text-xl font-semibold">
                                                            <FontAwesomeIcon icon={faCircleQuestion}
                                                                             className="text-indigo-500"/>
                                                        </div>
                                                        <div className="text-md w-full flex justify-between">
                                                            <h1 className="text-gray-900 font-semibold mb-2"
                                                                style={{width: '60%'}}>{question.intitule}</h1>
                                                            <div className="card flex justify-between"
                                                                 style={{width: '40%', gap: '10px'}}>
                                                                <h3 className="text-gray-900  mb-2"
                                                                    style={{flex: '20%'}}>{question.idQualificatif.minimal}</h3>
                                                                <Rating
                                                                    className=""
                                                                    name={`rating-${question.id}`}
                                                                    value={userResponses[question.id]?.positionnement || null} // Utilisez la réponse de l'utilisateur s'il existe
                                                                    onChange={(event, newValue: any) => {
                                                                        handleResponseChange(question.id, newValue); // Mettez à jour les réponses de l'utilisateur
                                                                    }}
                                                                    style={{flex: '50%'}} // Rating prend 50% de l'espace
                                                                />
                                                                <h3 className="text-gray-900  mb-2"
                                                                    style={{flex: '20%'}}>{question.idQualificatif.maximal}</h3>
                                                            </div>


                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
*/}
                        <div className="mt-5 flex justify-between items-center gap-x-2">
                            <button type="button" onClick={prev} disabled={active === 0}
                                    className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                                    data-hs-stepper-back-btn>
                                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24"
                                     height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                                Revenir
                            </button>
                            <button type="button" onClick={next}
                                    disabled={isDisbledOrNot()}
                                    title={isDisbledOrNot() ? "Vous devez au moins répondre à une question" : ""}
                                    className={`py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent  disabled:opacity-50 disabled:pointer-events-none`}
                                    data-hs-stepper-next-btn style={{
                                backgroundColor: active + 1 != evaluation?.rubriques.length ? "-webkit-linear-gradient(90deg, #ea5c54, #bb6dec)" : "green",
                                background: active + 1 != evaluation?.rubriques.length ? "linear-gradient(90deg, #ea5c54, #bb6dec)" : "green",
                                color: active + 1 != evaluation?.rubriques.length ? "white" : "white", // Ajoutez d'autres styles si nécessaire
                            }}

                            >
                                &nbsp;&nbsp;  {active + 1 === evaluation?.rubriques.length ? <FontAwesomeIcon
                                icon={faPaperPlane}/> : null} {active + 1 === evaluation?.rubriques.length ? "Envoyer les réponses" : "Suivant"}
                                {active + 1 === evaluation?.rubriques.length ? null : (
                                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24"
                                         height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <DialgueComment
                open={dialogOpen}
                setOpen={setDialogOpen}
                data={data}
            />

        </>
    );
}

export default RepondreEvaluation;
