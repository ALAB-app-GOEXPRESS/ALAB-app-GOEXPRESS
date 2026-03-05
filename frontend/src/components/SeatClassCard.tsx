import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { useNavigate } from 'react-router-dom';
import type { StationCode } from '@/types/Station';
import type { SeatClassDetail, TrainDetailResult } from '@/api/TrainDetailApi';
import { useSeatMap } from '@/pages/SeatMapPage/useSeatMap';

export const SeatClassCard: React.FC<{
  seatInfo: SeatClassDetail;
  onClickReservation: () => void;
  isReserving: boolean;
  trainDetail: TrainDetailResult;
  searchParams?: { from: StationCode; to: StationCode; date: string };
}> = ({ seatInfo, onClickReservation, isReserving, trainDetail, searchParams }) => {
  const navigate = useNavigate();

  const { reservedSeats, isLoading, apiErrorMessage } = useSeatMap({
    trainCd: trainDetail.trainCd,
    departureDate: trainDetail.date
  });

  const handleSelect = () => {
    navigate('/seat-map', { state: { trainDetail, searchParams } });
    console.log(reservedSeats);
    console.log(isLoading);
    console.log(apiErrorMessage);
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg'>{seatInfo.name}</CardTitle>
        <p className='text-sm text-muted-foreground'>{seatInfo.description}</p>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-end'>
        <p className='mb-4 text-2xl font-bold'>{formatCurrency(seatInfo.price)}</p>
        <Button
          onClick={handleSelect}
          className='w-full'
          disabled={isReserving || seatInfo.name !== '指定席'}
        >
          座席を選択
        </Button>
        <div className='mb-1'></div>
        <Button
          onClick={onClickReservation}
          className='w-full'
          disabled={isReserving || seatInfo.name !== '指定席'}
        >
          {isReserving ? '処理中...' : '予約する'}
        </Button>
      </CardContent>
    </Card>
  );
};
