/**
 * usePagination Hook
 *
 * Custom hook for managing pagination state
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '@/core/constants';

export interface PaginationState {
  page: number;
  pageSize: number;
  totalRecords: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  search?: string;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalRecords: (total: number) => void;
  setSort: (field: string, direction: 'ASC' | 'DESC') => void;
  setSearch: (search: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reset: () => void;
}

export interface PaginationInfo {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startRecord: number;
  endRecord: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions, PaginationInfo {
  paginationParams: {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    search?: string;
  };
}

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDirection?: 'ASC' | 'DESC';
  initialSearch?: string;
  totalRecords?: number;
}

/**
 * Hook for managing pagination state and navigation
 */
export const usePagination = (
  options: UsePaginationOptions = {}
): UsePaginationReturn => {
  const {
    initialPage = 1,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    initialSortBy,
    initialSortDirection = 'DESC',
    initialSearch = '',
    totalRecords: initialTotal = 0,
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalRecords, setTotalRecordsState] = useState(initialTotal);
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(
    initialSortDirection
  );
  const [search, setSearchState] = useState(initialSearch);

  // Computed values
  const totalPages = useMemo(
    () => Math.ceil(totalRecords / pageSize) || 1,
    [totalRecords, pageSize]
  );

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);
  const isFirstPage = useMemo(() => page === 1, [page]);
  const isLastPage = useMemo(() => page === totalPages, [page, totalPages]);

  const startRecord = useMemo(
    () => (totalRecords === 0 ? 0 : (page - 1) * pageSize + 1),
    [page, pageSize, totalRecords]
  );

  const endRecord = useMemo(
    () => Math.min(page * pageSize, totalRecords),
    [page, pageSize, totalRecords]
  );

  // Actions
  const setPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPageState(validPage);
    },
    [totalPages]
  );

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      // Reset to first page when page size changes
      setPageState(1);
    },
    []
  );

  const setTotalRecords = useCallback((total: number) => {
    setTotalRecordsState(total);
  }, []);

  const setSort = useCallback((field: string, direction: 'ASC' | 'DESC') => {
    setSortBy(field);
    setSortDirection(direction);
    // Reset to first page when sort changes
    setPageState(1);
  }, []);

  const setSearch = useCallback((searchTerm: string) => {
    setSearchState(searchTerm);
    // Reset to first page when search changes
    setPageState(1);
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPageState((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const firstPage = useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
    setSortBy(initialSortBy);
    setSortDirection(initialSortDirection);
    setSearchState(initialSearch);
  }, [initialPage, initialPageSize, initialSortBy, initialSortDirection, initialSearch]);

  // Params for API calls
  const paginationParams = useMemo(
    () => ({
      page,
      pageSize,
      sortBy,
      sortDirection,
      search: search || undefined,
    }),
    [page, pageSize, sortBy, sortDirection, search]
  );

  return {
    // State
    page,
    pageSize,
    totalRecords,
    sortBy,
    sortDirection,
    search,
    // Actions
    setPage,
    setPageSize,
    setTotalRecords,
    setSort,
    setSearch,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,
    // Info
    totalPages,
    hasNextPage,
    hasPrevPage,
    startRecord,
    endRecord,
    isFirstPage,
    isLastPage,
    // Params
    paginationParams,
  };
};

/**
 * Hook for PrimeReact DataTable pagination
 * Returns props compatible with PrimeReact DataTable
 */
export const usePrimeTablePagination = (options: UsePaginationOptions = {}) => {
  const pagination = usePagination(options);

  const onPage = useCallback(
    (event: { first: number; rows: number }) => {
      const newPage = Math.floor(event.first / event.rows) + 1;
      pagination.setPage(newPage);
      if (event.rows !== pagination.pageSize) {
        pagination.setPageSize(event.rows);
      }
    },
    [pagination]
  );

  const onSort = useCallback(
    (event: { sortField?: string; sortOrder?: 0 | 1 | -1 | null | undefined }) => {
      if (event.sortField && event.sortOrder !== null && event.sortOrder !== undefined && event.sortOrder !== 0) {
        pagination.setSort(
          event.sortField,
          event.sortOrder === 1 ? 'ASC' : 'DESC'
        );
      }
    },
    [pagination]
  );

  return {
    ...pagination,
    // PrimeReact DataTable props
    first: (pagination.page - 1) * pagination.pageSize,
    rows: pagination.pageSize,
    totalRecords: pagination.totalRecords,
    onPage,
    onSort,
    sortField: pagination.sortBy,
    sortOrder: pagination.sortDirection === 'ASC' ? 1 : -1,
    paginator: true,
    rowsPerPageOptions: PAGINATION.PAGE_SIZE_OPTIONS,
    paginatorTemplate:
      'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    currentPageReportTemplate: `Showing {first} to {last} of {totalRecords} entries`,
  };
};
