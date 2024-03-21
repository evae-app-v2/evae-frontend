import React, { useEffect } from 'react';
import uboPic from "../assets/logo_UBO_white.png";
import backgroundPic from "../assets/UBO_Brest.jpg";

export function EmptyCompoenent() {
    useEffect(() => {
        // Vérifier si le rafraîchissement a déjà été effectué
        if (localStorage.getItem("refreshed") !== "true") {
            // Marquer que le rafraîchissement va être effectué pour éviter une boucle infinie
            localStorage.setItem("refreshed", "true");
            // Rafraîchir la page
            window.location.reload();
        } else {
            // Après le rafraîchissement, réinitialiser pour permettre un futur rafraîchissement si nécessaire
            localStorage.removeItem("refreshed");
        }
    }, []);

    return (
        <>
            <div className="w-full">
                <div className="flex bg-white" style={{height: '85vh'}}>
                    <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">Transformez vos idées en <span className="text-indigo-600">Évaluations</span> concrètes</h2>
                            <p className="mt-2 text-sm text-gray-500 md:text-base">Notre plateforme vous permet de créer facilement des évaluations pour que les étudiants puissent donner leurs avis sur les cours des enseignants. Avec des fonctionnalités intuitives et
                                des outils puissants, vous pouvez concevoir des évaluations personnalisées qui répondent aux besoins de votre établissement. Commencez dès maintenant à collecter des retours précieux et à améliorer l'expérience d'apprentissage pour tous.</p>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:w-1/2"
                         style={{clipPath: 'polygon(10% 0, 100% 0%, 100% 100%, 0 100%)'}}>
                        <div className="h-full object-cover"
                             style={{backgroundImage: `url(${backgroundPic})`}}>
                            <div className="h-full bg-black opacity-25"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}