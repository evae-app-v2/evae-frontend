import React, { ChangeEvent, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Select,
    Option,
} from "@material-tailwind/react";
import { EvaluationService } from "../../services/EvaluationService";
import { Enseignant } from "../../model/Enseignant"; // Assurez-vous d'avoir cette classe modèle
import { Promotion } from "../../model/Promotion";
import { UniteEnseignement } from "../../model/UniteEnseignement";
import { ElementConstitutif } from "../../model/ElementConstitutif";
import { message } from "antd";
import { Evaluation } from "../../model/Evaluation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faX } from "@fortawesome/free-solid-svg-icons";
import { RubriqueQuestionService } from "../../services/RubriqueQuestionService";
import { RubriqueService } from "../../services/RubriqueService";
import { RubriqueQuestionDTOO } from "../../model/RubriqueQuestionInterface";
import { Question } from "../../model/Question";
import { QuestionService } from "../../services/QuestionService";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { QuestionEvaluation } from "../../model/QuestionEvaluation";
import { RubriqueEvaluation } from "../../model/RubriqueEvaluation";
import { PreparedData } from "../../model/PreparedData";




// Supposons que EnseignantConnecte est l'enseignant actuellement connecté
const enseignantConnecte: Enseignant = {
    id: 0,
    emailUbo: "",
    nom: "",
    prenom: ""
};

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean;
    initialData?: any;
};

