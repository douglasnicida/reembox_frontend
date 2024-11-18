import React, { createContext, useContext, useEffect, useState } from "react";
// import {useLocation} from "react-router-dom";

interface ActiveItemContextType {
    activeItem: string;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}

const RoutesMap: Record<string, string> = {
    "/": "Login",
    "/home": "Início",
    "/reports": "Relatórios",
    "/expenses": "Despesas",
    "/collaborators": "Colaboradores",
    "/job-titles": "Cargos",
    "/cost-centers": "Centros de Custo",
    "/expense-categories": "Tipos de Despesa",
    "/projects": "Projetos",
    "/customers": "Clientes",
    "/financial": "Financeiro",
    "/approval": "Aprovação",
    "/config": "Configurações",
    '/expense/new': "Nova despesa"
}

const ActiveItemContext = createContext<ActiveItemContextType | undefined>(undefined);

export const useActiveItem = () => {
    const context = useContext(ActiveItemContext);
    if (!context) {
        throw new Error("useActiveItem must be used within ActiveItemProvider");
    }
    return context;
};

export const ActiveItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = 'a';

    useEffect(() => {
        const location = window.location.pathname;
        
        if(token.length > 0){
            setActiveItem('Início')
            setActiveItem(RoutesMap[location]);
        }

    }, [window.location.pathname]);

    const [activeItem, setActiveItem] = useState<string>('');

    return (
        <ActiveItemContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </ActiveItemContext.Provider>
    );
};
