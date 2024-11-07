import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import {
    Users,
    Home,
    FileText,
    UserCheck,
    Briefcase,
    DollarSign,
    FileBarChart,
    Settings,
    Building2,
    LayoutGrid,
} from "lucide-react"
import { Button } from "../ui/button"
import {useActiveItem} from "@/context/ActiveItemContext.tsx";

interface SidebarProps {
    Icon: React.ElementType,
    label: string,
    active: boolean,
    onClick: () => void
}

function SidebarItem({ Icon, label, active, onClick }: SidebarProps) {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={`w-full justify-start gap-2 ${
                active ? 'bg-red-400 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="h-5 w-5" />
            {label}
        </Button>
    )
}

export default function Sidebar() {
    const {activeItem, setActiveItem} = useActiveItem();
    const navigate = useNavigate()

    const handleItemClick = (label: string, path: string) => {
        setActiveItem(label)
        navigate(path)
    }

    return (
        <div className="w-64 bg-zinc-800 p-4">
            <div className="flex items-center gap-2 px-2 py-4 text-red-400">
                <span className="text-2xl font-bold">Reembox</span>
            </div>
            <nav className="space-y-1">
                <SidebarItem
                    Icon={Home}
                    label="Início"
                    active={activeItem === "Início"}
                    onClick={() => handleItemClick("Início", "/")}
                />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem
                    Icon={Users}
                    label="Colaboradores"
                    active={activeItem === "Colaboradores"}
                    onClick={() => handleItemClick("Colaboradores", "/collabs")}
                />
                <SidebarItem
                    Icon={FileText}
                    label="Ponto"
                    active={activeItem === "Ponto"}
                    onClick={() => handleItemClick("Ponto", "/ponto")}
                />
                <SidebarItem
                    Icon={UserCheck}
                    label="Perfil de Benefícios"
                    active={activeItem === "Perfil de Benefícios"}
                    onClick={() => handleItemClick("Perfil de Benefícios", "/benefits")}
                />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem
                    Icon={Briefcase}
                    label="Gestão"
                    active={activeItem === "Gestão"}
                    onClick={() => handleItemClick("Gestão", "/management")}
                />
                <SidebarItem
                    Icon={DollarSign}
                    label="Financeiro"
                    active={activeItem === "Financeiro"}
                    onClick={() => handleItemClick("Financeiro", "/financial")}
                />
                <SidebarItem
                    Icon={FileBarChart}
                    label="Relatórios"
                    active={activeItem === "Relatórios"}
                    onClick={() => handleItemClick("Relatórios", "/reports")}
                />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem
                    Icon={Settings}
                    label="Configurações"
                    active={activeItem === "Configurações"}
                    onClick={() => handleItemClick("Configurações", "/config")}
                />
                <SidebarItem
                    Icon={Building2}
                    label="Cargos Corporativos"
                    active={activeItem === "Cargos Corporativos"}
                    onClick={() => handleItemClick("Cargos Corporativos", "/corporate")}
                />
                <SidebarItem
                    Icon={LayoutGrid}
                    label="Departamentos"
                    active={activeItem === "Departamentos"}
                    onClick={() => handleItemClick("Departamentos", "/departments")}
                />
            </nav>
        </div>
    )
}
