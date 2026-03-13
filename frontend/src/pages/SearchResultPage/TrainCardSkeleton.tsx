import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TrainCardSkeleton = () => {
  return (
    <Card>
      <CardContent className='flex items-center justify-between p-4'>
        {/* 左側: 列車情報 */}
        <div className='flex flex-1 items-center gap-4'>
          <Skeleton className='hidden h-10 w-10 rounded-sm sm:block' />
          <div className='space-y-1.5'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-40' />
          </div>
        </div>

        {/* 中央: 時刻情報 (PC表示) */}
        <div className='hidden flex-col items-center gap-1 text-center md:flex'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-7 w-20' />
            <Skeleton className='h-1 w-8' />
            <Skeleton className='h-7 w-20' />
          </div>
        </div>

        {/* 右側: ボタン */}
        <div className='flex justify-end'>
          <Skeleton className='h-10 w-28' />
        </div>
      </CardContent>
    </Card>
  );
};
