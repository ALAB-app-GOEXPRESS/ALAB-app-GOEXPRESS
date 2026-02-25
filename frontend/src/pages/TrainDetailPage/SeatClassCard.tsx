import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SeatClassDetail } from '@/api/TrainDetailApi';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

export const SeatClassCard: React.FC<{ seatInfo: SeatClassDetail }> = ({ seatInfo }) => {
  const handleSelect = () => {
    alert(`${seatInfo.name}が選択されました。\n（この先の機能は別途実装が必要です）`);
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
          className='w-full bg-green-600 hover:bg-green-700'
        >
          座席を選択
        </Button>
      </CardContent>
    </Card>
  );
};
