import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel, Search } from "lucide-react";
import TableComponent from "@/components/custom_components/TableComponent";
import { Expense, ExpenseTableItem } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { useNavigate } from "react-router-dom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function ExpensePage() {
  const [q, setQ] = React.useState("");
  const [data, setData] = React.useState<Paginated<ExpenseTableItem>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true)
  const [selectedReportID, setSelectedReportID] = React.useState<string>('')
  const [selectedExpenseID, setSelectedExpenseID] = React.useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const navigate = useNavigate()

  async function fetchExpenses(page: number, size: number = 10) {
    setLoading(true);
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
    setLoading(false)
  }

  async function fetchReports(page: number, size: number = 20) {
    const reportsResponse = await api.get('/reports/findAllByCreator', {
      params: {
        page,
        size,
      },
    })
  
    setReports(reportsResponse.data.payload.items)
  }

  async function handleAddExpenseToReport() {
    if(selectedReportID == '' || selectedExpenseID == '') {
      toast({
        title: 'Erro ao adicionar despesa ao relatório',
        description: 'Selecione pelo menos um relatório',
        variant: 'destructive'
      })
      return;
    } else {
      try {
        await api.patch(`/expenses/addExpenseToReport/${selectedExpenseID}`, {reportId: +selectedReportID})
        toast({
          title: 'Despesa adicionada com sucesso ao relatório',
          variant: 'default'
        })
      } catch(e: any) {
        errorHandler(e)
      }
    }

    setSelectedExpenseID('')
    setSelectedReportID('')
    setIsDialogOpen(false)
  }

  async function fetchAll(){
    await fetchExpenses(1);
    await fetchReports(1);
  }

  React.useEffect(() => {
    setIsDialogOpen(false)
    fetchAll()
  }, []);

  const renderCustomActions = (item: any) => {
    return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => {setIsDialogOpen(true); setSelectedExpenseID(item.id)}}>
            Adicionar despesa a relatório
        </DropdownMenuItem>
    );
  };


  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {
          isDialogOpen &&
          <DialogContent>
              <DialogTitle> Adicione esta despesa ao relatório </DialogTitle>
              <DialogDescription>Selecione o relatório no qual a despesa será adicionada</DialogDescription>
              <Select onValueChange={(value) => setSelectedReportID(value)}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione um relatório" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          {reports.map(report => (
                              <SelectItem key={report.id} value={report.id} className="cursor-pointer">
                                  {report.name}
                              </SelectItem>
                          ))}
                      </SelectGroup>
                  </SelectContent>
              </Select>
              <DialogFooter>
                  <Button variant={"secondary"} onClick={() => {setIsDialogOpen(false); setSelectedExpenseID('')}}>Cancelar</Button>
                  <Button variant={'default'} onClick={handleAddExpenseToReport}>Confirmar</Button>
              </DialogFooter>
          </DialogContent>
        }
    </Dialog>

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
          {
            loading ?
            <div className="w-full h-[calc(100vh-234px)] flex justify-center items-center">
              <LoaderPinwheel className="animate-spin h-20 w-20" />
            </div>
            :
            <TableComponent 
              resource="customers"
              data={data}
              columnHeaders={['Data da Despesa', 'Valor total', 'Cód. Projeto', 'Cód. Centro de Custo', 'Tipo de Despesa']} 
              onPageChange={fetchExpenses}
              customActions={renderCustomActions}
            />
          }
        </div>
      </div>
      <Toaster />
    </>
  );
}