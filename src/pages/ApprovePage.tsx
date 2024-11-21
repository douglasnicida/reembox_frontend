import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Report } from "@/types/models.type";
import { errorHandler } from "@/utils/errorHandler";
import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const statusColors: { [key: string]: string } = {
  OPEN: "bg-yellow-300 text-yellow-700",
  SUBMITTED: "bg-blue-500 text-white",
  REJECTED: "bg-red-500 text-white",
  APPROVED: "bg-green-500 text-white",
  PENDING_PROCESSING: "bg-orange-500 text-white",
  PROCESSING_ERROR: "bg-gray-500 text-white",
  PROCESSING_PAYMENT: "bg-purple-500 text-white",
};

function ApprovalReportCard(report: any) {
  const currentReport = report.report;
  const reportStatus = statusColors[currentReport.status];

  return (
    <Card className="w-[340px] h-[240px]">
      <CardHeader>
        <CardTitle>Nome relatório</CardTitle>
        <CardDescription>Objetivo do relatório</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 text-sm relative h-auto">
        <p>Criador do relatório: {currentReport.creator}</p>
        <p>Data de criação: {currentReport.createdAt}</p>
        <p>Total: <span>R$</span>{currentReport.total}</p>
      </CardContent>
      <CardFooter className="relative">
        <Badge className={`${reportStatus} absolute right-5 bottom-0`}>Teste</Badge>
      </CardFooter>
    </Card>
  )
}

export default function ApprovePage() {
    const [q, setQ] = React.useState("");
    const [data, setData] = React.useState<any[]>([]);
  
    const navigate = useNavigate()
  
    async function fetchReportsToApprove() {
      try {
        //pegar todos os relatórios que ainda não foram aprovados se você for o aprovador dela
        const { data } = await api.get("/reports/reportsToApprove");
        
        data.payload.forEach((report: any) => {
          setData((prev) => {
            const exists = prev.some(item => item.id === report.id);
            if (!exists) {
              return [...prev, {
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
              }];
            }
            return prev;
          });
        })
      } catch (err: any) {
        errorHandler(err);
      }
    }
  
    React.useEffect(() => {
        fetchReportsToApprove();
    }, []);

    return (
        <>
        <div className="flex-1 overflow-auto h-screen">
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
            <Button variant="default" className="text-sm font-bold" onClick={() => {navigate("/reports/new");}}>Criar +</Button>
          </div>

          <div className="p-9 grid grid-cols-1 xl:grid-cols-3 gap-5 overflow-y-scroll ">
            
            {
              data.map((report: any) => {
                return(
                  <ApprovalReportCard key={report.id + Math.floor(Math.random() * 100)} report={report} />
                )
              })
            }

          </div>

        </div>
    </>
    );
}