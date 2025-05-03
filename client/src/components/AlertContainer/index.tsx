import { FC, useContext } from "react";
import { AlertType, EmptyProps } from "../../types";
import React from "react";
import { AlertContext } from "../../services/AlertService";
import { Alert } from "@mui/material";
import './styles.css'

const AlertContainer: FC<EmptyProps> = React.memo(() => {
    const {alerts} = useContext(AlertContext);

    return (<div className='alerts'>
        {(alerts || []).map((alert: AlertType) => <Alert severity={alert.severity} key={alert.message}>{alert.message}</Alert>)}
    </div>);
});

AlertContainer.displayName = 'AlertContainer';
export default AlertContainer;
