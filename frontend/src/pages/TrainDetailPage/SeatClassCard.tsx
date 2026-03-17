import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { useNavigate } from 'react-router-dom';
import type { SeatClassDetail, TrainDetailResult } from '@/api/TrainDetailApi';
import type { StationCode } from '@/types/Station';

export const SeatClassCard: React.FC<{
  index: number;
  seatClasses: SeatClassDetail[];
  trainDetail: TrainDetailResult;
  searchParams: { from: StationCode; to: StationCode; date: string };
}> = ({ index, seatClasses, trainDetail, searchParams }) => {
  const navigate = useNavigate();

  const seatInfo = seatClasses[index];

  const handleSelect = () => {
    navigate('/seat-map', { state: { seatClasses, trainDetail, searchParams } });
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
          disabled={seatInfo.name !== '指定席'}
        >
          座席を選択
        </Button>
      </CardContent>
    </Card>
  );
};
