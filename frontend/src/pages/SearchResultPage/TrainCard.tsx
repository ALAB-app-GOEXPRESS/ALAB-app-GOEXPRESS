import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TramFront } from 'lucide-react';
import { specifyTrainTypeIconColor } from '@/utils/train';
import { calcDurationMin, formatHM } from '@/utils/dateTime';

type Props = {
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  onClickDetail: () => void;
};

export const TrainCard: React.FC<Props> = ({
  trainTypeName,
  trainNumber,
  departureTime,
  arrivalTime,
  departureStation,
  arrivalStation,
  onClickDetail,
}) => {
  return (
    <Card
      className='mb-4 border-brand-green-light cursor-pointer transition-colors transition-shadow duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50'
      onClick={onClickDetail}
    >
      <CardContent className='px-4'>
        <div className='grid grid-cols-[20%_80%] items-center'>
          <div className='flex gap-2 items-center ml-4'>
            <TramFront className={`${specifyTrainTypeIconColor(trainTypeName)} text-white text-[30px] rounded-sm`} />

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

            <div className='flex items-center'>
              <div className='grid w-full grid-cols-[1fr_auto_1fr_auto] items-center '>
                <div className='border-t-2 border-dashed' />
                <div className='rounded-md px-3 text-base font-bold text-primary whitespace-nowrap'>
                  {formatHM(calcDurationMin(departureTime, arrivalTime))}
                </div>
                <div className='border-t-2 border-dashed' />
                <ArrowRight className='h-5 w-5 text-primary/40 justify-self-end' />
              </div>
            </div>

            <div className='flex justify-center'>
              <div className='flex flex-col'>
                <span className='font-bold text-[28px]'>{arrivalTime}</span>
                <span className='text-gray-500'>{arrivalStation}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
