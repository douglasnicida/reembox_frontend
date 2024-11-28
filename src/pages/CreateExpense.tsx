'use client'

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
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ExpenseParams, Param } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import React from "react"
import { Response } from "@/types/response.type"
import UploadInput from "@/components/custom_components/UploadInput"
import { ExpenseFormSchema } from "@/schema/expense"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export default function CreateExpensePage() {
  const [costCenters, setCostCenters] = useState<Param[]>([]);
  const [projects, setProjects] = useState<Param[]>([]);
  const [categories, setCategories] = useState<Param[]>([]);
  const [reports, setReports] = useState<Param[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ExpenseFormSchema>>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      expenseDate: new Date(),
      value: 0,
      quantity: 1,
      notes: "",
    },
  })

  async function handleUploadFiles(file: File) {

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post("/upload/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return data.payload;
  }

  async function fetchParams() {
    try {
      const { data } = await api.get<Response<ExpenseParams>>("/expenses/params");

      setCostCenters(data.payload.costCenters)
      setProjects(data.payload.projects)
      setCategories(data.payload.categories)
      setReports(data.payload.reports)
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchParams();
  }, []);

  async function onSubmit(expense: z.infer<typeof ExpenseFormSchema>) {
    const receiptURLs: string[] = []
    const receiptIDs: number[] = []

    try {
      const { images, ...rest } = expense
      const formData = new FormData()

      for (const receipt of expense.images) {
        formData.append('receipts', receipt)
      }

      // Ver como recupera os Files do FileList
      for(let i=0 ; i<images.length ; i++) {
        // Recuperando File
        const file: File = images[i]

        // Fazer o upload no endpoint de upload
        const publicFileURL: string = await handleUploadFiles(file);
        
        //salvar todas as URLs geradas dentro de ReceiptsURL
        receiptURLs.push(publicFileURL)
      }

      // criando recibos sem vincular a uma despesa
      receiptURLs.forEach(async (url: string) => {
        const { data } = await api.post('/receipts/', {
          url,
        })

        receiptIDs.push(data.payload)
      })

      const newExpense = {
        ...rest,
        expenseDate: expense.expenseDate.toISOString()        
      }

      console.log(newExpense)

      // criando despesa
      const expenseID = await api.post('expenses', newExpense)

      // atribuindo aos recibos o ID da despesa
      receiptIDs.forEach(async (id: number) => {
        await api.patch(`/receipts/${id}`, {
          expenseId: expenseID.data.payload,
        })
      })

      toast({
        title: 'Sucesso!',
        description: 'Despesa criada com sucesso!',
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
                {/* Data da despesa */}
                <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Data da Despesa <span className="text-red-500">*</span></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-zinc-700 border-zinc-600 text-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "P")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Comprovante de Pagamento */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field: { onChange, value, ...fields } }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Comprovante de Pagamento <span className="text-red-500">*</span>
                      </FormLabel>
                    
                      <FormControl>
                        <UploadInput onChange={onChange}/>
                      </FormControl>

                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

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
                  {/* Relatório */}
                  <FormField
                    control={form.control}
                    name="reportId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Relatório</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione um relatório" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {reports.map((report) => (
                              <SelectItem 
                                key={report.id} 
                                value={String(report.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {report.param}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="w-60 bg-primary hover:bg-primary/90">
                    Criar Despesa
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