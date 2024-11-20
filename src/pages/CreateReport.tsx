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
import { useState } from "react"
import { Loader2 } from 'lucide-react'

import { Expense, ReportParams } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import React from "react"
import { Response } from "@/types/response.type"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { ReportFormSchema } from "@/schema/report"

export default function CreateReportPage() {
  const [approver, setApprover] = useState({});
  const [creator, setCreator] = useState({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      name: "RPT-",
      goal: ""
    },
  })

  async function fetchParams() {
    try {
      const { data } = await api.get<Response<ReportParams>>("/reports/params");
    // TODO: esses states devem conter as coisas para adicionar no dropdown (de acordo com os approver da empresa do usuario logado por exemplo)
      setCreator(data.payload.creator)
      setApprover(data.payload.approver)
      setExpenses(data.payload.expenses)
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchParams();
  }, []);

  async function onSubmit(report: z.infer<typeof ReportFormSchema>) {

    try {
      
      // criando despesa
      await api.post('/reports/', report)

      toast({
        title: 'Sucesso!',
        description: 'Despesa criada com sucesso!',
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