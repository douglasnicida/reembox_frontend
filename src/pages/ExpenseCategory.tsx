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
import { Search, Filter, LoaderPinwheel } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { ExpenseCategory } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";
import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import CreationDialog from "@/components/custom_components/CreationDialog";
import { dtoList } from "@/lib/utils";
import { useActiveItem } from "@/context/ActiveItemContext";
import UpdateDialog from "@/components/custom_components/UpdateDialog.tsx";
import {dtoUpdateList} from "@/lib/utilsUpdate.ts";

export default function ExpenseCategoryPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<Paginated<ExpenseCategory>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });
  const { activeItem, reload } = useActiveItem();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  async function fetchExpenseCategories(page: number, size: number = 10) {
    setLoading(true)
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
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenseCategories(1);
  }, [active,reload]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchExpenseCategories(1);
  }

  const handleOpenEditModal = (id: number) => {
    setEditId(id);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

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
          {
            loading ?
            <div className="w-full h-[calc(100vh-234px)] flex justify-center items-center">
              <LoaderPinwheel className="animate-spin h-20 w-20" />
            </div>
            :
            <TableComponent
              resource="expense-categories"
              data={data}
              columnHeaders={['Descrição', 'Criado em', 'Atualizado em', 'Ativo']}
              onPageChange={fetchExpenseCategories}
              onEdit={handleOpenEditModal}
            />
          }
        </div>
      </div>

      {isEditModalOpen && (
          <UpdateDialog
              dtoList={dtoUpdateList.dtos}
              currentLabel="Tipos de Despesa"
              editId={editId}
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
          />
      )}
      <Toaster />
    </>
  );
}