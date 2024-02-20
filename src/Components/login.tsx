import React, { useState } from 'react';

const Login = () => {
    // Définir les états locaux pour stocker les valeurs des champs d'entrée
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Gérer la soumission du formulaire
    const handleSubmit = (event:any) => {
        event.preventDefault();
        // Appeler la méthode de connexion avec les valeurs des champs d'entrée
        login(email, password);
    };

    // Fonction pour se connecter avec les informations fournies
    const login = (email:any, password:any) => {
        // Insérer ici la logique de connexion, par exemple, envoi des données au serveur
        console.log('Connexion avec :', email, password);
        // Réinitialiser les champs d'entrée après la connexion
        setEmail('');
        setPassword('');
    };

    return (
        <div className="h-screen font-sans login bg-cover" style={{backgroundImage: "url('http://bit.ly/2gPLxZ4')"}}>
            <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                <div className="w-full max-w-lg">
                    <div className="leading-loose">
                        <form className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl" onSubmit={handleSubmit}>
                            <p className="text-white font-medium text-center text-lg font-bold">LOGIN</p>
                            <div className="">
                                <label className="block text-sm text-white" htmlFor="email">E-mail</label>
                                <input
                                    className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                    type="email"
                                    id="email"
                                    placeholder="example@gmail.com"
                                    aria-label="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Mettre à jour l'état local pour l'email
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm text-white" htmlFor="password">Mot de passe</label>
                                <input
                                    className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                    type="password"
                                    id="password"
                                    placeholder="XXXXX"
                                    aria-label="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} // Mettre à jour l'état local pour le mot de passe
                                />
                            </div>

                            <div className="mt-4 items-center flex justify-between">
                                <button
                                    className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                                    type="submit"
                                >
                                    Se connecter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
