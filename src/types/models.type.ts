enum ReportStatus {
    OPEN,
    SUBMITTED,
    REJECTED,
    APPROVED,
    PENDING_PROCESSING,
    PROCESSING_ERROR,
    PROCESSING_PAYMENT,
  }

export type Collaborator = {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    jobTitle: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type Customer = {
    id: number;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type Report = {
    id: number;
    code?: string;
    goal: string;
    name: string;
    total?: number;
    dueDate?: string;
    creator: {
        name: string;
    }
    approver: {
        name: string;
    }
    expenses: ReportExpense[]
    createdAt: string;
    updatedAt: string;
    status: ReportStatus
}

export type ReportTableItem = {
    id: number;
    key: number;
    goal: string;
    name: string;
    total?: number;
    creator: string;
    approver: string;
    createdAt: string;
    updatedAt: string;
    status: ReportStatus
}

export interface User {
    id: number,
    name: string,
    company: { 
        id: number,
        name: string 
    },
    ragApproval: boolean
}

export type ReportParam = {
    id: number;
    name: string;
}

export type ReportParams = {
    approvers: ReportParam[]
    expenses: Expense[]
}

export type ReportExpense = {
    expense: Expense;
    report: Report;
}

export type CostCenter = {
    id: number;
    code: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type ExpenseCategory = {
    id: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type JobTitle = {
    id: number;
    title: string;
    _count: number;
}

export type Project = {
    id: number;
    key: string;
    customer: {
        name: string;
    },
    name: string,
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type ProjectTableItem = {
    id: number;
    key: string;
    name: string,
    customerName: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export type Expense = {
    id: number,
    expenseDate: string,
    value: number,
    quantity: number,
    notes?: string,
    project: {
        key: string
    },
    costCenter: {
        code: string
    },
    category: {
        description: string
    }
}

export type ExpenseTableItem = {
    id: number,
    expenseDate: string,
    totalValue: number,
    projectKey: string
    costCenterCode: string
    categoryDescription: string
}

export type Param = {
    id: number;
    param: string;
  }

export type ExpenseParams = {
    costCenters: Param[];
    projects: Param[]
    categories: Param[];
    reports: Param[];
}

export type AllocationParams = {
    projects: Param[]
    users: Param[]
}

export type Allocation = {
    id: number,
    startDate: string,
    endDate: string,
    estimatedEndDate: string,
    project: {
        key: string,
        name: string
    }
    user: {
        id: number,
        name: string,
        jobTitle: {
            title: string,
        },
    },
}

export type MyAllocations = {
    id: number,
    startDate: string,
    estimatedEndDate: string,
    endDate: string,
    project: {
      name: string,
      key: string,
    },
    customer: {
      id: string,
      name: string,
    },
    // Filtra os usuários que não são o próprio usuário
    allocations: {
        id: string,
        name: string,
        jobTitle: string,
    }[]
}

export type GenericFilter = {
    q?: string
    active?: number
}