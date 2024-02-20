import React, { useEffect, useState } from 'react';

const Spinner = ({ timeout }: any) => {
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpinner(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout]);

    return (
        <>
            {showSpinner && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-32 w-32"></div>
                </div>
            )}
            {showSpinner && (
                <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
            )}
        </>
    );
};

export default Spinner;
