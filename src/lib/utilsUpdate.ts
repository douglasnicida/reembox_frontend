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
      },
      "update-expense-category": {
        description:"Preencha os campos abaixo para atualizar uma categoria de despesa.",
        fields:[
          {
            label:"Descrição",
            type:"textarea",
            apiReqKey: "description"
          },
          {
            label:"Ativo",
            type:"checkbox",
            apiReqKey: "active"
          }
        ],
        req: '/expense-categories/'
      },
      "update-job-title": {
        description:"Preencha os campos abaixo para atualizar um cargo.",
        fields:[
          {
            label:"Cargo",
            type:"textarea",
            apiReqKey: "title"
          },
        ],
        req: '/job-titles/'
      },
      "update-project": {
        description:"Preencha os campos abaixo para atualizar um projeto.",
        fields:[
          {
            label:"Nome",
            type:"textarea",
            apiReqKey: "name"
          },
          {
            label:"Chave do projeto",
            type:"textarea",
            apiReqKey: "key"
          },
          {
            label:"ID do cliente",
            type:"number",
            apiReqKey: "customerId"
          },
        ],
        req: '/projects/'
      },
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


