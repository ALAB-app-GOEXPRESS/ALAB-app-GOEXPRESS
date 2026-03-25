import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type TrainSearchParams, type TrainSearchResult } from '@/api/TrainListApi';
import { useSearchResults } from './useSearchResults';
import { type SeatClass } from '@/utils/seat';
import { TrainCard } from './TrainCard';
import { StationNameMap } from '@/constants/Station';
import { TrainCardSkeleton } from './TrainCardSkeleton';

type SeatClassFilter = 'all' | SeatClass;

const seatClassFilterOptions = [
  { value: 'all', label: '全クラス' },
  { value: 'reserved', label: '指定席' },
  { value: 'green', label: 'グリーン' },
  { value: 'grandclass', label: 'グランクラス' },
] as const;

export const SearchResultPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const paramsFromQuery = useMemo<TrainSearchParams>(() => {
    return {
      from: searchParams.get('from')!,
      to: searchParams.get('to')!,
      date: searchParams.get('date')!,
      time: searchParams.get('time')!,
    } as TrainSearchParams;
  }, [searchParams]);

  const pageSize = 10;

  const { currentPage, setPageToQuery, isLoading, apiErrorMessage, pageResults, blGoToPrev, blGoToNext } =
    useSearchResults({
      defaultParams: paramsFromQuery,
      pageSize,
      seatClassFilterOptions: seatClassFilterOptions as ReadonlyArray<{
        value: SeatClassFilter;
        label: string;
      }>,
    });

  const departureStationName = StationNameMap[paramsFromQuery.from];
  const arrivalStationName = StationNameMap[paramsFromQuery.to];

  const handleDetailClick = async (train: TrainSearchResult) => {
    navigate('/train-detail', {
      state: {
        trainCd: train.trainCd,
        searchParams: {
          from: train.departureStationCd,
          to: train.arrivalStationCd,
          date: paramsFromQuery.date,
          time: train.departureTime,
        },
      },
    });
  };

  const PaginationButtons = () => (
    <div className='flex items-center justify-between'>
      <Button
        variant='outline'
        size='sm'
        disabled={!blGoToPrev}
        onClick={() => setPageToQuery(currentPage - 1)}
      >
        前へ
      </Button>
      <Button
        variant='outline'
        size='sm'
        disabled={!blGoToNext}
        onClick={() => setPageToQuery(currentPage + 1)}
      >
        次へ
      </Button>
    </div>
  );

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-4xl px-4 py-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <div className='text-[28px] font-bold'>
              {departureStationName} → {arrivalStationName}
            </div>
          </div>
        </div>

        {apiErrorMessage && (
          <div className='mt-4'>
            <Alert variant='destructive'>
              <AlertTitle>{apiErrorMessage}</AlertTitle>
            </Alert>
          </div>
        )}

        <div className='mt-4'>
          {isLoading && (
            <ul className='space-y-3'>
              {Array.from({ length: pageSize }).map((_, index) => (
                <li key={index}>
                  <TrainCardSkeleton />
                </li>
              ))}
            </ul>
          )}

          {!isLoading && pageResults.length === 0 && !apiErrorMessage && (
            <Card className='border-muted/60'>
              <CardContent className='p-4 text-sm text-muted-foreground'>
                条件に一致する列車が見つかりませんでした。
              </CardContent>
            </Card>
          )}

          {!isLoading && pageResults.length > 0 && (
            <div className='space-y-4'>
              <PaginationButtons />

              <ul className='space-y-3'>
                {pageResults.map((result) => {
                  const departureName = StationNameMap[result.departureStationCd];
                  const arrivalName = StationNameMap[result.arrivalStationCd];

                  return (
                    <li key={result.trainCd}>
                      <TrainCard
                        trainTypeName={result.trainTypeName}
                        trainNumber={result.trainNumber}
                        departureTime={result.departureTime}
                        arrivalTime={result.arrivalTime}
                        departureStation={departureName}
                        arrivalStation={arrivalName}
                        seatAvailability={result.seatAvailability}
                        onClickDetail={() => handleDetailClick(result)}
                      />
                    </li>
                  );
                })}
              </ul>

              <PaginationButtons />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
