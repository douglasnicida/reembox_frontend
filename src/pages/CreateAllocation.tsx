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
import { useState } from "react"
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { AllocationParams, Param } from "@/types/models.type"
import api from "@/api/axios"
import { errorHandler } from "@/utils/errorHandler"
import React from "react"
import { Response } from "@/types/response.type"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { AllocationSchema } from "@/schema/allocation"

export default function CreateAllocationPage() {
  const [projects, setProjects] = useState<Param[]>([]);
  const [users, setUsers] = useState<Param[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof AllocationSchema>>({
    resolver: zodResolver(AllocationSchema),
    defaultValues: {
      userId: 0,
      startDate: new Date(),
      estimatedEndDate: new Date(),
      projectId: 0,
    },
  })

  async function fetchParams() {
    try {
      const { data } = await api.get<Response<AllocationParams>>("/allocations/params");

      setProjects(data.payload.projects)
      setUsers(data.payload.users)
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchParams();
  }, []);

  async function onSubmit(allocation: z.infer<typeof AllocationSchema>) {
    try {
      console.log({
        ...allocation,
        startDate: allocation.startDate.toISOString(),
        estimatedEndDate: allocation.estimatedEndDate.toISOString()
      });
      
      await api.post("/allocations", {
        ...allocation,
        startDate: allocation.startDate.toISOString(),
        estimatedEndDate: allocation.estimatedEndDate.toISOString()
      });

      toast({
        title: 'Sucesso!',
        description: 'Alocação criada com sucesso!',
      });

      navigate('/allocations')
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

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Data da início <span className="text-red-500">*</span></FormLabel>
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

                <FormField
                  control={form.control}
                  name="estimatedEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Data estimada de término <span className="text-red-500">*</span></FormLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Projeto <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))}  defaultValue={String(field.value)}>
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

                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Colaboradores <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))}  defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                              <SelectValue placeholder="Selecione um relatório" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-700 border-zinc-600">
                            {users.map((user) => (
                              <SelectItem 
                                key={user.id} 
                                value={String(user.id)}
                                className="text-white hover:bg-zinc-600"
                              >
                                {user.param}
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
                    Criar alocação
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