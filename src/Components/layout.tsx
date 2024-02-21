import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {hideLoading} from "../redux/alertsSlice";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faHouse, faNoteSticky, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {faSquarespace} from "@fortawesome/free-brands-svg-icons";
import AlertComp from "../utils/alert";
import {Link, useNavigate} from "react-router-dom";
import {Footer} from "./footer";
import logo from "../assets/output-onlinepngtools.png";
import userIcon from "../assets/userIcon.png";
import {useAuth} from "../routes/AuthProvider";

const adminMenu = [
    {
        name: "Acceuil",
        path: "/evae/home",
        icon: faHouse
    },
    {
        name: "Couple qualificatif",
        path: "/evae/couple-qualificatif",
        icon: faSquarespace
    },
    {
        name: "Question Standard",
        path: "/evae/question-standars",
        icon: faQuestion
    },
    {
        name: "Rubrique Standard",
        path: "/evae/rubrique-standars",
        icon: faBars
    },
    {
        name: "Rubrique Composée",
        path: "/evae/rubrique-question",
        icon: faSquarespace
    }
];
const enseignantMenu = [
    {
        name: "Dashboard",
        path: "/evae/home",
        icon: faHouse
    },{
        name: "Evaluation",
        path: "/evae/evaluations",
        icon: faNoteSticky
    }
];
interface LayoutProps {
    children: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [menuName, setMenuName] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const dispatch = useDispatch(); // Initialize the dispatch function
    const [username, SetUsername] = useState("");
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const setDark = (val: string) => {
        const moon = document.querySelector(".moon") as HTMLElement;
        const sun = document.querySelector(".sun") as HTMLElement;
        if (val === "dark") {
            document.documentElement.classList.add('dark');
            moon.classList.add("hidden");
            sun.classList.remove("hidden");
        } else {
            document.documentElement.classList.remove('dark');
            sun.classList.add("hidden");
            moon.classList.remove("hidden");
        }
    };
    const openNav = () => {
        const sidebar = document.querySelector("aside") as HTMLElement;
        const maxSidebar = document.querySelector(".max") as HTMLElement;
        const miniSidebar = document.querySelector(".mini") as HTMLElement;
        const maxToolbar = document.querySelector(".max-toolbar") as HTMLElement;
        const logo = document.querySelector('.logo') as HTMLElement;
        const content = document.querySelector('.content') as HTMLElement;

        if (sidebar.classList.contains('-translate-x-48')) {
            // max sidebar
            sidebar.classList.remove("-translate-x-48");
            sidebar.classList.add("translate-x-none");
            maxSidebar.classList.remove("hidden");
            maxSidebar.classList.add("flex");
            miniSidebar.classList.remove("flex");
            miniSidebar.classList.add("hidden");
            maxToolbar.classList.add("translate-x-0");
            maxToolbar.classList.remove("translate-x-24", "scale-x-0");
            logo.classList.remove("ml-12");
            content.classList.remove("ml-12");
            content.classList.add("ml-12", "md:ml-60");
        } else {
            // mini sidebar
            sidebar.classList.add("-translate-x-48");
            sidebar.classList.remove("translate-x-none");
            maxSidebar.classList.add("hidden");
            maxSidebar.classList.remove("flex");
            miniSidebar.classList.add("flex");
            miniSidebar.classList.remove("hidden");
            maxToolbar.classList.add("translate-x-24", "scale-x-0");
            maxToolbar.classList.remove("translate-x-0");
            logo.classList.add('ml-12');
            content.classList.remove("ml-12", "md:ml-60");
            content.classList.add("ml-12");
        }
    };
    const { user } = useSelector((state:any) => state.user);
    const [role, setRole] = useState<string | null>(null); // State to hold the user role

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/user/get-user-by-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            // Update the role state with the fetched role
            setRole(response.data.role);
            const nomComplet = response.data.noEnseignant.nom +' '+ response.data.noEnseignant.prenom;
            console.log(response.data.loginConnection)
            role === "ADM" ? SetUsername(response.data.loginConnection) : SetUsername(nomComplet);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        // Fetch user details only if the user is authenticated
        fetchUserDetails();

    }, [user,username]);

    console.log("role = ",role);
     //const menuToBeRendered = enseignantMenu;

    const menuToBeRendered = role === "ADM" ? adminMenu : role === "ENS" ? enseignantMenu : [];

    // const roleUser = user?.role === "ADM" ? "ADMIN" : user?.role === "ENS" ? "ENSEIGNANT" : null;
    const handleClick = (menu: any) => {
        setMenuName(menu.name);
        navigate(menu.path);

        // Vous pouvez maintenant utiliser le nom du menu cliqué comme vous le souhaitez
    };
    const handleLogout = () => {
        // Perform logout logic, clear local storage, or revoke the authentication token
        localStorage.removeItem("token");
        dispatch(hideLoading());
        logoutUser();
        navigate("/evae/login"); // Redirect to the login page after logout
    };

    // @ts-ignore
    return (


        <div className="body bg-white dark:bg-[#0F172A]" style={{ width: '100%', height: '100vh' ,zIndex:3}}>
            <div
                className="fixed w-full z-30 flex bg-white dark:bg-[#0F172A] p-2 items-center justify-center h-16 px-10">
                <div
                    className="logo ml-12 dark:text-white  transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
                    Evae-app

                </div>
                <div className="grow h-full flex items-center justify-center">
                        <img src={logo} alt="UBO Logo" className="w-20 sm:h-10 inline-flex mt-3"/>
                </div>

                <div className="flex-none h-full text-center flex items-center justify-center">

                    <div className="flex space-x-3 items-center px-3">
                        <div className="flex-none flex justify-center">
                            <div className="w-8 h-8 flex ">
                                <img
                                    src={userIcon}
                                    alt="profile" className="shadow rounded-full object-cover"/>
                            </div>
                        </div>

                        <div className="hidden md:block text-sm md:text-md text-black dark:text-white">{username}
                        </div>
                    </div>

                </div>
            </div>
            <aside
                className="w-60 -translate-x-48 fixed transition transform ease-in-out duration-1000 z-50 flex h-screen bg-[#1E293B] ">
                <div
                    className="max-toolbar translate-x-24 scale-x-0 w-full -right-6 transition transform ease-in duration-300 flex items-center justify-between border-4 border-white dark:border-[#0F172A] bg-[#1E293B]  absolute top-2 rounded-full h-12">

                    <div
                        className="flex items-center space-x-3 group bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-purple-500  pl-10 pr-2 py-1 rounded-full text-white  ">
                        <div className="transform ease-in-out duration-300 mr-12">
                            Evae-app
                        </div>
                    </div>
                </div>

                <div onClick={() => openNav()}
                     className="-right-6 transition transform ease-in-out duration-500 flex border-4 border-white dark:border-[#0F172A] bg-[#1E293B] dark:hover:bg-blue-500 hover:bg-purple-500 absolute top-2 p-3 rounded-full text-white hover:rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3}
                         stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
                    </svg>
                </div>
                {/* CONTENT Menu */}
                <div className="max hidden text-white mt-20 flex-col space-y-2 w-full h-[calc(100vh)]">
                    {menuToBeRendered.map((menu, index) => (
                        <div key={index}
                             onClick={() => handleClick(menu)}
                             className="hover:ml-4 w-full text-white hover:text-purple-500 dark:hover:text-blue-500 bg-[#1E293B] p-2 pl-8 rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3">
                            {/* <FontAwesomeIcon icon={menu.icon} style={{color: "#f6f5f4"}}/> */}
                            <div>
                                {menu.name}
                            </div>
                        </div>
                    ))}
                    <div className="hover:ml-4 w-full text-white hover:text-purple-500 dark:hover:text-blue-500 bg-[#1E293B] p-2 pl-8 rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3">
                        <button className="flex items-center space-x-2" onClick={handleLogout}>
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span>Se déconnecter</span>
                        </button>
                    </div>
                </div>


                <div className="mini mt-20 flex flex-col space-y-2 w-full h-[calc(100vh)]">
                    {menuToBeRendered.map((menu, index) => (
                        <div key={index}
                             onClick={() => handleClick(menu)}
                             className="hover:ml-4 justify-end pr-5 text-white hover:text-purple-500 dark:hover:text-blue-500 w-full bg-[#1E293B] p-3 rounded-full transform ease-in-out duration-300 flex">
                            <FontAwesomeIcon icon={menu.icon} style={{color: "#f6f5f4"}}/>
                        </div>
                    ))}
                </div>

            </aside>

            {/* CONTENT */}
            <div className="content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4 ">
                <nav className="flex px-5 py-3 text-gray-700  rounded-lg bg-gray-50 dark:bg-[#1E293B] "
                     aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/evae/home"
                                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <a href="#"
                                   className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white">{menuName}</a>
                            </div>
                        </li>
                    </ol>
                </nav>
                {/*
                <div style={{ width: '100%' }} className="h-auto">
*/}
                <div className="flex flex-col h-screen justify-between">
                    <div className="mt-negative-3">
                        {children}
                    </div>
                    <div className="fixed inset-x-0 bottom-0">
                        <Footer/>
                    </div>
                </div>

                {/*
                    showSpinner && <Spinner timeout={3000} />*/
                }
                {showSpinner && (
                    <div style={{
                        position: 'fixed',
                        top: '9%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999
                    }}>
                        <AlertComp style={"red"} message={"test"} timeout={3000}/>
                    </div>
                )}


            </div>
        </div>);

}

export default Layout;