import React from 'react';
import './App.css';
import Layout from "./Components/layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./routes/AuthProvider"; // Importez AuthProvider et useAuth ici
import { LoginPage } from "./Components/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RubriquesListe from "./Components/rubriqueSTD/RubriquesListe";
import { EmptyCompoenent } from "./Components/EmptyCompoenent";
import QualificatifList from "./Components/qualificatif/qualificatifList";
import QuestionSTDList from "./Components/questionSTD/questionSTDList";
import { RubriqueQuestion } from './Components/RubriqueQuestion';

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
                <Route path="/evae/rubrique-question" element={<Layout><QuestionSTDList/></Layout>}/>
            </Route>
        </Routes>
    );
}

export default App;
