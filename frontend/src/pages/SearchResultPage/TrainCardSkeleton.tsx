import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TrainCardSkeleton = () => {
  return (
    <Card className='mb-4 overflow-hidden'>
      {/* 上段: 時刻情報 */}
      <CardContent className='flex h-24 items-center px-4'>
        <div className='grid w-full grid-cols-[25%_75%] items-center'>
          {/* 列車アイコンと列車名 */}
          <div className='flex gap-2 items-center ml-4'>
            <Skeleton className='h-8 w-8 rounded-sm' />
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-4 w-12' />
            </div>
          </div>
          {/* 時刻と所要時間 */}
          <div className='grid grid-cols-[30%_40%_30%] items-center'>
            <div className='flex flex-col items-center gap-2'>
              <Skeleton className='h-7 w-20' />
              <Skeleton className='h-4 w-12' />
            </div>
            <div className='w-full'>
              <Skeleton className='h-1 w-full' />
            </div>
            <div className='flex flex-col items-center gap-2'>
              <Skeleton className='h-7 w-20' />
              <Skeleton className='h-4 w-12' />
            </div>
          </div>
        </div>
      </CardContent>

      {/* 下段: 残席情報 */}
      <div className='grid h-16 grid-cols-3 items-center border-t'>
        {/* 指定席 */}
        <div className='flex h-full w-full items-center justify-between px-4'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-24' />
        </div>
        {/* グリーン車 */}
        <div className='flex h-full w-full items-center justify-between border-l px-4'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-24' />
        </div>
        {/* グランクラス */}
        <div className='flex h-full w-full items-center justify-between border-l px-4'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-24' />
        </div>
      </div>
    </Card>
  );
};
