import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ReservationCardSkeleton = () => {
  return (
    <Card className='border-brand-green-light my-4'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-6' />
              <Skeleton className='h-6 w-40' />
            </div>
            <Skeleton className='h-4 w-48' />
          </div>
          <Skeleton className='h-6 w-14 rounded-full' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex gap-8'>
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
        <div className='space-y-2 pt-2'>
          <Skeleton className='h-4 w-12' />
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-20 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
        </div>
      </CardContent>
      <hr className='mx-4' />
      <CardFooter className='flex items-center justify-between pt-4'>
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-10 w-36' />
      </CardFooter>
    </Card>
  );
};
