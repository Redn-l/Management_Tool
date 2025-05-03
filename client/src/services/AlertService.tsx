import React, { Dispatch, FC, SetStateAction, createContext, useCallback, useState } from "react";
import { AlertContextType, AlertType, EmptyProps } from "../types";
import { ALERT_TIMEOUT, DEFAULT_ALERT } from "../constants";

const AlertContext = createContext({} as AlertContextType);

const AlertProvider: FC<EmptyProps> = React.memo(({ children }) => {
    const [alerts, setAlerts]: [AlertType[], Dispatch<SetStateAction<AlertType[]>>] = useState([] as AlertType[]);

    const dispatchAlert = useCallback((alert: AlertType): void => {
        if (!alert.message) alert.message = DEFAULT_ALERT[alert.severity];
        setAlerts((prevAlerts: AlertType[]) => [...prevAlerts, alert]);

        setTimeout(() => {
            setAlerts((prevAlerts: AlertType[]) => {
                prevAlerts.shift();
                return [...prevAlerts];
            });
        }, ALERT_TIMEOUT);
    }, []);

    return (
        <AlertContext.Provider value={{ dispatchAlert, alerts }}>
            {children}
        </AlertContext.Provider>
    );
});

export { AlertContext, AlertProvider };
