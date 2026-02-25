import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { fetchTrainDetail } from '@/api/TrainDetailApi';
import { formatJapaneseDate } from '@/utils/dateTime';
import { ArrowLeft, MapPin, TramFront, Loader2 } from 'lucide-react';
import { specifyTrainTypeIconColor } from '@/utils/train';
import { SeatClassCard } from './SeatClassCard';

import type { TrainDetailResult } from '@/api/TrainDetailApi';
import type { StationCode } from '@/api/TrainListApi';

export const TrainDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { trainCd, searchParams } = (location.state || {}) as {
    trainCd?: string;
    searchParams?: { from: StationCode; to: StationCode; date: string };
  };

  const [trainDetail, setTrainDetail] = useState<TrainDetailResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainCd || !searchParams) {
      setError('列車情報の取得に必要なパラメータが不足しています。');
      setIsLoading(false);
      return;
    }

    const loadTrainDetail = async () => {
      try {
        setIsLoading(true);
        const params = {
          trainCd,
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date,
        };
        const data = await fetchTrainDetail(params);
        setTrainDetail(data);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : '列車の詳細情報の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainDetail();
  }, [trainCd, searchParams]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center items-center'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <p>詳細情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error || !trainDetail) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
        <div className='mx-auto max-w-4xl'>
          <Button
            variant='link'
            onClick={() => navigate(-1)}
            className='-ml-4 p-0 text-muted-foreground'
          >
            <ArrowLeft className='mr-1 h-4 w-4' />
            検索結果へ戻る
          </Button>
          <Alert
            variant='destructive'
            className='mt-4'
          >
            <AlertTitle>{error || '列車情報が見つかりませんでした。'}</AlertTitle>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='mx-auto max-w-4xl'>
        <Button
          variant='link'
          onClick={() => navigate(-1)}
          className='-ml-4 p-0 text-muted-foreground'
        >
          <ArrowLeft className='mr-1 h-4 w-4' />
          検索結果へ戻る
        </Button>

        <div className='mt-4 rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <TramFront
              className={`${specifyTrainTypeIconColor(trainDetail.trainTypeName)} text-white text-[30px] rounded-sm`}
            />
            <div>
              <h1 className='text-2xl font-bold'>
                {trainDetail.trainTypeName} {trainDetail.trainNumber}
              </h1>
              <p className='text-muted-foreground'>
                {trainDetail.departureStationName} → {trainDetail.arrivalStationName}
              </p>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>出発</p>
              <p className='text-4xl font-bold'>{trainDetail.departureTime}</p>
              <div className='mt-1 flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span>{trainDetail.departureStationName}</span>
              </div>
              <p className='mt-1 text-sm text-muted-foreground'>{formatJapaneseDate(trainDetail.date)}</p>
              {trainDetail.trackNumber && (
                <p className='mt-1 text-sm text-muted-foreground'>{trainDetail.trackNumber}番線</p>
              )}
            </div>
            <div className='text-left'>
              <p className='text-sm text-muted-foreground'>到着</p>
              <p className='text-4xl font-bold'>{trainDetail.arrivalTime}</p>
              <div className='mt-1 flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span>{trainDetail.arrivalStationName}</span>
              </div>
              <p className='mt-1 text-sm text-muted-foreground'>{formatJapaneseDate(trainDetail.date)}</p>
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='text-lg font-semibold'>空席状況</h2>
            <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              {trainDetail.seatClasses.map((seatInfo) => (
                <SeatClassCard
                  key={seatInfo.type}
                  seatInfo={seatInfo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
