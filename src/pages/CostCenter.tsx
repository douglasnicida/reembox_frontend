import * as React from "react";
import TableComponent from "@/components/custom_components/TableComponent";
import { CostCenter } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import { Pagination } from "@/components/custom_components/Pagination";
import api from "@/api/axios";
import { Paginated } from "@/types/response.type";
import ActionsBar from "@/components/custom_components/ActionsBar";
import { useActiveItem } from "@/context/ActiveItemContext";

export default function CostCenterPage() {

  const { reload } = useActiveItem()
  
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
      
      setData(response.data);
    } catch (err: any) {
      errorHandler(err);
    }
  }

  React.useEffect(() => {
    fetchCostCenters(1);
  }, [reload]);

  return (
    <>
      <div className="flex-1 overflow-auto">
        <ActionsBar />
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