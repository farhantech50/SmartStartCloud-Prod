import { createContext, useContext, useState } from "react";

export const TokenContext = createContext()

export const useTokenContext = () => {
    return useContext(TokenContext);
}

export const TokenContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access-token"))
    const [refreshToken, setRefreshToken] = useState(null)
    return <TokenContext.Provider value={{accessToken, setAccessToken, refreshToken, setRefreshToken}}>
        {children}
    </TokenContext.Provider>
}