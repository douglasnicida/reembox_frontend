import { useState } from "react";
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Paginated } from "@/types/response.type";

type PaginationProps<T> = {
  data: Paginated<T>;
  onPageChange: (page: number) => void;
};

export function Pagination<T>({ data, onPageChange }: PaginationProps<T>) {
  const { totalPages, currentPage } = data.payload;
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    if (page !== activePage && page > 0 && page <= totalPages) {
      setActivePage(page);
      onPageChange(page);
    }
  };

  return (
    <UiPagination className="mr-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(activePage - 1)}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === activePage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 5 && <PaginationEllipsis />}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(activePage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
}
