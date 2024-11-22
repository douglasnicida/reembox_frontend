
import api from "@/api/axios";
import React from "react";
import { useParams } from "react-router-dom";

const ReportDetailsPage = () => {
    // const [q, setQ] = React.useState("");
    // const [data, setData] = React.useState<any[]>([]);

    const { id } = useParams()
    const [report, setReport] = React.useState<any>({})
    const [receipts, setReceipts] = React.useState<any[]>([])

    

    React.useEffect(() => {

        async function fetchData() {
            const { data } = await api.get(`/reports/${id}`);
            setReport(data.payload)

            // TODO: pegar recibos de cada despesa para visualizar nos detalhes, e nessa tela poderá adicionar mais despesas 
            //(criar outra tela cópia da tabela despesas com checkbox na primeira coluna)
            data.payload.expenses.forEach(async (expense: any) => {
                const currentExpense = expense.expense;
                const fullExpense = await api.get(`/expenses/${currentExpense.id}`)
                console.log(fullExpense.data.payload)
                setReceipts((prev) => [...prev, fullExpense.data.payload])

            })
        }


        fetchData()
    }, [id])

    return ( 
        <div className="flex-1 overflow-auto h-screen">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">
                <div className="relative flex-1">
                
                </div>

                <div className="p-9 grid grid-cols-1 xl:grid-cols-3 gap-5 overflow-y-scroll">

                </div>

            </div>
        </div>
     );
}
 
export default ReportDetailsPage;