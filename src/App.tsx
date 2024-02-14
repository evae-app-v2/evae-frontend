import React from 'react';
import './App.css';
import Layout from "./Components/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importer BrowserRouter

import { AuthProvider } from "./routes/AuthProvider";
import { LoginPage } from "./Components/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter> {/* Ajouter BrowserRouter ici */}
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/evae/login" element={<LoginPage />} />

                    {/* Private route using ProtectedRoute component */}
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="/evae/account" element={<Layout />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
);
}

export default App;
