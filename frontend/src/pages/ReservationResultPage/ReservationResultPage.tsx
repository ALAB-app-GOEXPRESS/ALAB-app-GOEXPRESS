import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StationNameMap } from '@/constants/Station';
import type { ReservationDetails } from '@/api/ReservationApi';
import { ReservationDetail } from './ReservationDetail';
import { ArrowLeft } from 'lucide-react';

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
          onClick={() => navigate('/reservation-list')}
        >
          予約一覧へ
        </Button>
      </div>
    </div>
  );
};

export const ReservationResultPage: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { reservationDetails } = (location.state || {}) as {
    reservationDetails?: ReservationDetails;
  };

  if (!reservationDetails) {
    return (
      <div className='min-h-[calc(100vh-64px)] bg-background'>
        <ErrorDisplay />
      </div>
    );
  }

  const { trainDetails, confirmedSeat, reservationDate, trackNumber } = reservationDetails;
  const departureStationCd = StationNameMap[trainDetails.departureStationCd];
  const arrivalStationCd = StationNameMap[trainDetails.arrivalStationCd];

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-md px-4 py-6'>
        <div className='mb-4 flex'>
          <Button
            variant='link'
            onClick={() => navigate('/reservation-list')}
            className='p-0 h-auto text-muted-foreground flex items-center gap-1'
          >
            <ArrowLeft className='h-4 w-4' />
            予約一覧へ
          </Button>
        </div>
        <ReservationDetail
          trainDetails={trainDetails}
          confirmedSeat={confirmedSeat}
          reservationDate={reservationDate}
          trackNumber={trackNumber}
          departureStationName={departureStationCd}
          arrivalStationName={arrivalStationCd}
        />
      </div>
    </div>
  );
};
