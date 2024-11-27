import api from "@/api/axios";
import { handleFormatDate } from "@/utils/handleDate";
import React from "react";
import { useParams } from "react-router-dom";

const ReportDetailsPage = () => {
    const { id } = useParams();
    const [report, setReport] = React.useState<any>({});
    const [expenses, setExpenses] = React.useState<any[]>([]);
    const [expandedImage, setExpandedImage] = React.useState<string | null>(null);

    const existingExpenseIds = new Set(expenses.map(exp => exp.id));
    React.useEffect(() => {
        const fetchExpenses = async () => {
            const { data } = await api.get(`/reports/${id}`);
            setReport(data.payload);


            for (const expense of data.payload.expenses) {
                const currentExpense = expense.expense;
                const fullExpense = await api.get(`/expenses/${currentExpense.id}`);

                if (!existingExpenseIds.has(currentExpense.id)) {
                    setExpenses(prev => [...prev, fullExpense.data.payload]);
                    existingExpenseIds.add(currentExpense.id);
                }
            }
        };

        fetchExpenses();
    }, [id]);

    const handleImageClick = (url: string) => {
        setExpandedImage(url);
    };

    const handleClose = () => {
        setExpandedImage(null);
    };

    return ( 
        <div className="flex-1 overflow-auto h-screen">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">
                <div className="relative flex-1">
                    {/* Título ou cabeçalho pode ser adicionado aqui */}
                </div>
            </div>

            <div className="p-10">
                <h2 className="text-2xl font-bold mb-4">{`${report.code} - ${report.name}`}</h2>
                <p><span className="font-bold">Objetivo:</span> {report.goal}</p>
                <p><span className="font-bold">Total:</span> R${report.total}</p>
                <p className="mt-3"><span className="font-bold">Criado em:</span>  {handleFormatDate(report.createdAt)}</p>
                <p><span className="font-bold">Atualizado em:</span>  {handleFormatDate(report.updatedAt)}</p>
            </div>

            <div className="p-9 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-scroll">
                {
                    expenses.map((expense) => {
                        return (
                            <div key={expense.id} className="bg-zinc-800 p-4 rounded-md">
                                <h2 className="text-lg font-bold">{expense.name}</h2>
                                <p>Quantidade: {expense.quantity}</p>
                                <p>Valor: {expense.value}</p>
                                <p>Data da despesa: {handleFormatDate(expense.expenseDate)}</p>
                                <div className="flex flex-col justify-between gap-4">
                                    <p>Recebimentos:</p>
                                    <ul className="flex gap-2">
                                        {expense.receipts.map((receipt: any) => (
                                            <li key={receipt.id + 10}>
                                                <img 
                                                    src={receipt.url} 
                                                    alt="" 
                                                    onClick={() => handleImageClick(receipt.url)} 
                                                    className="cursor-pointer w-60 h-60 object-cover" // Ajuste o tamanho da imagem conforme necessário
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {expandedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center" onClick={handleClose}>
                    <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full" />
                </div>
            )}
        </div>
    );
}

export default ReportDetailsPage;