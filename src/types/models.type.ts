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