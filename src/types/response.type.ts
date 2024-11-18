export type Paginated<T> = {
    items: Array<T>;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export type Response<T> = {
    status: number;
    message: string;
    payload: T;
}

export type PaginatedResponse<T> = {
    status: number;
    message: string;
    payload: Paginated<T>
}