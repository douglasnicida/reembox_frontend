import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { JobTitle } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import CreationDialog from "@/components/custom_components/CreationDialog";
import { dtoList } from "@/lib/utils";
import { useActiveItem } from "@/context/ActiveItemContext";
import UpdateDialog from "@/components/custom_components/UpdateDialog.tsx";
import {dtoUpdateList} from "@/lib/utilsUpdate.ts";
import {useState} from "react";

export default function JobTitlePage() {
  const [q, setQ] = React.useState(""); 
  const [data, setData] = React.useState<Paginated<JobTitle>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });
  const { activeItem,reload } = useActiveItem();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  async function fetchJobTitles(page: number, size: number = 10) {
    try {
      const params: Record<string, any> = { page, size };

      if (q) params.q = q; 

      const { data } = await api.get<PaginatedResponse<JobTitle>>(
        "/job-titles",
        { params }
      );

      setData(data.payload);
    } catch (err: any) {
      errorHandler(err);
    }
  }

  React.useEffect(() => {
    fetchJobTitles(1); 
  }, [reload]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchJobTitles(1); 
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
          </div>
          <CreationDialog dtoList={dtoList.dtos} currentLabel={activeItem} />
        </form>

        <div className="p-4">
          <TableComponent 
            data={data}
            columnHeaders={['Cargo', 'Qtd. de Funcionários']}
            onPageChange={fetchJobTitles}
            onEdit={handleOpenEditModal}
          />
        </div>
      </div>
      {isEditModalOpen && (
          <UpdateDialog
              dtoList={dtoUpdateList.dtos}
              currentLabel="Cargos"
              editId={editId}
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
          />
      )}
      <Toaster />
    </>
  );
}