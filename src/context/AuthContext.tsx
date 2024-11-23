import api, { storeToken } from "@/api/axios";
import { LoginType, TokenType } from "@/types/auth.type";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveItem } from "./ActiveItemContext";
import { AuthContext } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const storedUserInfo =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
    const storedTokenInfo =  localStorage.getItem('access_token')

    const [user, setUser ] = useState<TokenType | null>(storedUserInfo ? storedUserInfo : {})
    const [ token, setToken ] = useState( storedTokenInfo || '')

    const navigate = useNavigate()
    const { setActiveItem } = useActiveItem();
    const { toast } = useToast();

    const login = async (credentials: LoginType) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const payload = response.data.payload;

            setToken(payload.access_token);
            storeToken(payload.access_token);
            
            const userResponse = await api.post('/auth/verify', {"access_token": payload.access_token})
            const userPayload = userResponse.data.payload

            setUser(userPayload)
            localStorage.setItem('user',JSON.stringify(userPayload))

            setActiveItem('Início');
            toast({title: 'Login realizado com sucesso!', variant: 'default'})
            navigate('/home')
            

        } catch(err: any) {
            toast({title: 'Erro ao realizar login', description: 'Verifique se as credenciais estão corretas', variant: 'destructive'})
            console.log(err)
        }
    }

    const logout = () => {
        setUser(null)
        setToken('')

        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;