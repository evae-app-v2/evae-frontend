import React, {useEffect, useState} from "react";
import {Alert} from "@material-tailwind/react";

const AlertComp = ({ style,message,timeout }: any) => {
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout]);

    return(
        <>
            {showAlert && (
                <Alert color={style}>{message}</Alert>
            )}
        </>
        );
}
export default AlertComp;
