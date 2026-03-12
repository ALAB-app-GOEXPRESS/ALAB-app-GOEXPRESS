import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TOTAL_CARS = 8;
const SEAT_ROWS = 15;

export const SeatMapPageSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8 relative'>
      <div className='mx-auto max-w-5xl'>
        {/* 戻るボタンのスケルトン */}
        <Skeleton className='h-6 w-36' />

        <div className='flex items-start mt-4 gap-6'>
          {/* 左側のメインカード */}
          <Card className='flex-1'>
            <CardHeader>
              <Skeleton className='h-7 w-32' />
              <Skeleton className='h-5 w-80 mt-1' />
            </CardHeader>
            <CardContent>
              {/* 号車選択のスケルトン */}
              <div className='w-full'>
                <div className='flex flex-col'>
                  <Skeleton className='h-5 w-24 mb-2' />
                  <div className='inline-flex gap-2'>
                    {Array.from({ length: TOTAL_CARS }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className='h-16 w-16'
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 座席表のスケルトン */}
              <div className='mt-4'>
                <div className='flex flex-col items-start gap-3'>
                  <div className='flex gap-4 items-center'>
                    <Skeleton className='h-7 w-20' />
                    <Skeleton className='h-6 w-24 rounded-full' />
                  </div>
                  <Skeleton className='h-4 w-24' />
                  <div className='flex justify-start sm:gap-4'>
                    {/* 行番号 */}
                    <div className='flex flex-col gap-2 pt-1'>
                      {Array.from({ length: SEAT_ROWS }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className='h-12 w-6'
                        />
                      ))}
                    </div>
                    {/* 座席ボタン */}
                    <div className='flex items-center gap-2 sm:gap-4'>
                      <div className='grid grid-cols-3 gap-2'>
                        {Array.from({ length: SEAT_ROWS * 3 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className='h-12 w-12'
                          />
                        ))}
                      </div>
                      <div className='w-2 sm:w-4' />
                      <div className='grid grid-cols-2 gap-2'>
                        {Array.from({ length: SEAT_ROWS * 2 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className='h-12 w-12'
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Skeleton className='h-4 w-24' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 右側の選択中座席情報カードのスケルトン */}
          <div className='w-66'>
            <Card>
              <CardHeader>
                <Skeleton className='h-7 w-36' />
                <Skeleton className='h-5 w-28 mt-1' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-5 w-48' />
                <Skeleton className='h-10 w-full mt-4' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
