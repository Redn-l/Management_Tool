import { StatusTypes, TaskType } from "../../types";

export interface TaskProps {
    task: TaskType;
    onUpdate: (task: TaskType, status: StatusTypes) => void;
    onDelete: (task: TaskType) => void;
}