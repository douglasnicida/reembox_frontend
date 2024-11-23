'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dispatch, SetStateAction, useState } from "react"
import { Loader2 } from 'lucide-react'

import { Expense, ReportParam, ReportParams } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import React from "react"
import { Response } from "@/types/response.type"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { ReportFormSchema } from "@/schema/report"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleFormatDate } from "@/utils/handleDate"
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

interface DropdownMenuCheckboxesProps {
  expenses: any[],
  checkedExpenses: number[]
  setCheckedExpenses: Dispatch<SetStateAction<number[]>>
  form: any
}

export function DropdownMenuCheckboxes({
  expenses,
  checkedExpenses,
  setCheckedExpenses,
  form,
}: DropdownMenuCheckboxesProps) {
  const [open, setOpen] = React.useState(false); // Local state for controlling dropdown open/close

  return (
    <FormField control={form.control} name="expenseIDs" render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel className="text-white">Despesas</FormLabel>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-fit">Selecione as despesas do relatório</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white text-black">
            {expenses.map((expense) => {
              const isChecked = checkedExpenses.includes(expense.id);
              return (
                <DropdownMenuCheckboxItem
                  key={expense.id}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    setCheckedExpenses((prev) => {
                      if (checked) {
                        return [...prev, expense.id];
                      } else {
                        return prev.filter((id) => id !== expense.id);
                      }
                    });
                  }}
                >
                  {/* TODO: arrumar o expense category e o project */}
                  {`${handleFormatDate(expense.expenseDate)} - ${expense.category.description} - ${expense.project.name}`}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <FormMessage className="text-red-500" />
      </FormItem>
    )} />
  );
}

export default function CreateReportPage() {
  const [approvers, setApprovers] = useState<ReportParam[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [checkedExpenses, setCheckedExpenses] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      name: "RPT-",
      goal: "",
      expenseIDs: [],
    },
  })

  async function fetchParams() {
    try {
      const { data } = await api.get<Response<ReportParams>>("/reports/params");
      
      setApprovers(data.payload.approvers)
      setExpenses(data.payload.expenses)
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchParams();
  }, []);

  async function onSubmit(report: z.infer<typeof ReportFormSchema>) {

    try {
      
      // criando relatório
      await api.post('/reports/', {
        name: report.name,
        goal: report.goal,
        approverID: report.approverID,
        expensesIds: checkedExpenses,
      })

      toast({
        title: 'Sucesso!',
        description: 'Relatório criado com sucesso!',
      });

      navigate('/reports')
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

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          step="0.01"
                          className="bg-zinc-700 border-zinc-600 text-white"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Aprovador */}
                <FormField
                    control={form.control}
                    name="approverID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Aprovador <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione um aprovador para o relatório" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {approvers.map((approver) => (
                              <SelectItem 
                                key={approver.id} 
                                value={String(approver.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {approver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                
                </div>

                {/* Goal */}
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Objetivo <span className="text-red-500">*</span></FormLabel>
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

                {/* Despesas */}
                <DropdownMenuCheckboxes checkedExpenses={checkedExpenses} expenses={expenses} setCheckedExpenses={setCheckedExpenses} form={form}/>
                
                <div className="flex justify-end">
                  <Button type="submit" className="w-60 bg-primary hover:bg-primary/90">
                    Criar Relatório
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