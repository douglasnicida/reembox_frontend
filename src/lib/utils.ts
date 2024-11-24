import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dtoList = {
    dtos: {
      "create-company": {
        description: "Preencha os campos abaixo para criar sua empresa.",
        fields: [
          {
            label: "CNPJ",
            type: "text",
            apiReqKey: "cnpj"
          },
          {
            label: "Nome da Empresa",
            type: "text",
            apiReqKey: "name"
          },
          {
            label: "Website",
            type: "text",
            apiReqKey: "website"
          },
          {
            label: "Ano de Fundação",
            type: "text",
            apiReqKey: "founded_year"
          },
          {
            label: "Rua",
            type: "text",
            apiReqKey: "street"
          },
          {
            label: "Bairro",
            type: "text",
            apiReqKey: "neighbor"
          },
          {
            label: "Complemento",
            type: "number",
            apiReqKey: "complement"
          },
          {
            label: "Número",
            type: "number",
            apiReqKey: "number"
          },
          {
            label: "Cidade",
            type: "text",
            apiReqKey: "city"
          },
          {
            label: "Estado",
            type: "text",
            apiReqKey: "uf"
          },
          {
            label: "CEP",
            type: "text",
            apiReqKey: "cep"
          }
        ], 
        req: '/company/'
      },
      "create-cost-center": {
        description: "Preencha os campos abaixo para criar seu centro de custo.",
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
      "create-customer": {
        description: "Preencha os campos abaixo para criar seu cliente.",
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
      "create-expense-category": {
        description:"Preencha os campos abaixo para criar uma categoria de despesa.",
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
      "create-project": {
        description: "Preencha os campos abaixo para criar seu projeto.",
        fields: [
          {
            label: "Nome",
            type: "text",
            apiReqKey: "name"
          },
          {
            label: "Código",
            type: "text",
            apiReqKey: "key"
          },
          
        ]
      }
      // Exemplo para create-job-title:
      // ...
      // Exemplo para create-project:
      // ...
      // Exemplo para create-report:
      // ...
      // Exemplo para create-user:
      // ...
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


