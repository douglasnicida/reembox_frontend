import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { Allocation } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { useNavigate } from "react-router-dom";
import { convertISOToDDMMYYYY } from "@/utils/handleDate";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function AllocationPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<Paginated<Allocation>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });

  async function fetchAllocations(page: number, size: number = 10) {
    try {
      const { data } = await api.get<PaginatedResponse<Allocation>>(`/allocations?page=${page}&size=${size}`);
      setData({
        ...data.payload,
        items: data.payload.items.map(item => ({
          id: item.id,
          userName: item.user.name,
          jobTitle: item.user.jobTitle?.title || "Sem cargo",
          project: `${item.project.key} - ${item.project.name}`,
          startDate: convertISOToDDMMYYYY(item.startDate),
          estimatedEndDate: convertISOToDDMMYYYY(item.estimatedEndDate),
          endDate: item.endDate ? convertISOToDDMMYYYY(item.endDate) : "Em andamento",
        })) as any
      });
      
    } catch (err: any) {
      errorHandler(err);
    }
  }

  console.log(data)


  const navigate = useNavigate()

  useEffect(() => {
    fetchAllocations(1);
  }, [active]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchAllocations(1);
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Buscar..." 
                className="pl-8 bg-zinc-700 border-zinc-600" 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <Button variant="default" className="text-sm font-bold" onClick={() => navigate("/allocations/new")}>Criar +</Button>
            
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
                  checked={active === true}
                  onCheckedChange={(checked) => {
                    setActive(checked ? true : undefined);
                  }}
                >
                  Ativos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={active === false}
                  onCheckedChange={(checked) => {
                    setActive(checked ? false : undefined);
                  }}
                >
                  Inativos
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </form>

        <div className="p-4">
          <TableComponent
            resource="allocations"
            data={data} 
            columnHeaders={['Nome', 'Cargo', 'Projeto', 'Início', 'Término estimado', 'Término']} 
            onPageChange={fetchAllocations}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}