import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SelectedSeat } from '@/types/Seat';
import { formatSeat } from '@/utils/seat';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface SelectedSeatsInfoProps {
  selectedSeats: SelectedSeat[];
  totalPrice: number;
  handleClickTrash: () => void;
  // onConfirm: () => void;
}

export const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({ selectedSeats, totalPrice, handleClickTrash }) => {
  return (
      <Card className='w-66'>
        <CardHeader>
          <CardTitle>選択中の座席</CardTitle>
          <div className='flex justify-between items-center'>
            <CardDescription>{selectedSeats.length} 席 選択中</CardDescription>
            <button className='cursor-pointer disabled:cursor-not-allowed p-1 rounded-md hover:bg-black/5 hover:text-accent-foreground dark:hover:bg-accent/50' onClick={handleClickTrash} disabled={selectedSeats.length === 0}>
              <Trash2 size={20} />
            </button>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col overflow-y-auto w-65'>
          {selectedSeats.length > 0 ? (
            <div className='min-w-max'>
              <ul className='space-y-2'>
                {selectedSeats.map(({ carNumber, seatCd, seatTypeName, price }) => (
                  <li
                    key={`${carNumber}-${seatCd}`}
                    className='flex justify-between text-sm min-w-max'
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
          <Button className='w-auto mt-4' disabled={selectedSeats.length === 0}>予約する</Button>
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
  );
};
