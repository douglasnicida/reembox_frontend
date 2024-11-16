import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { CostCenter } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import { Pagination } from "@/components/custom_components/Pagination";
import api from "@/api/axios";
import { Paginated } from "@/types/response.type";

export default function CostCenterPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [data, setData] = React.useState<Paginated<CostCenter>>({
    payload: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      size: 10,
    },
  });

  async function fetchCostCenters(page: number, size: number = 10) {
    try {
      const response = await api.get<Paginated<CostCenter>>("/cost-centers", {
        params: {
          page,
          size,
        },
      });

      console.log(response.data);
      
      
      setData(response.data);
    } catch (err: any) {
      errorHandler(err);
    }
  }

  React.useEffect(() => {
    fetchCostCenters(1);
  }, []);

  return (
    <>
      <div className="flex-1 overflow-auto">
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

            {/* <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={}
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
            </DropdownMenuContent> */}
          </DropdownMenu>
        </div>

        <div className="p-4">
          <TableComponent 
            data={data ? data.payload.items : []} // Acesse os itens corretamente
            columnHeaders={['Código', 'Descrição', 'Criado em', 'Atualizado em', 'Ativo']} 
          />
        </div>
        <Pagination data={data} onPageChange={fetchCostCenters}/>
      </div>
      <Toaster />
    </>
  );
}