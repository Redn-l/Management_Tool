import { Dispatch, SetStateAction } from "react";
import { SortTypes } from "../../types";

export interface SortDropdownProps {
    sort: SortTypes;
    setSort: Dispatch<SetStateAction<SortTypes>>;
}