import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Filter
} from "lucide-react"
import TableComponent from "@/components/custom_components/TableComponent"
import { Collaborator } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import { Toaster } from "@/components/ui/toaster"
import { Paginated, PaginatedResponse } from "@/types/response.type"

export default function CollaboratorPage() {
  const [q, setQ] = React.useState("")

  const [data, setData] = React.useState<Paginated<Collaborator>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });

  async function fetchEmployees(page: number, size: number = 10) {
    try {
      const { data } = await api.get<PaginatedResponse<Collaborator>>("/users", {
        params: {
          page,
          size,
        },
      });

      setData(data.payload);
    } catch (err: any) {
      errorHandler(err);
    }
  }

  React.useEffect(() => {
    fetchEmployees(1);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Buscar..." 
            className="pl-8 bg-zinc-700 border-zinc-600" 
            value={q}
            onChange={(e) => setQ(e.target.value)}
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

      <div className="p-4">
        <TableComponent 
          resource="users"
          data={data}
          columnHeaders={['CPF', 'Nome', 'Telefone', 'Cargo', 'Criado em', 'Atualizado em', 'Ativo' ]}
          onPageChange={fetchEmployees}
        />
      </div>
    <Toaster />
    </>
  )
}