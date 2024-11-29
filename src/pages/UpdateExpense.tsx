import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { ExpenseParams, Param } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import React from "react"
import { Response } from "@/types/response.type"
import { ExpenseUpdateFormSchema } from "@/schema/expense"
import { toast } from "@/hooks/use-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2, XIcon } from "lucide-react"

export default function UpdateExpensePage() {
  const [costCenters, setCostCenters] = useState<Param[]>([]);
  const [projects, setProjects] = useState<Param[]>([]);
  const [categories, setCategories] = useState<Param[]>([]);
  const [reports, setReports] = useState<Param[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);


  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const { id } = useParams();

  // colocar como valores default os valores da requisição para achar um expense
  // atualizar o schema do update
  const form = useForm<z.infer<typeof ExpenseUpdateFormSchema>>({
    resolver: zodResolver(ExpenseUpdateFormSchema),
    defaultValues: {
      value: 0,
      quantity: 1,
      notes: "",
      categoryId: undefined,
      projectId: undefined,
      costCenterId: undefined,
    },
  })

  async function fetchParams() {
    try {
      const { data } = await api.get<Response<ExpenseParams>>("/expenses/params");
      setCostCenters(data.payload.costCenters)
      setProjects(data.payload.projects)
      setCategories(data.payload.categories)
      setReports(data.payload.reports)

      const receiptsResponse = await api.get(`/expenses/${id}`) 
      setReceipts(receiptsResponse.data.payload.receipts)
    } catch (err: any) {
      errorHandler(err);
    }
  }

  async function fetchCurrentExpenseParams() {
    try {
      const { data } = await api.get(`/expenses/${id}`);

      form.reset({
        value: data.payload.value,
        quantity: data.payload.quantity,
        notes: data.payload.notes,
        categoryId: data.payload.categoryId,
        projectId: data.payload.projectId,
        costCenterId: data.payload.costCenterId,
      });
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    async function fetchUseEffectAsync(){
      setIsLoading(true)
      await fetchParams()
      await fetchCurrentExpenseParams()
      setIsLoading(false)
    }

    fetchUseEffectAsync();
  }, []);

  async function onSubmit(expense: z.infer<typeof ExpenseUpdateFormSchema>) {

    try {
      const { receiptsId, ...expenseData } = expense
      const newExpense = {
        ...expenseData      
      }

      // atualizando despesa
      await api.put(`/expenses/${id}`, newExpense)

      //deletando recibos caso tenha algum selecionado
      await api.delete('/receipts/', {
        data: {
          receiptsId: receiptsId
        }
      })

      toast({
        title: 'Sucesso!',
        description: 'Despesa atualizada com sucesso!',
      });

      navigate('/expenses')
    } catch (err: any) {
      console.log(err);
      errorHandler(err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-zinc-900 overflow-y-scroll h-[calc(100vh-48px)]">
      <div className="flex-1 space-y-4 p-4 md:p-5 pt-6">
        <div className="grid gap-4 grid-cols-1">
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-4">Campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Valor */}
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Valor <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="bg-zinc-700 border-zinc-600 text-white"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-400">
                        Use vírgula como separador decimal
                      </FormDescription>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Quantidade */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Quantidade <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-zinc-700 border-zinc-600 text-white"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />
                </div>

                {/* Notas */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Notas</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="bg-zinc-700 border-zinc-600 text-white min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Centro de Custo */}
                  <FormField
                    control={form.control}
                    name="costCenterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Centro de Custo <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione um centro de custo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {costCenters.map((costCenter) => (
                              <SelectItem 
                                key={costCenter.id} 
                                value={String(costCenter.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {costCenter.param}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                  {/* Projeto */}
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Projeto <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {projects.map((project) => (
                              <SelectItem 
                                key={project.id} 
                                value={String(project.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {project.param}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categoria */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Categoria <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={String(category.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {category.param}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                   {/* Recibos */}
                  <FormField
                    control={form.control}
                    name="receiptsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Recibos</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            // Adiciona ou remove o valor selecionado do array
                            const currentValues = field.value || [];
                            if (currentValues.includes(value)) {
                              field.onChange(currentValues.filter((id) => id !== value));
                            } else {
                              field.onChange([...currentValues, value]);
                            }
                          }} 
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione todos recibos que deseja excluir da despesa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600 max-h-[450px]">
                            {receipts.map((receipt: any) => (
                              <SelectItem 
                                key={receipt.id} 
                                value={receipt.id}
                                className={`text-white hover:bg-zinc-700 mb-4
                                  ${field.value?.includes(receipt.id.toString()) ? 'border-[2px] border-red-700/40' : ''}`}
                              >
                                <div className="flex gap-x-5 items-center relative w-full">
                                {field.value?.includes(receipt.id.toString()) ? <div className="h-full w-[400px] bg-red-800/30 absolute" /> : ''}
                                  <img key={receipt.id} src={receipt.url} width={400} alt="" />
                                  <span className="text-red-600 font-bold">{field.value?.includes(receipt.id.toString()) ? <XIcon /> : ''}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="w-60 bg-primary hover:bg-primary/90">
                    Alterar Despesa
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}