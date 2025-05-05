import { createContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export const LoadingProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}


export default LoadingContext;