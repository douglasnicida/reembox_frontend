export type Paginated<T> = {
    payload: {
        items: Array<T>;
        totalItems: number;
        totalPages: number;
        currentPage: number;
        size: number;
    },
}