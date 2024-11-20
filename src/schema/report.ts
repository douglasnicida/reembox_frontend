import { z } from "zod"

const name = z
 .string({
    required_error: "Nome é obrigatório.",
 })
 .startsWith('RPT-', "O nome do relatório deve começar com RPT-")

 const goal = z
 .string({
    required_error: "Objetivo do relatório é obrigatório.",
 })


export const ReportFormSchema = z.object({
  name,
  goal
})