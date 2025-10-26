'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface PaginationControlsProps<T> {
  data: T[];
  itemsPerPage?: number;
  onPageChange?: (
    paginatedData: T[],
    currentPage: number,
    totalPages: number,
  ) => void;
  showInfo?: boolean;
  maxVisiblePages?: number;
  currentPage?: number;
  onCurrentPageChange?: (page: number) => void;
}

export function PaginationControls<T>({
  data,
  itemsPerPage = 10,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5,
  currentPage: controlledPage,
  onCurrentPageChange,
}: PaginationControlsProps<T>) {
  const [internalPage, setInternalPage] = useState(1);

  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const { totalPages, startIndex, endIndex, paginatedData } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, data.length);
    const paginated = data.slice(start, end);

    return {
      totalPages: total,
      startIndex: start,
      endIndex: end,
      paginatedData: paginated,
    };
  }, [data, itemsPerPage, currentPage]);

  useEffect(() => {
    if (!isControlled) {
      setInternalPage(1);
    }
  }, [data, isControlled]);

  useEffect(() => {
    onPageChange?.(paginatedData, currentPage, totalPages);
  }, [currentPage, totalPages, data.length]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (isControlled) {
        onCurrentPageChange?.(page);
      } else {
        setInternalPage(page);
      }
    },
    [isControlled, onCurrentPageChange],
  );

  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return [];

    const items = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [totalPages, currentPage, handlePageChange]);

  if (totalPages <= 1) {
    return showInfo ? (
      <div className="text-sm text-muted-foreground text-center">
        Showing all {data.length} items
      </div>
    ) : null;
  }

  return (
    <div className="space-y-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {paginationItems}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showInfo && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {startIndex + 1} to {endIndex} of {data.length} items
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
      )}
    </div>
  );
}
