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
    ChevronsUpDown,
    LogOut,
    CircleUser,
    Package,
    PackageOpen,
    BetweenHorizonalStart,
    PlaneLanding,
} from "lucide-react"
import { Button } from "../ui/button"
import { useActiveItem } from "@/context/ActiveItemContext.tsx";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
    Icon: React.ElementType,
    label: string,
    active: boolean,
    onClick: () => void
}

const sideBarItems = {
    "sections": [
        {
            "title": "Reembolsos",
            "items": [
                {
                    "Icon": Receipt,
                    "label": "Despesas",
                    "path": "/expenses",
                    "roles": []
                },
                {
                    "Icon": FileText,
                    "label": "Relatórios",
                    "path": "/reports",
                    "roles": []
                }
            ]
        },
        {
            "title": "Estrutura Organizacional",
            "items": [
                {
                    "Icon": Users,
                    "label": "Colaboradores",
                    "path": "/collaborators",
                    "roles": ["ADMIN", "FINANCE"]
                },
                {
                    "Icon": Building,
                    "label": "Cargos",
                    "path": "/job-titles",
                    "roles": ["ADMIN"]
                },
                {
                    "Icon": Split,
                    "label": "Centros de Custo",
                    "path": "/cost-centers",
                    "roles": ["ADMIN", "FINANCE"]
                },
                {
                    "Icon": Tag,
                    "label": "Tipos de Despesa",
                    "path": "/expense-categories",
                    "roles": ["ADMIN", "FINANCE"]
                }
            ]
        },
        {
            "title": "Relacionamentos",
            "items": [
                {
                    "Icon": Handshake,
                    "label": "Clientes",
                    "path": "/customers",
                    "roles": ["ADMIN"]
                },
                {
                    "Icon": BriefcaseBusiness,
                    "label": "Projetos",
                    "path": "/projects",
                    "roles": ["ADMIN"]
                },
                {
                    "Icon": BetweenHorizonalStart,
                    "label": "Alocações",
                    "path": "/allocations",
                    "roles": ["ADMIN", "APPROVER"]
                }
            ]
        },
        {
            "title": "Ações",
            "items": [
                {
                    "Icon": ThumbsUp,
                    "label": "Aprovação",
                    "path": "/approval",
                    "roles": ["ADMIN", "APPROVER"]
                },
                {
                    "Icon": Landmark,
                    "label": "Financeiro",
                    "path": "/financial",
                    "roles": ["ADMIN", "FINANCE"]
                }
            ]
        },
        {
            "title": "Adicional",
            "items": [
                {
                    "Icon": BetweenHorizonalStart,
                    "label": "Minhas alocações",
                    "path": "/allocations/my",
                    "roles": ["ADMIN", "USER"]
                },
                {
                    "Icon": PlaneLanding,
                    "label": "Contexto",
                    "path": "/context",
                    "roles": ["ADMIN", "USER"]
                }
            ]
        }
    ],
}

function SidebarItem({ Icon, label, active, onClick }: SidebarProps) {
    const hasBorder = (label === "Início" || label === "Configurações") ? "" : "mx-3.5 border-l border-zinc-700"
    return (
        <li className={`${hasBorder}`}>
            <Button
                variant="ghost"
                onClick={onClick}
                className={`mx-2 flex min-w-0 py-0.5 px-2.5 ${
                    active ? 'text-red-400' : 'text-gray-300 hover:text-red-400'
                }`}
                >
                <Icon className="h-5 w-5" />
                {label}
            </Button>
        </li>
    )
}

export default function Sidebar() {
    const [role, setRole] = useState('');
    const { user, logout } = useAuth();
    const { activeItem, setActiveItem } = useActiveItem();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleItemClick = (label: string, path: string) => {
        setActiveItem(label);
        navigate(path);
    };

    useEffect(() => {
        async function getUserRole() {
            const { data } = await api.get('/auth/getRole');
            const rolePayload = data.payload;
            setRole(rolePayload);
        }
        getUserRole();
    }, []);

    return (
        <div className="w-64 bg-zinc-800 p-4 h-screen flex flex-col border-r border-zinc-700">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="py-0.5 px-2.5 h-16 flex gap-x-5 cursor-default" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <div className="flex items-center gap-4 text-left w-fit">
                            <div className="bg-red-400 rounded-md p-1">
                                {isHovered ? <PackageOpen size={35} /> : <Package size={35} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-red-400">Reembox</span>
                                <span className="shrink-0 text-md font-medium text-sidebar-foreground/60">{user && user.company}</span>
                            </div>
                        </div>
                    </div>
                </DropdownMenuTrigger>
            </DropdownMenu>

            <nav className="flex flex-col w-full h-[calc(100vh-165px)] overflow-y-scroll mt-4">
                <SidebarItem Icon={Home} label="Início" active={activeItem === "Início"} onClick={() => handleItemClick("Início", "/home")} />
                <Separator className="my-2 bg-zinc-700" />
                {sideBarItems["sections"].map((section: any, index: number) => {
                    const sidebar = [];
                    section.items.forEach((item: any) => {
                        if (item.roles.includes(role) || item.roles.length === 0) {
                            if (item.path === "/context" && !user?.rag) {
                                return
                            }
                            sidebar.push(
                                <SidebarItem key={item.label} Icon={item.Icon} label={item.label} active={activeItem === item.label} onClick={() => handleItemClick(item.label, item.path)} />
                            );
                        }
                    });
                    if (sidebar.length !== 0) {
                        sidebar.unshift(
                            <p key={index} className="flex h-8 shrink-0 items-center text-xs font-medium text-sidebar-foreground/70">{section.title}</p>
                        );
                    }
                    return sidebar;
                })}
            </nav>

            <div className="absolute bottom-0 left-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="h-16 hover:bg-zinc-700 flex gap-x-5" variant={"ghost"}>
                            <img src={`https://ui-avatars.com/api/?name=${user && user.name}&background=random&rounded=true&size=40`} alt="" />
                            <div className="flex flex-col text-left w-fit">
                                <span className="text-sm">{user && user.name}</span>
                                <span className="shrink-0 text-xs font-medium text-sidebar-foreground/70">{user && user.username}</span>
                            </div>
                            <ChevronsUpDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] flex flex-col gap-y-2">
                            <DropdownMenuItem onClick={() => {navigate('/my-account')}} className="cursor-pointer h-10">
                                <span className="flex gap-x-3 items-center"><CircleUser size={16} />Minha Conta</span>
                            </DropdownMenuItem>
                            <Separator className="bg-zinc-700" />
                            <DropdownMenuItem onClick={() => {navigate('/config')}} className="cursor-pointer h-10">
                                <span className="flex gap-x-3 items-center"><Settings size={16} />Configurações</span>
                            </DropdownMenuItem>
                            <Separator className="bg-zinc-700" />
                            <DropdownMenuItem onClick={logout} className="cursor-pointer h-10">
                                <span className="flex gap-x-3 items-center"><LogOut size={16} />Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
