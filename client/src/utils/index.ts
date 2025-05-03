import { NavigateFunction } from "react-router-dom";
import { AxiosError } from "axios";
import { APIResponse, AlertType } from "../types";

export const errorHandler = (error: AxiosError, navigate: NavigateFunction, logout: () => void, dispatchAlert: (alert: AlertType) => void): void => {
    console.error(error);
    dispatchAlert({severity: 'error', message: (error.response?.data as APIResponse)?.message});
    if (error.request.status === 401) {
        logout();
        navigate('/');
    }
};