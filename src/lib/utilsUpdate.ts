import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dtoUpdateList = {
    dtos: {
      "update-customer": {
        description: "Preencha os campos abaixo para atualizar seu cliente.",
        fields: [
          {
            label: "Nome do Cliente",
            type: "text",
            apiReqKey: "name"
          },
          {
            label: "E-mail do Cliente",
            type: "email",
            apiReqKey: "email"
          },
          {
            label: "Telefone do Cliente",
            type: "tel",
            apiReqKey: "phone"
          }
        ], 
        req: '/customers/'
      },
      "update-cost-center": {
        description: "Preencha os campos abaixo para atualizar seu centro de custo.",
        fields: [
          {
            label: "Descrição",
            type: "textarea",
            apiReqKey: "description"
          },
          {
            label: "Ativo",
            type: "checkbox",
            apiReqKey: "active"
          }
        ],
        req: '/cost-centers/'
      }
    }
  }

export const routeValues = [
  "Login",
  "Início",
  "Relatórios",
  "Despesas",
  "Colaboradores",
  "Cargos",
  "Centros de Custo",
  "Tipos de Despesa",
  "Projetos",
  "Clientes",
  "Financeiro",
  "Aprovação",
  "Configurações"
];