export function EvaluationForm({ open, setOpen, isUpdate, initialData }: DialogWithFormProps) {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [formations, setFormations] = useState<Promotion[]>([]);

    const [uniteEnseignements, setUniteEnseignements] = useState<UniteEnseignement[]>([]);
    const [elementConstitutifs, setElementConstitutifs] = useState<ElementConstitutif[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<string>("");
    const [selectedCodeFormation, setSelectedCodeFormation] = useState<string>("");
    const [selectedCodeUE, setSelectedCodeUE] = useState<string>("");
    const [selectedCodeEC, setSelectedCodeEC] = useState<string>("");
    const evaluationService = new EvaluationService();
    const [messageApi, contextHolder] = message.useMessage();

    const [noEvaluation, setNoEvaluation] = useState<number>(0);
    const [designation, setDesignation] = useState<string>("");
    const [etat, setEtat] = useState<string>("");
    const [updatable, setUpdatable] = useState(isUpdate);
    const [periode, setPeriode] = useState<string>("");
    const [debutReponse, setDebutReponse] = useState<string>("");
    const [finReponse, setFinReponse] = useState<string>("");


    const [selectedRubrique, setSelectedRubrique] = useState<string>('');
    //const [rubriquesAjoutees, setRubriquesAjoutees] = useState<string[]>([]);
    //const [rubriquesAjoutees, setRubriquesAjoutees] = useState<{ id: number; designation: string; }[]>([]);
    const [rubriquesAjoutees, setRubriquesAjoutees] = useState<{ id: number; designation: string; questions: Question[] }[]>([]);




    const rubriqueQuestionService = new RubriqueQuestionService();
    const rubriqueService = new RubriqueService();
    const [rubriqueQuestionDTOOs, setRubriqueQuestionDTOOs] = useState<RubriqueQuestionDTOO[]>([]);


    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [questions, setQuestions] = useState<Question[]>([]);
    const questionService = new QuestionService();

    const [rubriqueEnCoursDeModification, setRubriqueEnCoursDeModification] = useState<number | null>(null);
    const [rubriqueSelectionneePourQuestions, setRubriqueSelectionneePourQuestions] = useState<number | null>(null);

    const [selectedQuestion, setSelectedQuestion] = useState<string>('');

    const [designationError, setDesignationError] = useState<string>("");
    const [periodeError, setPeriodeError] = useState<string>("");
    const DESIGNATION_LIMIT = 16;
    const PERIODE_LIMIT = 64;

    const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //setDesignation(value);
        if (value.length > DESIGNATION_LIMIT) {
            setDesignationError("Vous avez atteint la limite maximale de caractères. (16 max)");
        } else {
            setDesignation(value);
            setDesignationError("");
        }
    };

    const handlePeriodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //setPeriode(value);
        if (value.length > PERIODE_LIMIT) {
            setPeriodeError("Vous avez atteint la limite maximale de caractères. (64 max)");
        } else {
            setPeriode(value);
            setPeriodeError("");
        }
    };

    const isFormValid = () => {
        return designation.length <= DESIGNATION_LIMIT && periode.length <= PERIODE_LIMIT && !designationError && !periodeError;
    };




    useEffect(() => {
        loadRubriqueQuestionDTOs();
        loadQuestions();
    }, []);


    const loadRubriqueQuestionDTOs = async () => {
        try {
            let response = await rubriqueQuestionService.getAll();
            // Simuler l'ajout du nombre de lignes pour chaque rubrique
            response = response.map(rubrique => ({
                ...rubrique,
                nombreLignes: rubrique.questions.length // Assumons que chaque rubrique a un tableau de questions
            }));
            response.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
            setRubriqueQuestionDTOOs(response);
        } catch (error) {
            console.error("Erreur lors du chargement des rubriques:", error);
        }
    };


    const handleDelete = (id: any) => {
        setRubriquesAjoutees(rubriquesAjoutees.filter(rubrique => rubrique.id !== id));
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

    /*const handleAjoutQuestion = (idRubrique: number, idQuestion: number) => {
        setRubriquesAjoutees(rubriquesAjoutees.map(rubrique => {
            if (rubrique.id === idRubrique) {
                const questionAjoutee = questions.find(question => question.id === idQuestion);
                if (questionAjoutee) {
                    return { ...rubrique, questions: [...rubrique.questions, questionAjoutee] };
                }
            }
            return rubrique;
        }));
    };*/

    /*const handleAjoutQuestion = () => {
        if (rubriqueSelectionneePourQuestions !== null && selectedQuestion) {
            setRubriquesAjoutees(rubriquesAjoutees.map(rubrique => {
                if (rubrique.id === rubriqueSelectionneePourQuestions) {
                    const questionAjoutee = questions.find(question => question.id.toString() === selectedQuestion);
                    if (questionAjoutee && !rubrique.questions.find(q => q.id === questionAjoutee.id)) {
                        return { ...rubrique, questions: [...rubrique.questions, questionAjoutee] };
                    }
                }
                return rubrique;
            }));
            setSelectedQuestion('');
        }
    };*/
    /*const handleAjoutQuestion = () => {
        if (rubriqueSelectionneePourQuestions !== null && selectedQuestion) {
            // Trouve la rubrique sélectionnée
            const updatedRubriques = rubriquesAjoutees.map(rubrique => {
                if (rubrique.id === rubriqueSelectionneePourQuestions) {
                    // Vérifie si la question sélectionnée est déjà ajoutée
                    const isQuestionAlreadyAdded = rubrique.questions.some(question => question.id.toString() === selectedQuestion);
                    if (!isQuestionAlreadyAdded) {
                        // Trouve la question dans la liste des questions disponibles
                        const questionToAdd = questions.find(question => question.id.toString() === selectedQuestion);
                        // Ajoute la question à la rubrique si elle est trouvée
                        if (questionToAdd) {
                            return {
                                ...rubrique,
                                questions: [...rubrique.questions, questionToAdd]
                            };
                        }
                    }
                }
                return rubrique;
            });

            setRubriquesAjoutees(updatedRubriques);
            // Réinitialise la sélection de question après l'ajout
            setSelectedQuestion('');
        }
    };*/
    const handleAjoutQuestion = () => {
        console.log("question selectionnée : ", selectedQuestion);

        if (rubriqueSelectionneePourQuestions !== null && selectedQuestion) {
            const questionToAdd = questions.find(question => question.id.toString() === selectedQuestion);
            if (questionToAdd) {
                setRubriquesAjoutees(prevRubriques => prevRubriques.map(rubrique => {
                    if (rubrique.id === rubriqueSelectionneePourQuestions && !rubrique.questions.find(q => q.id === questionToAdd.id)) {
                        return { ...rubrique, questions: [...rubrique.questions, questionToAdd] };
                    }
                    return rubrique;
                }));
                setSelectedQuestion(''); // Réinitialiser après l'ajout
                setButtonQuestionDisabled(true);
            }
        }
    };

    useEffect(() => {
        console.log("Nouvel état de rubriquesAjoutees:", rubriquesAjoutees);
    }, [rubriquesAjoutees]);


    const handleAjoutRubrique = () => {
        if (selectedRubrique) {
            const rubrique = rubriqueQuestionDTOOs.find(r => r.rubrique.designation === selectedRubrique);
            if (rubrique && !rubriquesAjoutees.some(r => r.id === rubrique.rubrique.id)) {
                setRubriquesAjoutees(prev => [
                    ...prev,
                    {
                        id: rubrique.rubrique.id,
                        designation: selectedRubrique,
                        questions: rubrique.questions
                    }
                ]);
            }
            setSelectedRubrique('');
            setButtonDisabled(true);
        }
    };





    const handleSupprimerQuestion = (idRubrique: number, idQuestion: any) => {
        setRubriquesAjoutees(rubriquesAjoutees.map(rubrique => {
            if (rubrique.id === idRubrique) {
                return { ...rubrique, questions: rubrique.questions.filter(question => question.id !== idQuestion) };
            }
            return rubrique;
        }));
    };


    /*const handleOnDragEnd = (result: any) => {
        if (!result.destination) return; // Si l'élément est déplacé en dehors de la liste, ne rien faire

        const items = Array.from(rubriquesAjoutees);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setRubriquesAjoutees(items); // Met à jour l'état avec le nouvel ordre
    };*/
    const handleOnDragEnd = (result: any) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;

        if (type === "rubriques") {
            // Réordonner les rubriques
            const items = Array.from(rubriquesAjoutees);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setRubriquesAjoutees(items);
        } else {
            // Réordonner les questions dans une rubrique
            const startRubriqueIndex = rubriquesAjoutees.findIndex(rubrique => `rubrique-${rubrique.id}` === source.droppableId);
            const finishRubriqueIndex = rubriquesAjoutees.findIndex(rubrique => `rubrique-${rubrique.id}` === destination.droppableId);

            if (startRubriqueIndex !== finishRubriqueIndex) {
                // Si vous voulez permettre le déplacement des questions entre rubriques, vous pouvez ajouter cette logique ici
                return;
            }

            const rubrique = rubriquesAjoutees[startRubriqueIndex];
            const newQuestionsArray = Array.from(rubrique.questions);
            const [reorderedQuestion] = newQuestionsArray.splice(source.index, 1);
            newQuestionsArray.splice(destination.index, 0, reorderedQuestion);

            const newRubriques = [...rubriquesAjoutees];
            newRubriques[startRubriqueIndex] = {
                ...rubrique,
                questions: newQuestionsArray
            };

            setRubriquesAjoutees(newRubriques);
        }
    };


    // État pour suivre la rubrique ouverte pour l'ajout de questions
    const [openRubriqueId, setOpenRubriqueId] = useState<number | null>(null);

    // Gérer le clic sur l'icône plus/moins
    const toggleRubriqueOpen = (id: number) => {
        if (openRubriqueId === id) {

            setOpenRubriqueId(null); // Fermer la rubrique actuellement ouverte
        } else {
            setRubriqueSelectionneePourQuestions(id);
            setOpenRubriqueId(id); // Ouvrir la rubrique cliquée
        }
    };



    // Exemple d'ID d'évaluation - Remplacez par la manière dont vous récupérez l'ID actuel
    const idEvaluation = initialData?.id; // Ou une autre source pour l'ID d'évaluation

    /*const prepareAndSendData = async () => {
        // Préparer l'objet à envoyer
        const rubriqueEvaluations = rubriquesAjoutees.map((rubrique, rubriqueIndex) => ({
            idEvaluation: idEvaluation,
            idRubrique: rubrique.id,
            ordre: rubriqueIndex + 1, // Exemple d'ordre basé sur l'index (ajustez selon vos besoins)
            questionEvaluations: rubrique.questions.map((question, questionIndex) => ({
                idQuestion: question.id,
                ordre: questionIndex + 1 // De même pour les questions
            }))
        }));

        // Objet final à envoyer
        const dataToSend = { rubriqueEvaluations };

        setPreparedData(dataToSend);

        // Ici, effectuez votre appel API pour envoyer 'dataToSend'
        // Exemple (ajustez selon votre API) :
        // await myApiService.updateEvaluationRubriques(dataToSend);

        console.log("Données à envoyer :", dataToSend);
        // Décommentez la ligne ci-dessous pour voir l'objet dans la console
        // console.log(JSON.stringify(dataToSend, null, 2));
    };*/
    const [preparedData, setPreparedData] = useState<{
        idEvaluation: any; // Utilisez un type plus spécifique si possible
        idRubrique: number;
        ordre: number;
        questionEvaluations: QuestionEvaluation[];
    }[]>([]);


    const prepareAndSendData = () => {
        const rubriqueEvaluations: RubriqueEvaluation[] = rubriquesAjoutees.map((rubrique, rubriqueIndex) => ({
            idEvaluation: idEvaluation,
            idRubrique: rubrique.id,
            ordre: rubriqueIndex + 1,
            questionEvaluations: rubrique.questions.map((question, questionIndex) => ({
                idQuestion: question.id,
                ordre: questionIndex + 1
            }))
        }));

        //const dataToSend: PreparedData = { rubriqueEvaluations };

        //setPreparedData(rubriqueEvaluations);

        const evaluationUpdateDTO = {
            id: null,
            noEnseignant: null,
            codeFormation: selectedCodeFormation,
            codeUE: selectedCodeUE,
            codeEC: selectedCodeEC,
            promotion: selectedPromotion,
            noEvaluation: initialData?.noEvaluation.toString(),
            designation: designation,
            etat: null,
            periode: periode,
            debutReponse: debutReponse,
            finReponse: finReponse,
            rubriques: rubriqueEvaluations

        };

        console.log("Evaluation Update DTO :", evaluationUpdateDTO);
        return evaluationUpdateDTO;


    };



    useEffect(() => {
        loadPromotions();
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            if (initialData) {
                console.log("initial data Rubriques: ", initialData.rubriques);
                // Pré-initialisation des états dépendants pour garantir leur mise à jour après chargement
                setSelectedPromotion(initialData.promotion);
                setSelectedCodeFormation(initialData.codeFormation);

                // Charge les formations puis les unités d'enseignement, et ensuite les éléments constitutifs
                await loadFormations(initialData.promotion);
                await loadUniteEnseignements(initialData.codeFormation);
                // Pas besoin de définir à nouveau ici, car vous attendez le chargement
                await loadElementConstitutifs(initialData.codeFormation, initialData.codeUE);

                // Met à jour les sélections après avoir chargé les données dépendantes
                setSelectedCodeUE(initialData.codeUE);
                setSelectedCodeEC(initialData.codeEC);

                // Définit les champs non dépendants
                setDesignation(initialData.designation);
                setPeriode(initialData.periode);
                setDebutReponse(initialData.debutReponse);
                setFinReponse(initialData.finReponse);

                /*setRubriquesAjoutees(initialData.rubriques.map((rubrique: any) => ({
                    id: rubrique.id,
                    designation: rubrique.designation,
                    questions: rubrique.questions // Supposons que chaque rubrique a un tableau de questions
                })));*/
                const rubriquesWithCorrectIDs = initialData.rubriques.map((rubrique: { idRubrique: any; designation: any; questions: any; }) => ({
                    id: rubrique.idRubrique, // Assurez-vous que cette propriété existe et est correcte
                    designation: rubrique.designation,
                    questions: rubrique.questions // Supposons que chaque rubrique a un tableau de questions
                }));
                setRubriquesAjoutees(rubriquesWithCorrectIDs);
            }
        };

        if (open) {
            initializeData();
        }
    }, [open, initialData, promotions]);


    const loadPromotions = async () => {
        const fetchedPromotions = await evaluationService.getPromotionsByEnseignant();
        setPromotions(fetchedPromotions);
    };

    const loadFormations = async (promotionCode: string) => {
        const fetchedFormations = await evaluationService.getPromotionsByEnseignantAndFormation(promotionCode);
        setFormations(fetchedFormations);
    };

    const loadUniteEnseignements = async (codeFormation: string) => {
        const fetchedUniteEnseignements = await evaluationService.getUniteEnseignementByCodeFormationAndNoEnseignant(codeFormation);
        setUniteEnseignements(fetchedUniteEnseignements);
    };

    const loadElementConstitutifs = async (codeFormation: string, codeUe: string) => {
        const fetchedElementConstitutifs = await evaluationService.getElementConstitutifByNoEnseignantAndCodeFormationAndCodeUe(codeFormation, codeUe);
        setElementConstitutifs(fetchedElementConstitutifs);
    };

    // Handlers for select change events
    const handlePromotionChange = async (value: string) => {
        setSelectedPromotion(value);
        await loadFormations(value);
    };

    const handleCodeFormationChange = async (value: string) => {
        setSelectedCodeFormation(value);
        await loadUniteEnseignements(value);
    };

    const handleCodeUEChange = async (value: string) => {
        setSelectedCodeUE(value);
        await loadElementConstitutifs(selectedCodeFormation, value);
    };

    const handleCodeECChange = (value: string) => {
        setSelectedCodeEC(value);
    };

    const [debutReponseError, setDebutReponseError] = useState('');
    const [finReponseError, setFinReponseError] = useState('');

    const validateDates = () => {
        const startDate = new Date(debutReponse);
        const endDate = new Date(finReponse);
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        let isValid = true;

        // Réinitialisez les messages d'erreur
        setDebutReponseError('');
        setFinReponseError('');

        // La date de début doit être antérieure à la date de fin
        if (startDate >= endDate) {
            setFinReponseError('La date de fin doit être postérieure à la date de début.');
            isValid = false;
        }

        // La date de début doit être supérieure ou égale à la date de la veille
        if (startDate <= yesterday) {
            setDebutReponseError('La date de début doit être future à la date de la veille.');
            isValid = false;
        }


        return isValid; // Retourne false si une erreur de validation est trouvée
    };



    const handleSubmit = async () => {
        const trimmedDesignation = designation.trim();
        const trimmedPeriode = periode.trim();

        if (!validateDates()) {
            return; // Arrêtez la soumission si la validation échoue
        }


        const dataToSend = prepareAndSendData();

        const newEvaluation = new Evaluation(
            null,
            null,
            selectedCodeFormation,
            selectedCodeUE,
            selectedCodeEC,
            selectedPromotion,
            null,
            trimmedDesignation,
            null,
            trimmedPeriode,
            debutReponse,
            finReponse,
            null
        );

        if (isUpdate) {
            //newEvaluation.noEvaluation = initialData?.noEvaluation;
            dataToSend.noEvaluation = initialData?.noEvaluation;
        }

        const evaluationService = new EvaluationService();

        const handleSuccess = () => {
            setDesignation("");
            setPeriode("");
            setDebutReponse("");
            setFinReponse("")
            setSelectedCodeEC("")
            setSelectedCodeFormation("");
            setSelectedCodeUE("");
            setSelectedPromotion("");
            //isUpdate = false;
            handleOpen();
            if(isUpdate){
                messageApi.open({
                    type: 'success',
                    content: `La modification de votre évaluation "${trimmedDesignation}"  est réalisée avec succès.`,
                    duration: 10,
                });
            }else {
                messageApi.open({
                    type: 'success',
                    content: `La création de votre évaluation "${trimmedDesignation}" est réalisée avec succès.`,
                    duration: 10,
                });
            }

        };

        const handleFailure = (error: any) => {
            handleOpen();
            isUpdate = false;
            messageApi.open({
                type: 'error',
                content: " Opération annulé, demande non valide ",
            });

        };

        if (isUpdate) {
            prepareAndSendData();
            evaluationService.updateEvaluation(dataToSend)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            evaluationService.addEvaluation(newEvaluation)
                .then(handleSuccess)
                .catch(handleFailure);
        }
    };

    const handleOpen = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        isUpdate = false;
        setOpen(false);
        setDesignation("");
        setPeriode("");
        setDebutReponse("");
        setFinReponse("")
        setSelectedCodeEC("")
        setSelectedCodeFormation("");
        setSelectedCodeUE("");
        setSelectedPromotion("");
    };


    const inlineErrorStyle = {
        color: '#d32f2f',
        fontSize: '0.875rem',
        marginTop: '4px',
        fontWeight: 'normal',
        fontStyle: 'italic',
    };

    const [buttonDisabled, setButtonDisabled] = useState(true); // État pour suivre si le bouton doit être désactivé
    const [buttonQuestionDisabled, setButtonQuestionDisabled] = useState(true); // État pour suivre si le bouton doit être désactivé

    const getColor = (numQuestions : any) => {
        return numQuestions > 0 ? 'green' : 'red';
    };





    return (
        <>
            {contextHolder}

            <Dialog
                size="lg"
                open={open}
                handler={handleClose}
                className="bg-transparent shadow-none"
                style={{ zIndex: 10 }} placeholder={undefined}    >
                <Card className="mx-auto w-full max-w-6xl" placeholder={undefined}> {/* Ajustement de la largeur pour un design plus créatif */}
                    <CardBody className="p-6" placeholder={undefined}>
                        <Typography variant="h5" color="blue-gray" className="mb-6" placeholder={undefined}>
                            {isUpdate ? "Modifier une Évaluation " : "Créer une Évaluation "}
                        </Typography>
                        {/* Réorganisation en deux colonnes avec flex */}
                        <div className="flex flex-wrap gap-8">
                            {/* Première colonne pour les inputs */}
                            <div className="flex flex-col flex-1 gap-4">
                                <div className="flex gap-4">

                                    <Input
                                        label="Désignation"
                                        value={designation}
                                        onChange={handleDesignationChange} crossOrigin={undefined}
                                        required={true}
                                    />
                                    {designationError && <p className="text-sm text-red-500">{designationError}</p>}

                                    <Input
                                        label="Période"
                                        value={periode}
                                        onChange={handlePeriodeChange} crossOrigin={undefined}
                                        required={true}
                                    />
                                    {periodeError && <p className="text-sm text-red-500">{periodeError}</p>}
                                </div>
                                <div className="flex flex-col flex-1 gap-4"></div>
                                <div className="flex gap-4">
                                    <Input
                                        type="date"
                                        label="Début de Réponse"
                                        value={debutReponse}
                                        onChange={(e) => setDebutReponse(e.target.value)} crossOrigin={undefined}
                                        required={true}
                                    />
                                    {debutReponseError && <div style={inlineErrorStyle}>{debutReponseError}</div>}
                                    <Input
                                        type="date"
                                        label="Fin de Réponse"
                                        value={finReponse}
                                        onChange={(e) => setFinReponse(e.target.value)} crossOrigin={undefined}
                                        required={true}
                                    />
                                    {finReponseError && <div style={inlineErrorStyle}>{finReponseError}</div>}
                                </div>
                            </div>

                            {/* Seconde colonne pour les sélecteurs */}
                            <div className="flex flex-col flex-1 gap-4">
                                <div className="flex gap-4">
                                    <Select
                                        label="Promotion*"
                                        value={selectedPromotion}
                                        placeholder={undefined}
                                        onChange={(value: any | undefined) => {
                                            if (value) {
                                                console.log("test id", value);
                                                handlePromotionChange(value)
                                            }
                                        }}
                                    >
                                        {promotions.map((promo) => (
                                            <Option key={promo.anneePro} value={promo.anneePro}>
                                                {promo.anneePro}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Select
                                        key={`formation-${formations.length}`}
                                        label="Formation*"
                                        value={selectedCodeFormation}
                                        onChange={(value: any | undefined) => {
                                            if (value) {
                                                handleCodeFormationChange(value)
                                            }
                                        }} placeholder={undefined}                                    >
                                        {formations.map((frm) => (
                                            <Option key={frm.codeFormation} value={frm.codeFormation}>
                                                {frm.codeFormation}
                                            </Option>
                                        ))}
                                    </Select>

                                    <Select
                                        key={`Unite Enseignements-${uniteEnseignements.length}`}
                                        label="Code UE*"
                                        value={selectedCodeUE}
                                        onChange={(value: any | undefined) => {
                                            if (value) {
                                                handleCodeUEChange(value)
                                            }
                                        }}
                                        placeholder={undefined}                            >
                                        {uniteEnseignements.map((ue) => (
                                            <Option key={ue.codeUe} value={ue.codeUe}>
                                                {ue.codeUe}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Select
                                        key={`Elements Constitutifs-${elementConstitutifs.length}`}
                                        label="Code EC"
                                        value={selectedCodeEC}
                                        onChange={(value: any | undefined) => {
                                            if (value) {
                                                handleCodeECChange(value)
                                            }
                                        }}
                                        placeholder={undefined}                            >
                                        {elementConstitutifs.map((ec) => (
                                            <Option key={ec.codeEc} value={ec.codeEc}>
                                                {ec.codeEc}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            {isUpdate && (<div className="flex flex-col flex-1 gap-4">
                                {/* Section pour la sélection et l'ajout de rubriques */}
                                <div>
                                    <Typography variant="h6" className="mb-4 text-blue-gray" placeholder={undefined}>
                                        Rubriques Standards
                                    </Typography>
                                    <div className="flex gap-4 items-center">
                                        <Select
                                            label="Rubrique"
                                            value={selectedRubrique}
                                            onChange={(value) => {
                                                if (value) {
                                                    setSelectedRubrique(value);
                                                    setButtonDisabled(!value);
                                                }
                                            }} placeholder={undefined}                                        >
                                            {rubriqueQuestionDTOOs.map((rubrique) => (
                                                <Option key={rubrique.rubrique.id} value={rubrique.rubrique.designation}>
                                                    {`${rubrique.rubrique.designation} `}
                                                    <span style={{ color: getColor(rubrique.questions.length) }}>
                                                        ({rubrique.questions.length})
                                                    </span>
                                                </Option>
                                            ))}
                                        </Select>

                                        <Button
                                            variant="gradient"
                                            color="green"
                                            onClick={handleAjoutRubrique}
                                            disabled={buttonDisabled} placeholder={undefined}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </Button>

                                    </div>
                                </div>

                                {/* Affichage des rubriques ajoutées */}
                                <div style={{ maxHeight: '500px', overflowY: 'scroll' as 'scroll' }}>
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        <Droppable droppableId="rubriques" type="rubriques">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {rubriquesAjoutees.map((rubrique, index) => (
                                                        <Draggable key={rubrique.id} draggableId={`rubrique-${rubrique.id}`} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="flex flex-col mb-4 p-2 bg-gray-100 rounded-lg" // Votre classe de style pour chaque rubrique
                                                                >
                                                                    <div key={rubrique.id} className="flex flex-col mb-4 p-2 bg-gray-100 rounded-lg">
                                                                        <div className="flex justify-between items-center">
                                                                            <Typography style={{ fontSize: '0.875rem', fontWeight: 'normal' }} className="flex-1" placeholder={undefined}>
                                                                                {rubrique.designation}
                                                                            </Typography>
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={() => toggleRubriqueOpen(rubrique.id)}
                                                                                    className="transition-colors duration-200 hover:text-blue-500 focus:outline-none"
                                                                                >
                                                                                    {openRubriqueId === rubrique.id ? (
                                                                                        // Icône pour fermer (moins)
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
                                                                                        </svg>
                                                                                    ) : (
                                                                                        // Icône pour ouvrir (plus)
                                                                                        <FontAwesomeIcon
                                                                                            icon={faChevronDown} />
                                                                                    )}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDelete(rubrique.id)}
                                                                                    className="transition-colors duration-200 hover:text-red-500 focus:outline-none"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {openRubriqueId === rubrique.id && rubriqueSelectionneePourQuestions === rubrique.id && (
                                                                            <div className="flex flex-col mt-2">
                                                                                <div className="flex gap-2 items-center">
                                                                                    <Select
                                                                                        label="Question"
                                                                                        placeholder="Sélectionner une question"
                                                                                        value={selectedQuestion}
                                                                                        onChange={(value) => {
                                                                                            if (value) {
                                                                                                setSelectedQuestion(value.toString());
                                                                                                setButtonQuestionDisabled(!value);

                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {questions.map((question) => (
                                                                                            <Option key={question.id.toString()} value={question.id.toString()}>
                                                                                                {question.intitule}
                                                                                            </Option>
                                                                                        ))}
                                                                                    </Select>
                                                                                    <Button
                                                                                        variant="gradient"
                                                                                        color="green"
                                                                                        onClick={handleAjoutQuestion}
                                                                                        disabled={buttonQuestionDisabled} placeholder={undefined}                                                        >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                                                                                        </svg>
                                                                                    </Button>
                                                                                </div>
                                                                                {/* Section for displaying added questions beneath the question selection */}
                                                                                <div className="mt-2">
                                                                                    <Droppable droppableId={`rubrique-${rubrique.id}`} type="questions">
                                                                                        {(provided) => (
                                                                                            <div ref={provided.innerRef} {...provided.droppableProps}>

                                                                                                {rubriqueSelectionneePourQuestions !== null && rubriquesAjoutees.find(rubrique => rubrique.id === rubriqueSelectionneePourQuestions)?.questions.map((question, qIndex) => (
                                                                                                    <Draggable key={question.id} draggableId={`question-${rubrique.id}-${question.id}`} index={qIndex}>
                                                                                                        {(provided) => (
                                                                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                                                <div key={question.id} className="flex justify-between items-center mt-2 bg-gray-50 p-2 rounded-lg">
                                                                                                                    <Typography style={{ fontSize: '0.875rem', fontWeight: 'normal' }} className="flex-1" placeholder={undefined}>
                                                                                                                        {question.intitule}
                                                                                                                    </Typography>
                                                                                                                    <button onClick={() => handleSupprimerQuestion(rubriqueSelectionneePourQuestions, question.id)} className="transition-colors duration-200 hover:text-red-500 focus:outline-none">
                                                                                                                        {/* Icon for question deletion */}
                                                                                                                        <svg
                                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                                            fill="none"
                                                                                                                            viewBox="0 0 24 24"
                                                                                                                            stroke-width="2"
                                                                                                                            stroke="red"
                                                                                                                            className="w-5 h-5">
                                                                                                                            <path
                                                                                                                                stroke-linecap="round"
                                                                                                                                stroke-linejoin="round"
                                                                                                                                d="M6 18L18 6M6 6l12 12"></path>
                                                                                                                        </svg>
                                                                                                                    </button>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        )}
                                                                                                    </Draggable>


                                                                                                ))}
                                                                                                {provided.placeholder}



                                                                                            </div>
                                                                                        )}
                                                                                    </Droppable>

                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>




                                </div>
                            </div>)}


                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-end gap-4" placeholder={undefined}>
                        <Button variant="gradient" color="red" onClick={handleClose} placeholder={undefined}>
                            <FontAwesomeIcon icon={faX} className="mr-1" />

                            Annuler
                        </Button>
                        <Button
                            variant="gradient"
                            color="green"
                            onClick={handleSubmit}
                            disabled={ !selectedCodeUE || !selectedCodeFormation || !selectedPromotion || !designation || !periode || !debutReponse || !finReponse}
                            className="flex items-center justify-center gap-2" // Ajoutez cette ligne pour aligner l'icône et le texte
                            placeholder={undefined}                        >

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            {isUpdate ? " Modifier" : " Créer"}
                        </Button>

                    </CardFooter>
                </Card>
            </Dialog>
        </>

    )

}