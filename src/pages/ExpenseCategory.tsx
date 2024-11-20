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
import { ExpenseCategory } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";
import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import CreationDialog from "@/components/custom_components/CreationDialog";
import { dtoList } from "@/lib/utils";
import { useActiveItem } from "@/context/ActiveItemContext";

export default function ExpenseCategoryPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<Paginated<ExpenseCategory>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });
  const { activeItem, reload } = useActiveItem();

  async function fetchExpenseCategories(page: number, size: number = 10) {
    try {
      const params: Record<string, any> = { page, size };

      if (q) params.q = q;

      if (typeof active === "boolean") {
        params.active = active ? 1 : 0;
      }

      const { data } = await api.get<PaginatedResponse<ExpenseCategory>>(
        "/expense-categories",
        { params }
      );

      setData(data.payload);
    } catch (err: any) {
      errorHandler(err);
    }
  }

  useEffect(() => {
    fetchExpenseCategories(1);
  }, [active, reload]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchExpenseCategories(1);
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
            <CreationDialog dtoList={dtoList.dtos} currentLabel={activeItem} />
            
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
            resource="expense-categories"
            data={data} 
            columnHeaders={['Descrição', 'Criado em', 'Atualizado em', 'Ativo']} 
            onPageChange={fetchExpenseCategories}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}