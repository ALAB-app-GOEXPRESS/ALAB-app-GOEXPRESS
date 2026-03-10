import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SelectedSeat } from '@/types/Seat';
import { formatSeat } from '@/lib/utils';

interface SelectedSeatsInfoProps {
  selectedSeats: SelectedSeat[];
  totalPrice: number;
  // onConfirm: () => void;
}

export const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({ selectedSeats, totalPrice }) => {
  return (
    <div className='w-80 hidden lg:block'>
      <Card>
        <CardHeader>
          <CardTitle>選択中の座席</CardTitle>
          <CardDescription>{selectedSeats.length} 席 選択中</CardDescription>
        </CardHeader>
        <CardContent className='max-h-60 overflow-y-auto'>
          {selectedSeats.length > 0 ? (
            <ul className='space-y-2'>
              {selectedSeats.map(({ carNumber, seatCd }) => (
                <li
                  key={`${carNumber}-${seatCd}`}
                  className='text-sm'
                >
                  {formatSeat(seatCd)}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-muted-foreground'>座席が選択されていません</p>
          )}
          <span>{totalPrice}</span>
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
