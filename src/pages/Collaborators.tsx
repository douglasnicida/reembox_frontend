import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Bell,
  ChevronDown,
  Filter
} from "lucide-react"
import TableComponent from "@/components/custom_components/TableComponent"
import { Collaborator } from "@/types/models.type"
// import Sidebar from "@/components/custom_components/Sidebar"

const collaborators: Collaborator[] = [
  {
    name: "Breno Melo",
    cpf: "474.208.710-20",
    address: "Não cadastrado",
    email: "breno.jose@test.com",
    status: "Ativo"
  },
  {
    name: "Breno Melo Paes",
    cpf: "221.209.418-42",
    address: "Rua das Flores, 123",
    email: "paes@test.com",
    status: "Inativo"
  },
  {
    name: "Diego Gallego",
    cpf: "733.368.400-75",
    address: "Não cadastrado",
    email: "diego.gall@test.com",
    status: "Ativo"
  },
  {
    name: "admin teste",
    cpf: "911.204.473-59",
    address: "Avenida Principal, 456",
    email: "admin@test.com",
    status: "Ativo"
  },
  {
    name: "aldo catarina",
    cpf: "394.395.150-40",
    address: "Não cadastrado",
    email: "aldo.catar@test.com",
    status: "Inativo"
  },
  {
    name: "celio garcia",
    cpf: "053.722.830-66",
    address: "Praça Central, 789",
    email: "celio.gar@test.com",
    status: "Ativo"
  },
  {
    name: "gabriela muller pin",
    cpf: "505.877.890-58",
    address: "Não cadastrado",
    email: "gabriela.mul@test.com",
    status: "Ativo"
  }
]

export default function Component() {
  const [filterOptions, setFilterOptions] = React.useState({
    active: false,
    inactive: false,
    withAddress: false,
    withoutAddress: false,
  })
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredCollaborators, setFilteredCollaborators] = React.useState<Collaborator[]>(collaborators)

  React.useEffect(() => {
    const results = collaborators.filter(collaborator => {
      const matchesSearch = Object.values(collaborator).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      const matchesFilter = (
        (!filterOptions.active && !filterOptions.inactive) ||
        (filterOptions.active && collaborator.status === "Ativo") ||
        (filterOptions.inactive && collaborator.status === "Inativo")
      ) && (
        (!filterOptions.withAddress && !filterOptions.withoutAddress) ||
        (filterOptions.withAddress && collaborator.address !== "Não cadastrado") ||
        (filterOptions.withoutAddress && collaborator.address === "Não cadastrado")
      )

      return matchesSearch && matchesFilter
    })
    setFilteredCollaborators(results)
  }, [searchTerm, filterOptions])

  return (
    <>
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 p-4">
          <h1 className="text-2xl font-semibold">Colaboradores</h1>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5" />
            <Button variant="ghost" className="gap-2">
              <span>Org</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        {/* Search and filter bar */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Buscar..." 
              className="pl-8 bg-zinc-700 border-zinc-600" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterOptions.active}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({ ...prev, active: checked }))
                }
              >
                Ativos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterOptions.inactive}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({ ...prev, inactive: checked }))
                }
              >
                Inativos
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterOptions.withAddress}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({ ...prev, withAddress: checked }))
                }
              >
                Com endereço
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterOptions.withoutAddress}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({ ...prev, withoutAddress: checked }))
                }
              >
                Sem endereço
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="p-4">
          <TableComponent data={filteredCollaborators} columnHeaders={['Nome', 'Status', 'CPF', 'Endereço', 'Email']} />
        </div>

      </div>
    </>
  )
}