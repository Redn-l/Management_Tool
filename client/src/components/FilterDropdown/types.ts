import { Dispatch, SetStateAction } from "react";
import { StatusTypes } from "../../types";

export interface FilterDropdownProps {
    filter: StatusTypes;
    setFilter: Dispatch<SetStateAction<StatusTypes>>;
}