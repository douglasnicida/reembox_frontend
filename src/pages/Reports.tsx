/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/api/axios";
import TableComponent from "@/components/custom_components/TableComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { useActiveItem } from "@/context/ActiveItemContext";
import { toast } from "@/hooks/use-toast";
import { Report, ReportTableItem } from "@/types/models.type";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { errorHandler } from "@/utils/errorHandler";
import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
    const navigate = useNavigate();
    const { reload, setReload } = useActiveItem();

    const [q, setQ] = React.useState("");
    const [data, setData] = React.useState<Paginated<ReportTableItem | []>>({
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      size: 10,
    });

    const [isByCreator, setIsByCreator] = React.useState<boolean>(false);
    const [header, setHeader] = React.useState<string[]>(['ID', 'Nome', 'Objetivo', 'Total', 'Criador', 'Aprovador', 'Criado em', 'Atualizado em', 'Status']);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

    async function fetchReports(page: number, size: number = 10) {
      const endpoint = (isByCreator) ? '/reports/findAllByCreator' : '/reports';
    
      // Define o cabeçalho com base no endpoint
      setHeader((!isByCreator) ? 
        ['ID', 'Nome', 'Objetivo', 'Total', 'Criador', 'Aprovador', 'Criado em', 'Atualizado em', 'Status'] : 
        [' ', 'ID', 'Nome', 'Objetivo', 'Total', 'Criador', 'Aprovador', 'Criado em', 'Atualizado em', 'Status']
      );
    
      try {
        const { data } = await api.get<PaginatedResponse<Report>>(endpoint, {
          params: {
            page,
            size,
          },
        });
    
        const { items, ...restData } = data.payload;
    
        setData({
          ...(!isByCreator ? (data.payload) : { ...restData }),
          items: data.payload.items.map(report => ({
            selected: false,
            id: report.id,
            key: report.id,
            name: report.name,
            goal: report.goal,
            total: report.total,
            creator: report.creator.name,
            approver: report.approver.name,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
            status: report.status,
          }))
        });
      } catch (err: any) {
        errorHandler(err);
      }
    }

    React.useEffect(() => {
      fetchReports(1);
    }, [isByCreator]);

    // Função para lidar com a seleção de itens
    const handleSelectionChange = (selectedIds: number[]) => {
      setSelectedItems(selectedIds);
    };

    // Função para lidar com a ação do botão
    const handleButtonClick = async () => {
      console.log("Itens selecionados:", selectedItems);
      
      selectedItems.forEach(async (item) => {
        const { data } = await api.get(`/reports/${item}`);
        const currentReport = data.payload;

        if(currentReport.expenses.length > 0) {
          if(currentReport.status == "OPEN") {
            await api.patch(`/reports/submit/${currentReport.id}`)
            toast({
              title: "Sucesso",
              description: 'Relatório submetido com sucesso!',
              variant: 'default'
            })
          } else {
            if(currentReport.status == "REJECTED") {
              await api.patch(`/reports/reopen/${currentReport.id}`)
              toast({
                title: "Sucesso",
                description: 'Relatório reaberto com sucesso!',
                variant: 'default'
              })
            } else {
              toast({
                title: "Inválido",
                description: `Relatório ${currentReport.name} já foi submetido anteriormente!`,
                variant: 'destructive'
              })
            }
          }
        } else {
          toast({
            title: "Inválido",
            description: `Relatório ${currentReport.name} deve ter pelo menos uma despesa vinculada!`,
            variant: 'destructive'
          })
        }
      });

      setReload(!reload);
    };

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
            <Button variant="default" className="text-sm font-bold" onClick={() => navigate("/reports/new")}>Criar +</Button>
            <Switch checked={isByCreator} onCheckedChange={() => setIsByCreator(!isByCreator)} />
          </div>

          <div className="p-4">
            <TableComponent 
              resource="reports"
              data={data}
              columnHeaders={header}
              onPageChange={fetchReports}
              onSelectionChange={handleSelectionChange} // Passa a função de seleção para o componente da tabela
            />
          </div>

          {/* Botão que aparece somente se houver itens selecionados */}
          {selectedItems.length > 0 && isByCreator && (
            <div className="p-4 w-full flex justify-items-end items-end">
              <Button variant="default" onClick={handleButtonClick}>
                Submeter/reabrir itens selecionados
              </Button>
            </div>
          )}
        </div>
        <Toaster />
        </>
    )
}