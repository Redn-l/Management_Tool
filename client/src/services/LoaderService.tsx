import React, { createContext, FC, useCallback, useState } from "react";
import { EmptyProps, LoaderContextType } from "../types";

const LoaderContext = createContext({loading: false, dispatchLoader: () => {}} as LoaderContextType);

const LoaderProvider: FC<EmptyProps> = React.memo(({children}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const dispatchLoader = useCallback((value: boolean): void => setLoading(value), []);

    return <LoaderContext.Provider value={{loading, dispatchLoader}}>{children}</LoaderContext.Provider>;
});

export {LoaderContext, LoaderProvider};
