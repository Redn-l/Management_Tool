import { TaskType } from "../../types";

export interface AddTaskProps {
    onAdd: (newTodo: TaskType) => void;
    handleClose: () => void;
    open: boolean;
}