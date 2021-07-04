import React, { useState } from "react";

interface PaginationParams {
  index: number;
  pageSize: number;
}

interface Pagination {
  index: number;
  pageSize: number;
  numberOfPages: number;
}

interface Page {
  index: number;
  startsAt: number;
  endsAt: number;
}

function usePaginatedState<T>({
  initialPagination,
  initialState,
}: {
  initialPagination?: Pagination;
  initialState?: Array<T>;
} = {}): [
  pagination: Pagination,
  setPagination: React.Dispatch<React.SetStateAction<PaginationParams>>,
  state: Array<T>,
  state: React.Dispatch<React.SetStateAction<Array<T>>>,
  pages: Page[]
] {
  const [pagination, setPagination] = useState<PaginationParams>(
    initialPagination || {
      index: 0,
      pageSize: 10,
    }
  );

  const [state, setState] = useState<Array<T>>(initialState || []);

  let arrayOffset = pagination.index * pagination.pageSize;

  let pages: Array<Page> = [];

  for (
    let pageIndex = 0;
    pageIndex * pagination.pageSize < state.length;
    pageIndex++
  ) {
    pages.push({
      index: pageIndex,
      startsAt: pageIndex * pagination.pageSize,
      endsAt: Math.min((pageIndex + 1) * pagination.pageSize, state.length),
    });
  }

  return [
    {
      ...pagination,
      numberOfPages: Math.ceil(state.length / pagination.pageSize),
    },
    setPagination,
    state.slice(arrayOffset, arrayOffset + pagination.pageSize),
    setState,
    pages,
  ];
}

export default usePaginatedState;
