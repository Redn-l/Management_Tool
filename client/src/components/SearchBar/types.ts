import { Dispatch, SetStateAction } from "react";

export interface SearchBarProps {
    searchValue: string;
    setSearchValue: Dispatch<SetStateAction<string>>;
}
