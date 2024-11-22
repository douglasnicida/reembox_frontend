import React, { createContext, useContext, useEffect, useState } from "react";
// import {useLocation} from "react-router-dom";

interface ActiveItemContextType {
    activeItem: string;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
    reload: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
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
    '/expense/new': "Nova despesa",
    "/reports/new": "Novo Relatório",
    "/reports/:id/details": "Detalhes Relatório",
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

    useEffect(() => {
        const location = window.location.pathname;
        
        setActiveItem('Início')
        setActiveItem(RoutesMap[location]);


    }, [window.location.pathname]);

    const [activeItem, setActiveItem] = useState<string>('');
    const [reload, setReload] = useState<boolean>(true);

    return (
        <ActiveItemContext.Provider value={{ activeItem, setActiveItem, reload, setReload }}>
            {children}
        </ActiveItemContext.Provider>
    );
};
