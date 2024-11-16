export type Collaborator = {
    id?: number;
    name: string;
    cpf: string;
    email: string;
    status: string;
    address: string;
}

export type Customer = {
    id?: number;
    name: string;
    email: string;
    phone_number: string;
    status: boolean;
}

export type Report = {
    id?: number;
    goal: string;
}

export type CostCenter = {
    id: number;
    code: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}