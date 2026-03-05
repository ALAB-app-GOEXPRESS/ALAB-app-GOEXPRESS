import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';

import type { SeatClassDetail } from '@/api/TrainDetailApi';

export const SeatClassCard: React.FC<{
  seatInfo: SeatClassDetail;
  onClickReservation: () => void;
  isReserving: boolean;
}> = ({ seatInfo, onClickReservation, isReserving }) => {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg'>{seatInfo.name}</CardTitle>
        <p className='text-sm text-muted-foreground'>{seatInfo.description}</p>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-end'>
        <p className='mb-4 text-2xl font-bold'>{formatCurrency(seatInfo.price)}</p>
        <div className='mb-1'></div>
        <Button
          onClick={onClickReservation}
          className='w-full'
          disabled={isReserving || seatInfo.name !== '指定席'}
        >
          {isReserving ? '処理中...' : seatInfo.name === '指定席' ? '座席を選択して予約' : '予約する'}
        </Button>
      </CardContent>
    </Card>
  );
};
