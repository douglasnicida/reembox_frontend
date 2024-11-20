import { z } from "zod"

export const ExpenseFormSchema = z.object({
  expenseDate: z.date({
    required_error: "A data de criação é obrigatória",
  }),
  images: z
    //verificar se aqui é lista de files mesmo ou FileList
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Pelo menos um comprovante é obrigatório")
    .refine(
      (files) => {
        for (let i = 0; i < files?.length; i++) {
          const file = files[i]
          if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            return false
          }
        }
        return true
      },
      "Apenas imagens JPEG, JPG ou PNG são permitidas"
    ),
  value: z
    .number({
    required_error: "Valor é obrigatório",
    invalid_type_error: "Valor deve ser um número",
  })
    .positive("Valor deve ser um número positivo")
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "O valor deve ser um número decimal válido com até 4 casas decimais",
    }),
  quantity: z
    .number({
    required_error: "Quantidade é obrigatória",
    invalid_type_error: "Quantidade deve ser um número",
  })
    .int("Valor deve ser um número inteiro").positive("Valor deve ser um número positivo"),
  notes: z
    .string()
    .optional(),
  reportCode: z.string().optional(),
  costCenterId: z
    .number({
    required_error: "Centro de Custo é obrigatório",
    invalid_type_error: "Centro de Custo deve ser um número"})
    .int("Centro de Custo deve ser um ID numérico")
    .positive("Centro de Custo deve ser um ID numérico"),
  projectId: z
    .number({
    required_error: "Projeto é obrigatório",
    invalid_type_error: "Projeto deve ser um número",
  })
    .int("Projeto deve ser um ID numérico")
    .positive("Projeto deve ser um ID numérico"),
  categoryId: z
    .number({
    required_error: "Categoria da despesa é obrigatória",
    invalid_type_error: "Categoria deve ser um número",
  })
    .int("Categoria da despesa deve ser um ID numérico")
    .positive("Categoria da despesa deve ser um ID numérico"),
})