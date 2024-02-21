import React from 'react';
import './App.css';
import Layout from "./Components/layout";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AuthProvider, useAuth} from "./routes/AuthProvider"; // Importez AuthProvider et useAuth ici
import ProtectedRoute from "./routes/ProtectedRoute";
import RubriquesListe from "./Components/rubriqueSTD/RubriquesListe";
import {EmptyCompoenent} from "./Components/EmptyCompoenent";
import QualificatifList from "./Components/qualificatif/qualificatifList";
import QuestionSTDList from "./Components/questionSTD/questionSTDList";
import {LoginPage} from "./Components/LoginPage";
import EvaluationsList from "./Components/evaluation/evaluationsList";
import { RubriqueQuestion } from './Components/rubriqueComposee/RubriqueQuestion';
function App() {
    return (
        <BrowserRouter>
            <AuthProvider> {/* Placez AuthProvider au-dessus de votre application */}
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

function AppContent() {
    const { isAuthenticated } = useAuth(); // Utilisez useAuth à l'intérieur de AppContent
    // Création des questions avec des qualificatifs
    // Création des questions avec des qualificatifs
    const question1 = new Question("type1", new Qualificatif("max1", "min1"), "Intitulé de la question 1");
    const question2 = new Question("type2", new Qualificatif("max2", "min2"), "Intitulé de la question 2");
    const question3 = new Question("type3", new Qualificatif("max3", "min3"), "Intitulé de la question 3");

// Création d'une rubrique composée avec des questions
    const rubrique1 = new RubriqueComposee(1, "typeRubrique1", "Designation Rubrique 1", 1, [question1, question2]);
    const rubrique2 = new RubriqueComposee(2, "typeRubrique2", "Designation Rubrique 2", 2, [question3]);

// Création d'une instance de la classe Enseignant
    const enseignant = new Enseignant(1, "email@example.com", "Nom", "Prénom");

// Création de l'objet Evaluation
    const evaluation = new Evaluation(
        1, // id
        enseignant, // noEnseignant
        "codeFormation",
        "codeUE",
        "codeEC",
        "promotion",
        1, // noEvaluation
        "Designation Evaluation",
        "etat",
        "periode",
        "debutReponse",
        "finReponse",
        [rubrique1, rubrique2] // rubriques
    );
    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/evae/home" /> : <Navigate to="/evae/login" />} />
            {/* Public routes */}
            <Route path="/evae/login" element={<LoginPage />} />

            {/* Private route using ProtectedRoute component */}
            <Route path="/" element={<ProtectedRoute />}>
                <Route path="/evae/home" element={<Layout><EmptyCompoenent/></Layout>}/>
                <Route path="/evae/rubrique-standars" element={<Layout><RubriquesListe/></Layout>}/>
                <Route path="/evae/test" element={<Layout><LoginPage/></Layout>}/>
                <Route path="/evae/couple-qualificatif" element={<Layout><QualificatifList/></Layout>}/>
                <Route path="/evae/question-standars" element={<Layout><QuestionSTDList/></Layout>}/>
                <Route path="/evae/evaluations" element={<Layout><EvaluationsList/></Layout>}/>
                <Route path="/evae/rubrique-question" element={<Layout><RubriqueQuestion/></Layout>}/>

            </Route>
        </Routes>
    );
}

export default App;
