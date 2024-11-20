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
    creator: {
        name: string;
    }
    approver: {
        name: string;
    }
    createdAt: string;
    updatedAt: string;
    status: ReportStatus
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

export type ExpenseParam = {
    id: number;
    param: string;
  }

export type ExpenseParams = {
    costCenters: ExpenseParam[];
    projects: ExpenseParam[]
    categories: ExpenseParam[];
    reports: ExpenseParam[];
}

export type GenericFilter = {
    q?: string
    active?: number
}