import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TramFront } from 'lucide-react';

type Props = {
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  reservedSeats: number;
  greenSeats: number;
  grandclassSeats: number;
  onClickDetail: () => void;
  isReserving: boolean;
};

export const TrainCard: React.FC<Props> = ({
  trainTypeName,
  trainNumber,
  departureTime,
  arrivalTime,
  departureStation,
  arrivalStation,
  // reservedSeats,
  // greenSeats,
  // grandclassSeats,
  onClickDetail,
  isReserving = false,
}) => {
  const specifyTrainTypeIconColor = () => {
    if (trainTypeName === 'はやぶさ') {
      return 'bg-primary';
    }

    if (trainTypeName === 'はやて') {
      return 'bg-[oklch(0.62_0.210_350)]';
    }

    if (trainTypeName === 'やまびこ') {
      return 'bg-[oklch(0.45_0.13_155)]';
    }

    return 'bg-[oklch(0.28_0.125_300)]';
  }

  return (
    <Card className='mb-4 border-brand-green-light'>
      <CardContent className='p-4'>
        <div className='grid grid-cols-[15%_70%_15%] items-center'>
          <div className='flex gap-2 items-center'>
            <TramFront className={`${specifyTrainTypeIconColor()} text-white text-[30px] rounded-sm`} />

            <div className='flex flex-col'>
              <span className='font-sans text-[20px] font-bold'>{trainTypeName}</span>
              <span className='text-gray-500'>{trainNumber}</span>
            </div>
          </div>

          <div className='grid grid-cols-[20%_60%_20%] items-center'>
            <div className='flex justify-center'>
              <div className='flex flex-col'>
                <span className='font-bold text-[28px]'>{departureTime}</span>
                <span className='text-gray-500'>{departureStation}</span>
              </div>
            </div>

            <div className='relative flex items-center justify-center'>
              <hr className='absolute z-10 w-full border-[#008803]' />
              <Clock className='absolute z-20 bg-white' />
            </div>

            <div className='flex justify-center'>
              <div className='flex flex-col'>
                <span className='font-bold text-[28px]'>{arrivalTime}</span>
                <span className='text-gray-500'>{arrivalStation}</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            {/* 
            <div className="flex justify-end gap-1">
              <Button variant="outline" size="sm">指定 {reservedSeats}</Button>
              <Button variant="outline" size="sm">G {greenSeats}</Button>
              <Button variant="outline" size="sm">グラン {grandclassSeats}</Button>
            </div>
            */}

            <div className='flex justify-end'>
              <Button
                onClick={onClickDetail}
                disabled={isReserving}
              >
                {isReserving ? '予約処理中...' : '予約する'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
