export type Paginated<T> = {
    status: number;
    message: string;
    payload: {
        items: Array<T>;
        totalItems: number;
        totalPages: number;
        currentPage: number;
        size: number;
    },
 }