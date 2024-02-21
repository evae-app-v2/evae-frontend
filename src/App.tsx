import React, {useEffect} from 'react';
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
  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated]);

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
                <Route path="/evae/rubrique-composee" element={<Layout><RubriqueQuestion/></Layout>}/>
                <Route path="/evae/question-standars" element={<Layout><QuestionSTDList/></Layout>}/>
                <Route path="/evae/evaluations" element={<Layout><EvaluationsList/></Layout>}/>
                <Route path="/evae/rubrique-question" element={<Layout><RubriqueQuestion/></Layout>}/>

            </Route>
        </Routes>
    );
}

export default App;
