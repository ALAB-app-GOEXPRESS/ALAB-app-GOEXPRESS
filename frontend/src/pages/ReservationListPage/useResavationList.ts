import { fetchReservations, type FetchReservationListResponse, type ReservationItem } from '@/api/ReservationListApi';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type UseReservationListReturn = {
  currentPage: number;
  totalPages: number;
  pageItems: Array<number | '...'>;

  setPageToQuery: (nextPage: number) => void;

  isLoading: boolean;
  apiErrorMessage: string;

  totalCount: number;
  pageResults: ReservationItem[];
};

function getPageItems(currentPage: number, totalPages: number): Array<number | '...'> {
  const items: Array<number | '...'> = [];

  if (totalPages <= 4) {
    for (let page = 1; page <= totalPages; page += 1) {
      items.push(page);
    }

    return items;
  }

  items.push(1);

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push('...');
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push('...');
  }

  items.push(totalPages);

  return items;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function useReservationList(size: number): UseReservationListReturn {
  const pageSize = size;

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    return parsePositiveInt(searchParams.get('page'), 1);
  }, [searchParams]);

  const offset = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const [isLoading, setIsLoading] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [totalCount, setTotalCount] = useState(0);
  const [pageResults, setPageResults] = useState<ReservationItem[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      try {
        await Promise.resolve();

        if (isCancelled) {
          return;
        }

        setIsLoading(true);
        setApiErrorMessage('');

        const response: FetchReservationListResponse = await fetchReservations(pageSize, offset);

        if (isCancelled) {
          return;
        }

        setTotalCount(response.totalCount);
        setPageResults(response.results);
        setIsLoading(false);
      } catch {
        if (isCancelled) {
          return;
        }

        setApiErrorMessage('予約情報の取得に失敗しました。時間をおいて再度お試しください。');
        setIsLoading(false);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [offset, pageSize]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const pageItems = useMemo(() => {
    return getPageItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const setPageToQuery = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(1, nextPage), totalPages);
    const next = new URLSearchParams(searchParams);

    next.set('page', String(clampedPage));

    setSearchParams(next);
  };
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');

    setSearchParams(next);

  return {
    currentPage,
    totalPages,
    pageItems,

    setPageToQuery,

    isLoading,
    apiErrorMessage,

    totalCount,
    pageResults,
  };
};