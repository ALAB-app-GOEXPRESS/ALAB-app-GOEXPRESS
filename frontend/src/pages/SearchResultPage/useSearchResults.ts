import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchTrains, type SeatClass, type TrainResult, type TrainSearchParams } from '@/api/TrainListApi';
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

export function useSearchResults(args: UseTrainResultsArgs): UseTrainResultsReturn {
  const { defaultParams, pageSize, seatClassFilterOptions } = args;

  const [searchParams, setSearchParams] = useSearchParams();

  const [seatClassFilter, setSeatClassFilter] = useState<SeatClassFilter>('all');

  const isInitialView = useMemo(() => !searchParams.has('page'), [searchParams]);

  const currentPage = useMemo(() => {
    return parsePositiveInt(searchParams.get('page'), 1);
  }, [searchParams]);

  const trainsQuery = useQuery({ queryKey: ['between', defaultParams], queryFn: () => fetchTrains(defaultParams) });

  const allTrains = trainsQuery.data ?? [];
  const totalCount = allTrains.length;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const pageResults = useMemo(() => {
    if (!allTrains.length) {
      return [];
    }

    // 初期表示（URLにpageパラメータなし）の場合のロジック
    if (isInitialView) {
      const searchTimeInMinutes = timeToMinutes(defaultParams.time);
      const firstVisibleIndex = allTrains.findIndex(
        (train) => timeToMinutes(train.departureTime) >= searchTimeInMinutes,
      );

      // 指定時刻以降の列車が見つからない場合は、最終ページと同じ内容を表示
      if (firstVisibleIndex === -1) {
        if (totalCount <= pageSize) return allTrains;
        return allTrains.slice(totalCount - pageSize);
      }

      // 見つかった場合は、その列車を先頭に10件表示
      return allTrains.slice(firstVisibleIndex, firstVisibleIndex + pageSize);
    }

    // ページ移動後のロジック
    // 最終ページの場合
    if (currentPage === totalPages && totalCount > pageSize) {
      const startIndex = totalCount - pageSize;
      return allTrains.slice(startIndex);
    }
    // 通常のページ
    const offset = (currentPage - 1) * pageSize;
    return allTrains.slice(offset, offset + pageSize);
  }, [allTrains, isInitialView, defaultParams.time, currentPage, totalPages, totalCount, pageSize]);

  const { blGoToPrev, blGoToNext } = useMemo(() => {
    // 表示する列車がない、または全列車が1ページに収まる場合は、どちらのボタンも非活性
    if (!pageResults.length || allTrains.length <= pageSize) {
      return { blGoToPrev: false, blGoToNext: false };
    }

    // 表示されている最初の列車が、全体の最初の列車と同じかチェック
    const isFirstTrainVisible = pageResults[0]?.trainCd === allTrains[0]?.trainCd;

    // 表示されている最後の列車が、全体の最後の列車と同じかチェック
    const isLastTrainVisible =
      pageResults[pageResults.length - 1]?.trainCd === allTrains[allTrains.length - 1]?.trainCd;

    return {
      blGoToPrev: !isFirstTrainVisible, // 最初の列車が表示されていなければ「前へ」は押せる
      blGoToNext: !isLastTrainVisible, // 最後の列車が表示されていなければ「次へ」は押せる
    };
  }, [pageResults, allTrains, pageSize]);

  const pageItems = useMemo(() => {
    return getPageItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const setPageToQuery = (nextPage: number) => {
    let targetPage = nextPage;

    // 初期表示から初めてページ移動する場合のページ番号を計算
    if (isInitialView) {
      const searchTimeInMinutes = timeToMinutes(defaultParams.time);
      const firstVisibleIndex = allTrains.findIndex(
        (train) => timeToMinutes(train.departureTime) >= searchTimeInMinutes,
      );
      const startIndex = firstVisibleIndex === -1 ? totalCount - pageSize : firstVisibleIndex;

      if (nextPage > 1) {
        // 「次へ」ボタン
        const nextTrainIndex = startIndex + pageSize;
        targetPage = Math.floor(nextTrainIndex / pageSize) + 1;
      } else {
        // 「前へ」ボタン
        const prevTrainIndex = startIndex - 1;
        if (prevTrainIndex < 0) {
          targetPage = 1;
        } else {
          targetPage = Math.floor(prevTrainIndex / pageSize) + 1;
        }
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
    if (!isSeatClassFilter(value)) {
      return;
    }

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
