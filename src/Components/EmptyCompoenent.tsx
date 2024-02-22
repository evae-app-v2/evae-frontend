import uboPic from "../assets/logo_UBO_white.png"
import backgroundPic from "../assets/UBO_Brest.jpg";
export function EmptyCompoenent() {
    return(<>
        <div className="w-full">
            <div className="flex bg-white" style={{height: '85vh'}}>
                <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">Transformez vos idées en <span className="text-indigo-600">évaluations</span> concrètes
                            </h2>
                        <p className="mt-2 text-sm text-gray-500 md:text-base">Notre plateforme vous permet de créer facilement des évaluations pour que les étudiants puissent donner leur avis sur les cours des enseignants. Avec des fonctionnalités intuitives et
                            des outils puissants, vous pouvez concevoir des évaluations personnalisées qui répondent aux besoins de votre établissement. Commencez dès maintenant à collecter des retours précieux et à améliorer l'expérience d'apprentissage pour tous.</p>
                        <div className="flex justify-center lg:justify-start mt-6">
                            <a className="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800"
                               href="#">Commencer</a>
                            <a className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
                               href="#">En savoir plus</a>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/2"
                     style={{clipPath: 'polygon(10% 0, 100% 0%, 100% 100%, 0 100%)'}}>
                    <div className="h-full object-cover"
                         style={{backgroundImage: `url(${backgroundPic})`}}>                        <div className="h-full bg-black opacity-25"></div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}