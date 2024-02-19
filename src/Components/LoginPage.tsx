import React from "react";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {hideLoading, showLoading} from "../redux/alertsSlice";
import { useAuth } from "../routes/AuthProvider";
export const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const onFiinish = function (values:any) {
        try {
            dispatch(showLoading());

            const sanitizedValues = {
                loginConnection: values.loginConnection,
                motpasse: values.motpasse,
                // ... autres propriétés nécessaires
            };


            console.log(sanitizedValues);
            axios.post("http://localhost:8085/api/v1/user/login", sanitizedValues)
                .then(function (response) {
                    console.log("dans la fonction");

                    // dispatch(hideLoading());

                    if (response.data.token) {
                        console.log("reussi");
                        toast.success("Login Successfully");
                        localStorage.setItem("token", response.data.token);
                        loginUser(); // Appel de la fonction loginUser pour mettre à jour l'état d'authentification
                        navigate("/evae/home");
                    } else {
                        console.log("non reussi");
                        toast.error("User Not Found !");
                    }
                })
                .catch(function (error) {
                    console.log("Axios error:", error);

                    // Use a fallback for the error message to avoid circular references
                    const errorMessage = error.message || "Something went wrong";

                    dispatch(hideLoading());
                    toast.error(errorMessage);
                });
        } catch (error:any) {
            console.log("Catch block error:", error);

            // Use a fallback for the error message to avoid circular references
            const errorMessage = error.message || "Something went wrong";

            dispatch(hideLoading());
            toast.error(errorMessage);
        }
    };
    const handleSubmit = (event:any) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const values = Object.fromEntries(formData.entries());

        onFiinish(values);
    };



    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Connectez-vous à votre compte
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} method="POST" >
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        E-mail
                                    </label>
                                    <input
                                        type="text"
                                        name="loginConnection"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="motpasse"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required={true}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                required={false}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label
                                                htmlFor="remember"
                                                className="text-gray-500 dark:text-gray-300"
                                            >
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                    </div>
                                    <Link
                                        to="#"
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700 mx-auto"
                                >
                                    Se connecter
                                </button>



                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;