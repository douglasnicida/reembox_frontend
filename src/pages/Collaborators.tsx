import * as React from "react"
import TableComponent from "@/components/custom_components/TableComponent"
import { Collaborator } from "@/types/models.type"
import ActionsBar from "@/components/custom_components/ActionsBar"
// import Header from "@/components/custom_components/Header.tsx";
// import Sidebar from "@/components/custom_components/Sidebar"

const collaborators: Collaborator[] = [
  {
    name: "Breno Melo",
    cpf: "474.208.710-20",
    address: "Não cadastrado",
    email: "breno.jose@test.com",
    status: "Ativo"
  },
  {
    name: "Breno Melo Paes",
    cpf: "221.209.418-42",
    address: "Rua das Flores, 123",
    email: "paes@test.com",
    status: "Inativo"
  },
  {
    name: "Diego Gallego",
    cpf: "733.368.400-75",
    address: "Não cadastrado",
    email: "diego.gall@test.com",
    status: "Ativo"
  },
  {
    name: "admin teste",
    cpf: "911.204.473-59",
    address: "Avenida Principal, 456",
    email: "admin@test.com",
    status: "Ativo"
  },
  {
    name: "aldo catarina",
    cpf: "394.395.150-40",
    address: "Não cadastrado",
    email: "aldo.catar@test.com",
    status: "Inativo"
  },
  {
    name: "celio garcia",
    cpf: "053.722.830-66",
    address: "Praça Central, 789",
    email: "celio.gar@test.com",
    status: "Ativo"
  },
  {
    name: "gabriela muller pin",
    cpf: "505.877.890-58",
    address: "Não cadastrado",
    email: "gabriela.mul@test.com",
    status: "Ativo"
  }
]

export function Collaborators() {
  const [filteredCollaborators, setFilteredCollaborators] = React.useState<Collaborator[]>(collaborators)


  return (
    <>
      <div className="flex-1 overflow-auto">
      <ActionsBar />

        <div className="p-4">
          <TableComponent data={filteredCollaborators} columnHeaders={['Nome', 'Status', 'CPF', 'Endereço', 'Email']} />
        </div>

      </div>
    </>
  )
}