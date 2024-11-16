import { useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import {
    Users,
    Home,
    FileText,
    Settings,
    BriefcaseBusiness,
    Split,
    Tag,
    Handshake,
    Building,
    Landmark,
    ThumbsUp,
    Receipt,
} from "lucide-react"
import { Button } from "../ui/button"
import { useActiveItem } from "@/context/ActiveItemContext.tsx";

interface SidebarProps {
    Icon: React.ElementType,
    label: string,
    active: boolean,
    onClick: () => void
}

function SidebarItem({ Icon, label, active, onClick }: SidebarProps) {
    const hasBorder = (label === "Início" || label === "Configurações") ? "" : "mx-3.5 border-l border-zinc-700"
    return (
        <li className={`${hasBorder}`}>
            <Button
                variant="ghost"
                onClick={onClick}
                className={`mx-2 flex min-w-0 py-0.5 px-2.5 ${
                    active ? 'bg-red-400 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                >
                <Icon className="h-5 w-5" />
                {label}
            </Button>
        </li>
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
            <nav className="">
                <SidebarItem
                    Icon={Home}
                    label="Início"
                    active={activeItem === "Início"}
                    onClick={() => handleItemClick("Início", "/home")}
                />
                <Separator className="my-2 bg-zinc-700" />
                <p className="flex h-8 shrink-0 items-center text-xs font-medium text-sidebar-foreground/70">Reembolsos</p>
                <SidebarItem
                    Icon={Receipt}
                    label="Despesas"
                    active={activeItem === "Despesas"}
                    onClick={() => handleItemClick("Despesas", "/expenses")}
                />
                <SidebarItem
                    Icon={FileText}
                    label="Relatórios"
                    active={activeItem === "Relatórios"}
                    onClick={() => handleItemClick("Relatórios", "/reports")}
                />
                <p className="flex h-8 shrink-0 items-center text-xs font-medium text-sidebar-foreground/70">Estrutura Organizacional</p>
                <SidebarItem
                    Icon={Users}
                    label="Colaboradores"
                    active={activeItem === "Colaboradores"}
                    onClick={() => handleItemClick("Colaboradores", "/collaborators")}
                />
                <SidebarItem
                    Icon={Building}
                    label="Cargos"
                    active={activeItem === "Cargos"}
                    onClick={() => handleItemClick("Cargos", "/job-titles")}
                />

                <SidebarItem
                    Icon={Split}
                    label="Centro de Custos"
                    active={activeItem === "Centro de Custos"}
                    onClick={() => handleItemClick("Centro de Custos", "/cost-centers")}
                />
                <SidebarItem
                    Icon={Tag}
                    label="Tipo de Despesas"
                    active={activeItem === "Tipo de Despesas"}
                    onClick={() => handleItemClick("Tipo de Despesas", "/expense-categories")}
                />
                <p className="flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-foreground/70">Relacionamentos</p>
                <SidebarItem
                    Icon={Handshake}
                    label="Clientes"
                    active={activeItem === "Clientes"}
                    onClick={() => handleItemClick("Clientes", "/customers")}
                />
                <SidebarItem
                    Icon={BriefcaseBusiness}
                    label="Projetos"
                    active={activeItem === "Projetos"}
                    onClick={() => handleItemClick("Projetos", "/projects")}
                />

                <p className="flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-foreground/70">Ações</p>
                <SidebarItem
                    Icon={ThumbsUp}
                    label="Aprovação"
                    active={activeItem === "Aprovação"}
                    onClick={() => handleItemClick("Aprovação", "/approval")}
                />
                <SidebarItem
                    Icon={Landmark}
                    label="Financeiro"
                    active={activeItem === "Financeiro"}
                    onClick={() => handleItemClick("Financeiro", "/financial")}
                />

                <Separator className="mt-6 mb-3 bg-zinc-700" />
                <SidebarItem
                    Icon={Settings}
                    label="Configurações"
                    active={activeItem === "Configurações"}
                    onClick={() => handleItemClick("Configurações", "/config")}
                />
            </nav>
        </div>
    )
}
