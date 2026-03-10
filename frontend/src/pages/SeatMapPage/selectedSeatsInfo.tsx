import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SelectedSeat } from '@/types/Seat';
import { formatSeat } from '@/utils/seat';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';

interface SelectedSeatsInfoProps {
  selectedSeats: SelectedSeat[];
  totalPrice: number;
  // onConfirm: () => void;
}

export const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({ selectedSeats, totalPrice }) => {
  return (
    <div className='min-w-50 lg:block'>
      <Card className='min-w-64'>
        <CardHeader>
          <CardTitle>選択中の座席</CardTitle>
          <CardDescription>{selectedSeats.length} 席 選択中</CardDescription>
        </CardHeader>
        <CardContent className='overflow-y-auto'>
          {selectedSeats.length > 0 ? (
            <div>
              <ul className='space-y-2'>
                {selectedSeats.map(({ carNumber, seatCd, seatTypeName, price }) => (
                  <li
                    key={`${carNumber}-${seatCd}`}
                    className='flex space-x-2 text-sm'
                  >
                    {/* <Badge variant='outline'>{carNumber}号車</Badge>
                  <span className='w-30'>
                    <span className='text-base'>{formatSeatExceptCarNumber(seatCd)}</span>
                    <span className='ml-1'>({seatTypeName})</span>
                  </span> */}
                    <div className='flex min-w-38 justify-between'>
                      <span>{formatSeat(seatCd)}</span>
                      <Badge variant='outline'>{seatTypeName}</Badge>
                    </div>
                    <span className='font-bold '>{formatCurrency(price)}</span>
                  </li>
                ))}
              </ul>
              <div className='flex justify-between items-center mt-4'>
                <span className='font-bold'>合計金額：</span>
                <span className='font-extrabold text-xl text-primary'>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>座席が選択されていません</p>
          )}
        </CardContent>
        {/* <CardFooter>
          <Button
            onClick={onConfirm}
            className='w-full'
            disabled={selectedSeats.length === 0}
          >
            この座席で予約を確定する
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};
