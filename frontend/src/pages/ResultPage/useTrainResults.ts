import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  fetchTrainsMock,
  type FetchTrainsResponse,
  type SeatClass,
  type TrainResult,
  type TrainSearchParams,
} from '@/api/mockTrainApi';

type SeatClassFilter = 'all' | SeatClass;

type UseTrainResultsArgs = {
  defaultParams: TrainSearchParams;
  pageSize: number;
  seatClassFilterOptions: ReadonlyArray<{ value: SeatClassFilter; label: string }>;
};

type UseTrainResultsReturn = {
  seatClassFilter: SeatClassFilter;
  handleSeatClassFilterChange: (value: string) => void;

  currentPage: number;
  totalPages: number;
  pageItems: Array<number | '...'>;

  setPageToQuery: (nextPage: number) => void;

  isLoading: boolean;
  apiErrorMessage: string;

  totalCount: number;
  pageResults: TrainResult[];
};

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

function getPageItems(currentPage: number, totalPages: number): Array<number | '...'> {
  const items: Array<number | '...'> = [];

  if (totalPages <= 7) {
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

function toSeatClass(value: SeatClassFilter): SeatClass | undefined {
  if (value === 'all') {
    return undefined;
  }

  return value;
}

export function useTrainResults(args: UseTrainResultsArgs): UseTrainResultsReturn {
  const { defaultParams, pageSize, seatClassFilterOptions } = args;

  const [searchParams, setSearchParams] = useSearchParams();

  const [seatClassFilter, setSeatClassFilter] = useState<SeatClassFilter>('all');

  const currentPage = useMemo(() => {
    return parsePositiveInt(searchParams.get('page'), 1);
  }, [searchParams]);

  const offset = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const seatClassForApi = useMemo(() => {
    return toSeatClass(seatClassFilter);
  }, [seatClassFilter]);

  const [isLoading, setIsLoading] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [totalCount, setTotalCount] = useState(0);
  const [pageResults, setPageResults] = useState<TrainResult[]>([]);

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

        const response: FetchTrainsResponse = await fetchTrainsMock(defaultParams, pageSize, offset, seatClassForApi);

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

        setApiErrorMessage('検索に失敗しました（モック）。時間をおいて再度お試しください。');
        setIsLoading(false);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [defaultParams, offset, pageSize, seatClassForApi]);

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

  const isSeatClassFilter = (value: string): value is SeatClassFilter => {
    return seatClassFilterOptions.some((option) => option.value === value);
  };

  const handleSeatClassFilterChange = (value: string) => {
    if (!isSeatClassFilter(value)) {
      return;
    }

    setSeatClassFilter(value);

    const next = new URLSearchParams(searchParams);
    next.set('page', '1');

    setSearchParams(next);
  };

  return {
    seatClassFilter,
    handleSeatClassFilterChange,

    currentPage,
    totalPages,
    pageItems,

    setPageToQuery,

    isLoading,
    apiErrorMessage,

    totalCount,
    pageResults,
  };
}
