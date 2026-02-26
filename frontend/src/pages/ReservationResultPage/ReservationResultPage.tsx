import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stationNameMap } from '@/api/TrainListApi';
import type { ReservationDetails } from '@/api/reservationApi';
import { ReservationDetail } from './ReservationDetail';

const ErrorDisplay: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-6'>
      <h1 className='text-2xl font-bold'>エラー</h1>
      <Card className='mt-6'>
        <CardContent className='p-6'>
          <p>予約処理に失敗しました。お手数ですが、前の画面から再度操作をしてください。</p>
        </CardContent>
      </Card>
      <div className='mt-6'>
        <Button
          variant='outline'
          onClick={() => navigate(-1)}
        >
          前の画面に戻る
        </Button>
      </div>
    </div>
  );
};

export const ReservationResultPage: React.FC = () => {
  const location = useLocation();

  const { reservationDetails } = (location.state || {}) as {
    reservationDetails?: ReservationDetails;
  };
  [];

  if (!reservationDetails) {
    return (
      <div className='min-h-[calc(100vh-64px)] bg-background'>
        <ErrorDisplay />
      </div>
    );
  }

  const { trainDetails, confirmedSeat, reservationDate, trackNumber } = reservationDetails;
  const departureStationCd = stationNameMap[trainDetails.departureStationCd];
  const arrivalStationCd = stationNameMap[trainDetails.arrivalStationCd];

  return (
    <ReservationDetail
      trainDetails={trainDetails}
      confirmedSeat={confirmedSeat}
      reservationDate={reservationDate}
      trackNumber={trackNumber}
      departureStationName={departureStationCd}
      arrivalStationName={arrivalStationCd}
    />
  );
};
