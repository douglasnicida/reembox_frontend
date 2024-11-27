import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { errorHandler } from "@/utils/errorHandler";
import { handleFormatDate } from "@/utils/handleDate";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { LoaderPinwheel, Search } from "lucide-react";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { translateStatus } from "@/utils/handleStatus";
import EmptyTable from "@/components/custom_components/EmptyTable";

const statusColors: { [key: string]: string } = {
  OPEN: "bg-yellow-300 text-yellow-700 hover:text-black",
  SUBMITTED: "bg-blue-500 text-white hover:text-black",
  REJECTED: "bg-red-500 text-white hover:text-black",
  APPROVED: "bg-green-500 text-white hover:text-black",
  PENDING_PROCESSING: "bg-orange-500 text-white hover:text-black",
  PROCESSING_ERROR: "bg-gray-500 text-white hover:text-black",
  PROCESSING_PAYMENT: "bg-purple-500 text-white hover:text-black",
};

interface ApprovalReportCardProps {
  report: any;
  navigate: NavigateFunction;
}

interface VerifyAndApproveDialogProps {
  reportStatus: string;
  currentReport: any;
}


export default function ApprovePage() {
  const [q, setQ] = React.useState("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const navigate = useNavigate()
  
    function VerifyAndApproveDialog({ reportStatus, currentReport }: VerifyAndApproveDialogProps) {
      
      async function handleApproval(approvedStatus: boolean) {
        const endpoint = (approvedStatus === true) ? `/reports/manager/approve/${currentReport.id}` : `/reports/approver/reject/${currentReport.id}`
    
        try {
          const response = await api.patch(endpoint)
          toast({
            title: 'Sucesso!',
            description: response.data.message,
          });
          setData((prev: any[]) => prev.filter((item: any) => item.id != currentReport.id))
        } catch(e: any) {
          toast({
            title: 'Erro ao aprovar!',
            description: e.message,
            variant: 'destructive'
          });
        }
      }
    
      return (
        <div className="absolute right-5 bottom-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className={`${reportStatus} cursor-pointer`}>{translateStatus(currentReport.status)}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja aprovar ou rejeitar este relatório?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não poderá ser desfeita a partir do momento em que for aprovado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {handleApproval(false)}}>Rejeitar</AlertDialogAction>
                <AlertDialogAction onClick={() => {handleApproval(true)}}>Aprovar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
    
    function ApprovalReportCard({report, navigate}: ApprovalReportCardProps) {
      const currentReport = report;
      const reportStatus = statusColors[currentReport.status];
    
      return (
        <Card className="w-[340px] h-[240px] relative">
          <OpenInNewWindowIcon className="h-5 w-5 absolute top-3 right-3 hover:scale-110 cursor-pointer" onClick={() => {navigate(`/reports/${currentReport.id}/details`);}} />
          <CardHeader>
            <CardTitle>{currentReport.name}</CardTitle>
            <CardDescription>{currentReport.goal}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2 text-sm relative h-auto">
            <p>Criador do relatório: {currentReport.creator}</p>
            <p>Data de criação: {handleFormatDate(currentReport.createdAt)}</p>
            <p>Total: <span>R$</span>{currentReport.total}</p>
          </CardContent>
          <CardFooter className="relative">
            <VerifyAndApproveDialog currentReport={currentReport} reportStatus={reportStatus} />
          </CardFooter>
        </Card>
      )
    }

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
      async function onRender() {
        setLoading(true)
        await fetchReportsToApprove();
        setLoading(false)
      }

      onRender()
    }, []);

    return (
        <>
        <div className="flex-1 overflow-auto h-screen w-full">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4 w-full">
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

          <div className="p-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-scroll overflow-x-hidden w-fit mx-auto">
            
            {
              loading ? (
                <div className="w-[calc(100vw-256px)] h-[calc(100vh-234px)] flex justify-center items-center">
                  <LoaderPinwheel className="animate-spin h-20 w-20" />
                </div>
              ) : data.length > 0 ? (
                data.map((report) => (
                  <ApprovalReportCard key={report.id} report={report} navigate={navigate} />
                ))
              ) : (
                <div className="w-[calc(100vw-256px)] h-[calc(100vh-354px)] flex justify-center items-center">
                  <EmptyTable />
                </div>
              )
            }

          </div>
          <Toaster />
        </div>
    </>
    );
}