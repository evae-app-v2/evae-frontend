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
import { faX } from "@fortawesome/free-solid-svg-icons";

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


    /*useEffect(() => {
        console.log("initialData: ",initialData?.codeFormation);
        if (initialData) {
            console.log(" initialisation ")
            setDesignation(initialData.designation);
            setPeriode(initialData.periode);
            setDebutReponse(initialData.debutReponse);
            setFinReponse(initialData.finReponse)
            setSelectedPromotion(initialData.promotion);
            setSelectedCodeFormation(initialData.codeFormation);
            setSelectedCodeUE(initialData.codeUE);
            setSelectedCodeEC(initialData.codeEC)
        }
    }, [initialData]);
    

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        const promotions = await evaluationService.getPromotionsByEnseignant();
        console.log("promotions : ", promotions);
        setPromotions(promotions);
    };

    const loadFormations = async (anneePro: string) => {
        const formations = await evaluationService.getPromotionsByEnseignantAndFormation(anneePro);
        console.log("formations : ", formations);
        setFormations(formations);
    };
    const loadFormations = async (anneePro: string) => {
        try {
            const formations = await evaluationService.getPromotionsByEnseignantAndFormation(anneePro);
            console.log("formations : ", formations);
            setFormations(formations);
        } catch (error) {
            console.error("Failed to load formations:", error);
        }
    };

    const loadUniteEnseignements = async (codeFormation: string) => {
        const uniteEnseignements = await evaluationService.getUniteEnseignementByCodeFormationAndNoEnseignant(codeFormation);
        setUniteEnseignements(uniteEnseignements);
    };

    const loadElementConstitutifs = async (codeFormation: string, codeUe: string) => {
        const elementConstitutifs = await evaluationService.getElementConstitutifByNoEnseignantAndCodeFormationAndCodeUe(codeFormation, codeUe);
        setElementConstitutifs(elementConstitutifs);
    };

    const handlePromotionChange = (e: any) => {
        const anneePro = e;
        setSelectedPromotion(anneePro);
        console.log("Selected Year:", anneePro);
        const selectedPromo = promotions.find(p => p.anneePro === anneePro);
        loadFormations(anneePro);
       
    };

    const handleCodeFormationChange = (e: any) => {
        const codeFormation = e;
        setSelectedCodeFormation(codeFormation);
        loadUniteEnseignements(codeFormation);
    };

    const handleCodeUEChange = (e: any) => {
        const codeUE = e;
        setSelectedCodeUE(codeUE);
        if (selectedCodeFormation) {
            loadElementConstitutifs(selectedCodeFormation, codeUE);
        }
    };

    const handleCodeECChange = (e: any) => {
        setSelectedCodeEC(e);
    };*/

    useEffect(() => {
        loadPromotions();
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            if (initialData) {
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

    const handleSubmit = async () => {

        /*messageApi.open({
            type: 'success',
            content: 'Évaluation créée avec succès',
        });*/

        const newEvaluation = new Evaluation(
            null,
            null,
            selectedCodeFormation,
            selectedCodeUE,
            selectedCodeEC,
            selectedPromotion,
            null,
            designation,
            null,
            periode,
            debutReponse,
            finReponse,
            null
        );

        if (isUpdate) {
            newEvaluation.noEvaluation = initialData?.noEvaluation;
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
            isUpdate = false;
            handleOpen();
            messageApi.open({
                type: 'success',
                content: 'Evaluation ajoutée avec succès ',
            });
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
            evaluationService.updateEvaluation(newEvaluation)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            evaluationService.addEvaluation(newEvaluation)
                .then(handleSuccess)
                .catch(handleFailure);
        }
    };
    console.log("is Update :", isUpdate);

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
                                        onChange={(e) => setDesignation(e.target.value)} crossOrigin={undefined}
                                        required={true}
                                    />

                                    <Input
                                        label="Période"
                                        value={periode}
                                        onChange={(e) => setPeriode(e.target.value)} crossOrigin={undefined}
                                        required={true}
                                    />
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
                                    <Input
                                        type="date"
                                        label="Fin de Réponse"
                                        value={finReponse}
                                        onChange={(e) => setFinReponse(e.target.value)} crossOrigin={undefined}
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* Seconde colonne pour les sélecteurs */}
                            <div className="flex flex-col flex-1 gap-4">
                                <div className="flex gap-4">
                                    <Select
                                        label="Promotion"
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
                                        label="Formation"
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
                                        label="Code UE"
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
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-end gap-4" placeholder={undefined}>
                        <Button variant="gradient" color="green" onClick={handleSubmit} placeholder={undefined}
                            disabled={!selectedCodeUE || !selectedCodeFormation || !selectedPromotion || !designation || !periode || !debutReponse || !finReponse}
                        >
                            {isUpdate ? "Modifier" : "Créer"}
                        </Button>
                        <Button variant="gradient" color="red" onClick={handleClose} placeholder={undefined}>
                            <FontAwesomeIcon icon={faX} className="mr-1" />

                            Annuler
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>

    )

}
