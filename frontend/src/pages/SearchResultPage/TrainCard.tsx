import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TramFront, Armchair, Clover, Crown } from 'lucide-react';
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
    green: number;
    grandclass: number;
  };
  onClickDetail: () => void;
};

const SeatAvailabilityItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  className?: string;
}> = ({ icon, label, count, className }) => {
  const isSoldOut = count === 0;
  return (
    <div className={cn('flex w-full items-center justify-between px-4', className)}>
      <div className='flex items-center gap-1.5'>
        {icon}
        <span className='font-bold text-sm'>{label}</span>
      </div>
      <span className={cn('font-bold text-sm', isSoldOut && 'text-gray-400')}>
        {isSoldOut ? '残席なし' : `残り${count}席`}
      </span>
    </div>
  );
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
  const isAllSoldOut =
    seatAvailability.reserved === 0 && seatAvailability.green === 0 && seatAvailability.grandclass === 0;

  return (
    <Card
      className={cn(
        'mb-4 overflow-hidden py-0 gap-0',
        isAllSoldOut
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-brand-green-light cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-lg',
      )}
      onClick={isAllSoldOut ? undefined : onClickDetail}
    >
      <CardContent className='flex h-24 items-center px-4'>
        <div className='grid w-full grid-cols-[25%_75%] items-center'>
          <div className='flex gap-2 items-center ml-4'>
            <TramFront
              className={cn(
                'text-white text-[30px] rounded-sm',
                specifyTrainTypeIconColor(trainTypeName),
                isAllSoldOut && 'grayscale',
              )}
            />
            <div className='flex flex-col'>
              <span className={cn('font-sans text-[20px] font-bold', isAllSoldOut ? 'text-gray-500' : 'text-black')}>
                {trainTypeName}
              </span>
              <span className='text-sm text-gray-500'>{trainNumber}</span>
            </div>
          </div>

          <div className='grid grid-cols-[30%_40%_30%] items-center'>
            <div className='flex justify-center'>
              <div className='flex flex-col text-center'>
                <span className={cn('font-bold text-[28px]', isAllSoldOut ? 'text-gray-500' : 'text-black')}>
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
                  isAllSoldOut ? 'bg-gray-100 text-gray-500' : 'bg-white text-primary',
                )}
              >
                {formatHM(calcDurationMin(departureTime, arrivalTime))}
              </div>
              <ArrowRight className='absolute right-0 h-5 w-5 text-primary/40' />
            </div>

            <div className='flex justify-center'>
              <div className='flex flex-col text-center'>
                <span className={cn('font-bold text-[28px]', isAllSoldOut ? 'text-gray-500' : 'text-black')}>
                  {arrivalTime}
                </span>
                <span className='text-gray-500'>{arrivalStation}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className={cn('grid h-16 grid-cols-3 items-center border-t', isAllSoldOut ? 'bg-gray-100' : 'bg-white')}>
        <div className='flex h-full items-center'>
          <SeatAvailabilityItem
            icon={<Armchair className='h-5 w-5' />}
            label='指定席'
            count={seatAvailability.reserved}
            className='text-gray-800'
          />
        </div>
        <div className='flex h-full items-center border-l'>
          <SeatAvailabilityItem
            icon={<Clover className='h-5 w-5 text-green-600' />}
            label='グリーン車'
            count={seatAvailability.green}
            className='text-green-600'
          />
        </div>
        <div className='flex h-full items-center border-l'>
          <SeatAvailabilityItem
            icon={<Crown className='h-5 w-5 text-[#C3753A]' />}
            label='グランクラス'
            count={seatAvailability.grandclass}
            className='text-[#C3753A]'
          />
        </div>
      </div>
    </Card>
  );
};
