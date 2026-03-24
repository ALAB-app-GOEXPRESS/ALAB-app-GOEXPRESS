import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchTrains, type SeatClass, type TrainSearchResult, type TrainSearchParams } from '@/api/TrainListApi';
import { useQuery } from '@tanstack/react-query';
import { timeToMinutes } from '@/utils/dateTime';

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
  isInitialView: boolean;
  blGoToPrev: boolean;
  blGoToNext: boolean;
  setPageToQuery: (nextPage: number) => void;
  isLoading: boolean;
  apiErrorMessage: string;
  totalCount: number;
  pageResults: TrainSearchResult[];
};

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function getPageItems(currentPage: number, totalPages: number): Array<number | '...'> {
  const items: Array<number | '...'> = [];
  if (totalPages <= 4) {
    for (let page = 1; page <= totalPages; page += 1) items.push(page);
    return items;
  }
  items.push(1);
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);
  if (left > 2) items.push('...');
  for (let page = left; page <= right; page += 1) items.push(page);
  if (right < totalPages - 1) items.push('...');
  items.push(totalPages);
  return items;
}

export function useSearchResults(args: UseTrainResultsArgs): UseTrainResultsReturn {
  const { defaultParams, pageSize, seatClassFilterOptions } = args;
  const [searchParams, setSearchParams] = useSearchParams();
  const [seatClassFilter, setSeatClassFilter] = useState<SeatClassFilter>('all');
  const isInitialView = useMemo(() => !searchParams.has('page'), [searchParams]);
  const currentPage = useMemo(() => parsePositiveInt(searchParams.get('page'), 1), [searchParams]);

  const trainsQuery = useQuery({
    queryKey: ['between', defaultParams],
    queryFn: () => fetchTrains(defaultParams),
  });

  const allTrains = trainsQuery.data ?? [];

  const filteredTrains = useMemo(() => {
    if (seatClassFilter === 'all') return allTrains;
    return allTrains.filter((train) => {
      if (seatClassFilter === 'reserved') return train.seatAvailability.reserved > 0;
      if (seatClassFilter === 'green') return train.seatAvailability.green > 0;
      if (seatClassFilter === 'grandclass') return train.seatAvailability.grandclass > 0;
      return false;
    });
  }, [allTrains, seatClassFilter]);

  const totalCount = filteredTrains.length;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize]);

  const pageResults = useMemo(() => {
    if (!filteredTrains.length) return [];
    if (isInitialView) {
      const searchTimeInMinutes = timeToMinutes(defaultParams.time);
      const firstVisibleIndex = filteredTrains.findIndex(
        (train) => timeToMinutes(train.departureTime) >= searchTimeInMinutes,
      );
      if (firstVisibleIndex === -1) {
        if (totalCount <= pageSize) return filteredTrains;
        return filteredTrains.slice(totalCount - pageSize);
      }
      return filteredTrains.slice(firstVisibleIndex, firstVisibleIndex + pageSize);
    }
    if (currentPage === totalPages && totalCount > pageSize) {
      const startIndex = totalCount - pageSize;
      return filteredTrains.slice(startIndex);
    }
    const offset = (currentPage - 1) * pageSize;
    return filteredTrains.slice(offset, offset + pageSize);
  }, [filteredTrains, isInitialView, defaultParams.time, currentPage, totalPages, totalCount, pageSize]);

  const { blGoToPrev, blGoToNext } = useMemo(() => {
    if (!pageResults.length || filteredTrains.length <= pageSize) return { blGoToPrev: false, blGoToNext: false };
    const isFirstTrainVisible = pageResults[0]?.trainCd === filteredTrains[0]?.trainCd;
    const isLastTrainVisible =
      pageResults[pageResults.length - 1]?.trainCd === filteredTrains[filteredTrains.length - 1]?.trainCd;
    return { blGoToPrev: !isFirstTrainVisible, blGoToNext: !isLastTrainVisible };
  }, [pageResults, filteredTrains, pageSize]);

  const pageItems = useMemo(() => getPageItems(currentPage, totalPages), [currentPage, totalPages]);

  const setPageToQuery = (nextPage: number) => {
    let targetPage = nextPage;
    if (isInitialView) {
      const searchTimeInMinutes = timeToMinutes(defaultParams.time);
      const firstVisibleIndex = filteredTrains.findIndex(
        (train) => timeToMinutes(train.departureTime) >= searchTimeInMinutes,
      );
      const startIndex = firstVisibleIndex === -1 ? totalCount - pageSize : firstVisibleIndex;
      if (nextPage > 1) {
        const nextTrainIndex = startIndex + pageSize;
        targetPage = Math.floor(nextTrainIndex / pageSize) + 1;
      } else {
        const prevTrainIndex = startIndex - 1;
        if (prevTrainIndex < 0) targetPage = 1;
        else targetPage = Math.floor(prevTrainIndex / pageSize) + 1;
      }
    }
    const clampedPage = Math.min(Math.max(1, targetPage), totalPages > 0 ? totalPages : 1);
    const next = new URLSearchParams(searchParams);
    next.set('page', String(clampedPage));
    setSearchParams(next);
  };

  const isSeatClassFilter = (value: string): value is SeatClassFilter => {
    return seatClassFilterOptions.some((option) => option.value === value);
  };

  const handleSeatClassFilterChange = (value: string) => {
    if (!isSeatClassFilter(value)) return;
    setSeatClassFilter(value);
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');
    setSearchParams(next);
  };

  const isLoading = trainsQuery.isPending;
  const apiErrorMessage = trainsQuery.isError ? '検索に失敗しました。時間をおいて再度お試しください。' : '';

  return {
    seatClassFilter,
    handleSeatClassFilterChange,
    currentPage,
    totalPages,
    pageItems,
    isInitialView,
    blGoToPrev,
    blGoToNext,
    setPageToQuery,
    isLoading,
    apiErrorMessage,
    totalCount,
    pageResults,
  };
}
