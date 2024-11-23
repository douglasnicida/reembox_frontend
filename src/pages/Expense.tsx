import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { Expense, ExpenseTableItem } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { useNavigate } from "react-router-dom";

export default function ExpensePage() {
  const [q, setQ] = React.useState("");
  const [data, setData] = React.useState<Paginated<ExpenseTableItem>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });

  const navigate = useNavigate()

  async function fetchExpenses(page: number, size: number = 10) {
    try {
      const { data } = await api.get<PaginatedResponse<Expense>>("/expenses", {
        params: {
          page,
          size,
        },
      });

      setData({
        ...data.payload,
        items: data.payload.items.map(expense => ({
          id: expense.id,
          expenseDate: expense.expenseDate,
          totalValue: expense.value * expense.quantity,
          projectKey: expense.project.key,
          costCenterCode: expense.costCenter.code,
          categoryDescription: expense.category.description
        }))
      });
    } catch (err: any) {
      errorHandler(err);
    }
  }

  React.useEffect(() => {
    fetchExpenses(1);
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Button variant="default" className="text-sm font-bold" onClick={() => navigate("/expense/new")}>Criar +</Button>
        </div>

        <div className="p-4">
          <TableComponent 
            resource="customers"
            data={data}
            columnHeaders={['Data da Despesa', 'Valor total', 'Cód. Projeto', 'Cód. Centro de Custo', 'Tipo de Despesa']} 
            onPageChange={fetchExpenses}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}