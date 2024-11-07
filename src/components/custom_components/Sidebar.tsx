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

interface SidebarProps {
    Icon: React.ElementType,
    label: string
    active?: boolean
}

function SidebarItem({ Icon, label, active = false }: SidebarProps) {
  return (
    <Button
      variant="ghost"
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
    return (
        <div className="w-64 bg-zinc-800 p-4">
            <div className="flex items-center gap-2 px-2 py-4 text-red-400">
            <span className="text-2xl font-bold">Reembox</span>
            </div>
            <nav className="space-y-1">
                <SidebarItem Icon={Home} label="Início" />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem Icon={Users} label="Colaboradores" active />
                <SidebarItem Icon={FileText} label="Ponto" />
                <SidebarItem Icon={UserCheck} label="Perfil de Benefícios" />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem Icon={Briefcase} label="Gestão" />
                <SidebarItem Icon={DollarSign} label="Financeiro" />
                <SidebarItem Icon={FileBarChart} label="Relatórios" />
                <Separator className="my-2 bg-zinc-700" />
                <SidebarItem Icon={Settings} label="Configurações" />
                <SidebarItem Icon={Building2} label="Cargos Corporativos" />
                <SidebarItem Icon={LayoutGrid} label="Departamentos" />
            </nav>
        </div>
    )
}