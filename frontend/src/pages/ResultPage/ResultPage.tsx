import React, { useMemo, useState } from 'react';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Clock } from 'lucide-react';
import { nowHHMM, todayYYYYMMDD } from '@/utils/date';

import { stationNameMap, type SeatClass, type TrainSearchParams } from '@/api/mockTrainApi';

import { useTrainResults } from './useTrainResults';

import { TrainCard } from './TrainCard';

type SeatClassFilter = 'all' | SeatClass;

const seatClassFilterOptions = [
  { value: 'all', label: '全クラス' },
  { value: 'reserved', label: '指定席' },
  { value: 'green', label: 'グリーン' },
  { value: 'grandclass', label: 'グランクラス' },
] as const;

export const ResultPage: React.FC = () => {
  const defaultParams = useMemo<TrainSearchParams>(() => {
    return {
      from: '01',
      to: '02',
      date: todayYYYYMMDD(),
      time: nowHHMM(),
    };
  }, []);

  const [paramsUi, setParamsUi] = useState<TrainSearchParams>(defaultParams);

  const pageSize = 10;

  const {
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
  } = useTrainResults({
    defaultParams,
    pageSize,
    seatClassFilterOptions: seatClassFilterOptions as ReadonlyArray<{
      value: SeatClassFilter;
      label: string;
    }>,
  });

  const departureStationName = stationNameMap[defaultParams.from];
  const arrivalStationName = stationNameMap[defaultParams.to];

  const handleMockReseacrhClick = () => {
    alert('（モック）日時指定：現状は見た目だけで、検索処理・API再呼び出しはしません');
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-3xl px-4 py-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <div className='text-lg font-bold'>
              {departureStationName} → {arrivalStationName}
            </div>
            <div className='text-muted-foreground'>
              <Clock className='inline-block h-4 w-4 translate-y-[-1px]' />
            </div>
          </div>
        </div>

        <Card className='mt-4 border-muted/60 shadow-sm'>
          <CardContent className='p-4'>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end'>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='date'>出発日</Label>
                  <Input
                    id='date'
                    type='date'
                    value={paramsUi.date}
                    onChange={(event) => {
                      setParamsUi((prev) => {
                        return { ...prev, date: event.target.value };
                      });
                    }}
                    className='bg-background'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='time'>出発時刻</Label>
                  <Input
                    id='time'
                    type='time'
                    value={paramsUi.time}
                    onChange={(event) => {
                      setParamsUi((prev) => {
                        return { ...prev, time: event.target.value };
                      });
                    }}
                    className='bg-background'
                  />
                </div>
              </div>

              <Button
                type='button'
                className='h-10 bg-emerald-600 text-white hover:bg-emerald-700'
                onClick={handleMockReseacrhClick}
              >
                日時指定
              </Button>
            </div>

            <Separator className='my-4' />

            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div className='w-full md:max-w-[260px] space-y-1.5'>
                <Label>クラス</Label>
                <Select
                  value={seatClassFilter}
                  onValueChange={handleSeatClassFilterChange}
                >
                  <SelectTrigger className='bg-muted/40'>
                    <SelectValue placeholder='全クラス' />
                  </SelectTrigger>
                  <SelectContent>
                    {seatClassFilterOptions.map((option) => {
                      return (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className='text-sm text-muted-foreground'>
                {isLoading ? '検索中...' : `${totalCount}件の列車が見つかりました（表示 ${pageResults.length} 件）`}
              </div>
            </div>
          </CardContent>
        </Card>

        {apiErrorMessage && (
          <div className='mt-4'>
            <Alert variant='destructive'>
              <AlertTitle>{apiErrorMessage}</AlertTitle>
            </Alert>
          </div>
        )}

        <div className='mt-4 space-y-3'>
          {isLoading && (
            <Card className='border-muted/60'>
              <CardContent className='p-4 text-sm text-muted-foreground'>読み込み中...</CardContent>
            </Card>
          )}

          {!isLoading &&
            pageResults.map((result) => {
              const departureName = stationNameMap[result.departureStationCd];
              const arrivalName = stationNameMap[result.arrivalStationCd];

              return (
                <TrainCard
                  key={result.trainCd}
                  trainTypeName={result.trainTypeName}
                  trainNumber={result.trainNumber}
                  departureTime={result.departureTime}
                  arrivalTime={result.arrivalTime}
                  departureStation={departureName}
                  arrivalStation={arrivalName}
                  reservedSeats={result.remainSeatNumber.reserved}
                  greenSeats={result.remainSeatNumber.green}
                  grandclassSeats={result.remainSeatNumber.grandclass}
                  onClickDetail={() => {
                    alert(`（モック）詳細: ${result.trainTypeName} ${result.departureTime} 発`);
                  }}
                />
              );
            })}

          {!isLoading && pageResults.length === 0 && !apiErrorMessage && (
            <Card className='border-muted/60'>
              <CardContent className='p-4 text-sm text-muted-foreground'>
                条件に一致する列車が見つかりませんでした。
              </CardContent>
            </Card>
          )}
        </div>

        <div className='mt-6 flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={currentPage <= 1}
            onClick={() => setPageToQuery(currentPage - 1)}
          >
            前へ
          </Button>

          {pageItems.map((item, index) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-2 text-sm text-muted-foreground'
                >
                  …
                </span>
              );
            }

            return (
              <Button
                key={item}
                size='sm'
                variant={item === currentPage ? 'default' : 'outline'}
                className={item === currentPage ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                onClick={() => setPageToQuery(item)}
              >
                {item}
              </Button>
            );
          })}

          <Button
            variant='outline'
            size='sm'
            disabled={currentPage >= totalPages}
            onClick={() => setPageToQuery(currentPage + 1)}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  );
};
