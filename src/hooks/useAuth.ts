import { LoginType, TokenType } from "@/types/auth.type"
import { createContext, useContext } from "react"

interface ProviderProps {
    user:  TokenType | null,
    token:  string,
    login (credentials: LoginType ): void,
    logout() :void,
}

export const AuthContext = createContext<ProviderProps>({
    user: null,
    token: '',
    login: () => {},
    logout: () => {}
})

export const useAuth = () => {
    return useContext(AuthContext)
}