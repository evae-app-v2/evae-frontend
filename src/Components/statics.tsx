import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface InsightsResponse {
    nbrQualificatifs: number;
    nbrQuestions: number;
    nbrRubriques: number;
    nbrRubriquesComposes: number;
}

export function Statics() {

    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const { user } = useSelector((state:any) => state.user);


    const fetchInsights = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/home", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setInsights(response.data);

        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        // Fetch user details only if the user is authenticated
        fetchInsights();

    }, [user]);

    return(
        <>
            <div className="flex flex-wrap my-5 -mx-2">
                <div className="w-full md:w-1/4 lg:w-1/4 p-2">
                    <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
                        <div
                            className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                            <div className="text-xs whitespace-nowrap">
                                Total Qualificatifs
                            </div>
                            <div className="">
                                {insights ? insights.nbrQualificatifs : "0"}
                            </div>
                        </div>
                        <div className=" flex items-center flex-none text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>

                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/4 lg:w-1/4 p-2 ">
                    <div
                        className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
                        <div
                            className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                            <div className="text-xs whitespace-nowrap">
                                Total Questions
                            </div>
                            <div className="">
                                {insights ? insights.nbrQuestions : "0"}
                            </div>
                        </div>
                        <div className=" flex items-center flex-none text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>

                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/4 lg:w-1/4 p-2">
                    <div
                        className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
                        <div
                            className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                            <div className="text-xs whitespace-nowrap">
                                Total Rubriques
                            </div>
                            <div className="">
                                {insights ? insights.nbrRubriques : "0"}
                            </div>
                        </div>
                        <div className=" flex items-center flex-none text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>

                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/4 lg:w-1/4 p-2">
                    <div
                        className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
                        <div
                            className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor"
                                 className="object-scale-down transition duration-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                            <div className="text-xs whitespace-nowrap">
                                Total Rubriques Composées
                            </div>
                            <div className="">
                                {insights ? insights.nbrRubriquesComposes : "0"}
                            </div>
                        </div>
                        <div className=" flex items-center flex-none text-white">

                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}