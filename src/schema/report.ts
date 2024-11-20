import { z } from "zod"

const name = z
 .string({
    required_error: "Nome é obrigatório.",
 })
 .startsWith('RPT-', "O nome do relatório deve começar com RPT-")
 .min(6, "O nome deve ter pelo menos 6 caracteres.")

 const goal = z
 .string({
   required_error: "Objetivo do relatório é obrigatório.",
 })
 .min(5, "O nome deve ter pelo menos 5 caracteres.")
 .toUpperCase()

 const approverID = z
 .number({
required_error: "Aprovador é obrigatório",
invalid_type_error: "Aprovador deve ser um número"})
.int("Aprovador deve ser um ID numérico")
.positive("Aprovador deve ser um ID numérico")

const expenseIDs = z
.array(z.number().int().positive().optional())


export const ReportFormSchema = z.object({
  name,
  goal,
  approverID,
  expenseIDs
})