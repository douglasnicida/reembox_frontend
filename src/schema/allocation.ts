import { z } from 'zod';

export const AllocationSchema = z.object({
  userId: z
    .number()
    .int({ message: 'O ID do usuário deve ser um número inteiro.' })
    .positive({ message: 'O ID do usuário deve ser um número positivo.' })
    .min(1, { message: 'O ID do usuário é obrigatório.' }),

  startDate: z
    .date({ message: 'A data de início deve ser uma data válida.' })
    .refine(date => !isNaN(date.getTime()), { message: 'A data de início é obrigatória.' }),

  estimatedEndDate: z
    .date({ message: 'A data estimada de término deve ser uma data válida.' })
    .refine(date => !isNaN(date.getTime()), { message: 'A data estimada de término é obrigatória.' }),

  projectId: z
    .number()
    .int({ message: 'O ID do projeto deve ser um número inteiro.' })
    .positive({ message: 'O ID do projeto deve ser um número positivo.' })
    .min(1, { message: 'O ID do projeto é obrigatório.' }),
});