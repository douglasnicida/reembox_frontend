import api from "@/api/axios";
import TableComponent from "@/components/custom_components/TableComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { Report, ReportTableItem } from "@/types/models.type";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { errorHandler } from "@/utils/errorHandler";
import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
    const [q, setQ] = React.useState("");
    const [data, setData] = React.useState<Paginated<ReportTableItem>>({
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      size: 10,
    });
  
    const navigate = useNavigate()
  
    async function fetchReports(page: number, size: number = 10) {
      try {
        const { data } = await api.get<PaginatedResponse<Report>>("/reports", {
          params: {
            page,
            size,
          },
        });
  
        setData({
          ...data.payload,
          items: data.payload.items.map(report => ({
            id: report.id,
            key: report.id,
            goal: report.goal,
            name: report.name,
            total: report.total,
            creator: {name: report.creator.name},
            approver: {name: report.approver.name},
            status: report.status,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt
          }))
        });
      } catch (err: any) {
        errorHandler(err);
      }
    }
  
    React.useEffect(() => {
      fetchReports(1);
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
            <Button variant="default" className="text-sm font-bold" onClick={() => navigate("/reports/new")}>Criar +</Button>
          </div>

          <div className="p-4">
            <TableComponent 
              resource="reports"
              data={data}
              columnHeaders={['Nome', 'Objetivo', 'Status', 'Criador', 'Aprovador', 'Total']}
              onPageChange={fetchReports}
            />
          </div>
        </div>
        <Toaster />
        </>
    )
}