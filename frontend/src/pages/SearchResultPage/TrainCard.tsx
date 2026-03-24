import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TramFront, Users } from 'lucide-react';
import { specifyTrainTypeIconColor } from '@/utils/train';
import { calcDurationMin, formatHM } from '@/utils/dateTime';
import { cn } from '@/lib/utils';

type Props = {
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  seatAvailability: {
    reserved: number;
  };
  onClickDetail: () => void;
};

export const TrainCard: React.FC<Props> = ({
  trainTypeName,
  trainNumber,
  departureTime,
  arrivalTime,
  departureStation,
  arrivalStation,
  seatAvailability,
  onClickDetail,
}) => {
  const isSoldOut = seatAvailability.reserved === 0;

  return (
    <Card
      className={cn(
        'mb-4',
        isSoldOut
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-brand-green-light cursor-pointer hover:bg-gray-50',
      )}
      onClick={isSoldOut ? undefined : onClickDetail}
    >
      <CardContent className='px-4 py-2'>
        <div className='grid grid-cols-[1fr_auto] items-center gap-4'>
          <div className='grid grid-cols-[25%_75%] items-center'>
            <div className='flex gap-2 items-center ml-4'>
              <TramFront
                className={cn(
                  'text-white text-[30px] rounded-sm',
                  specifyTrainTypeIconColor(trainTypeName),
                  isSoldOut && 'grayscale',
                )}
              />
              <div className='flex flex-col'>
                <span className={cn('font-sans text-[20px] font-bold', isSoldOut ? 'text-gray-500' : 'text-black')}>
                  {trainTypeName}
                </span>
                <span className='text-gray-500'>{trainNumber}</span>
              </div>
            </div>

            <div className='grid grid-cols-[30%_40%_30%] items-center'>
              <div className='flex justify-center'>
                <div className='flex flex-col text-center'>
                  <span className={cn('font-bold text-[28px]', isSoldOut ? 'text-gray-500' : 'text-black')}>
                    {departureTime}
                  </span>
                  <span className='text-gray-500'>{departureStation}</span>
                </div>
              </div>

              <div className='relative flex items-center justify-center'>
                <div className='w-full border-t-2 border-dashed' />
                <div
                  className={cn(
                    'absolute -top-3 rounded-md px-3 text-base font-bold',
                    isSoldOut ? 'bg-gray-100 text-gray-500' : 'bg-white text-primary',
                  )}
                >
                  {formatHM(calcDurationMin(departureTime, arrivalTime))}
                </div>
                <ArrowRight className='absolute right-0 h-5 w-5 text-primary/40' />
              </div>

              <div className='flex justify-center'>
                <div className='flex flex-col text-center'>
                  <span className={cn('font-bold text-[28px]', isSoldOut ? 'text-gray-500' : 'text-black')}>
                    {arrivalTime}
                  </span>
                  <span className='text-gray-500'>{arrivalStation}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center pr-4'>
            {isSoldOut ? (
              <span className='font-bold text-red-500 text-lg'>満席</span>
            ) : (
              <div className='flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 shadow-sm'>
                <Users className='h-5 w-5 text-gray-500' />
                <span className='font-bold text-gray-800 text-lg'>{seatAvailability.reserved}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
