import { Skeleton } from '@/components/ui/skeleton';

export const TrainDetailPageSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='mx-auto max-w-4xl'>
        {/* 戻るボタンのスケルトン */}
        <Skeleton className='h-6 w-20' />

        <div className='mt-4 rounded-xl border bg-white p-6 shadow-sm'>
          {/* ヘッダー部分のスケルトン */}
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-sm' />
            <div>
              <Skeleton className='h-8 w-48' />
              <Skeleton className='mt-2 h-5 w-64' />
            </div>
          </div>

          {/* 出発・到着情報のスケルトン */}
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>

          {/* 空席状況のスケルトン */}
          <div className='mt-8'>
            <Skeleton className='h-7 w-32' />
            <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              {/* SeatClassCardのスケルトンを3つ表示 */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className='rounded-lg border p-4'
                >
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-6 w-24' />
                    <Skeleton className='h-5 w-12' />
                  </div>
                  <Skeleton className='mt-4 h-5 w-32' />
                  <Skeleton className='mt-6 h-10 w-full' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
