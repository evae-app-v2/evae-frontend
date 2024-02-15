import React from 'react';
import './App.css';
import Layout from "./Components/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importer BrowserRouter

import { AuthProvider } from "./routes/AuthProvider";
import { LoginPage } from "./Components/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RubriquesListe from "./Components/rubrique-standars/RubriquesListe";
import {EmptyCompoenent} from "./Components/EmptyCompoenent";

function App() {
    return (
        <BrowserRouter> {/* Ajouter BrowserRouter ici */}
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/evae/login" element={<LoginPage />} />

                    {/* Private route using ProtectedRoute component */}
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="/evae/home" element={<Layout><EmptyCompoenent/></Layout>}/>
                        <Route path="/evae/rubrique-standars" element={<Layout><RubriquesListe/></Layout>}/>
                        <Route path="/evae/test" element={<Layout><LoginPage/></Layout>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
);
}

export default App;
