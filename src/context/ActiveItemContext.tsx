import React, { createContext, useContext, useState } from "react";
import {useLocation} from "react-router-dom";

interface ActiveItemContextType {
    activeItem: string;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}
export const RoutesMap: Record<string, string> = {
    "/": "Início",
    "/collabs": "Colaboradores",
    "/ponto": "Ponto",
    "/benefits": "Perfil de Benefícios",
    "/management": "Gestão",
    "/financial": "Financeiro",
    "/reports": "Relatórios",
    "/config": "Configurações",
    "/corporate": "Cargos Corporativos",
    "/departments": "Departamentos",
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

    React.useEffect(() => {
        setActiveItem('Início')
        const location = window.location.pathname;
        setActiveItem(RoutesMap[location]);
    }, [window.location.pathname]);

    const [activeItem, setActiveItem] = useState<string>('');

    return (
        <ActiveItemContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </ActiveItemContext.Provider>
    );
};
