import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveRight, TramFront } from 'lucide-react';
import { specifyTrainTypeIconColor } from '@/utils/train';

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
      className='mb-4 border-brand-green-light cursor-pointer'
      onClick={onClickDetail}
    >
      <CardContent className='p-4'>
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

            <div className='relative flex items-center justify-center'>
              <hr className='absolute z-10 w-full border-[#008803]' />
              {/* <MoveRight className='absolute z-20 bg-white p-2' /> */}
            </div>

            <div className='flex justify-center'>
              <div className='flex flex-col'>
                <span className='font-bold text-[28px]'>{arrivalTime}</span>
                <span className='text-gray-500'>{arrivalStation}</span>
              </div>
            </div>
          </div>

          {/* <div className='flex flex-col gap-2'>
            <div className='flex flex-col items-end gap-2'>
              <Button
                onClick={onClickDetail}
                className='w-22 hover:cursor-'
              >
                詳細を見る
              </Button>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
