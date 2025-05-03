import { blue, green, yellow } from "@mui/material/colors";
import { StatusTypes } from "../types";

export const API_URL: string = 'http://localhost:5001';
export const DEFAULT_ALERT = {
    error: 'Произошла ошибка! Пожалуйста, попробуйте снова.',
    success: '',
    info: '',
    warning: ''
};
export const ALERT_TIMEOUT = 2000;
export const MIN_PASSWORD_LENGTH = 8;
export const TASK_STATUS = {
    [StatusTypes.todo]: {color: yellow[100], label: 'To Do'},
    [StatusTypes.inProgress]: {color: blue[100], label: "In Progress"},
    [StatusTypes.done]: {color: green[100], label: 'Done'}
};