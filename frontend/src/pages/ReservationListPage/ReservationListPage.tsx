import { Button } from '@/components/ui/button';
import { RreservationCard } from './ReservationCard';
import { useReservationList } from './useResavationList';
import { Card, CardContent } from '@/components/ui/card';

export const ReservationListPage: React.FC = () => {
  const pageSize = 5;

  const {
    currentPage,
    totalPages,
    pageItems,
    setPageToQuery,
    isLoading,
    apiErrorMessage,
    // totalCount,
    pageResults,
  } = useReservationList(pageSize);

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-4xl px-4 py-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <div className='text-[28px] font-bold'>予約確認</div>
          </div>
        </div>
        {isLoading && (
          <Card className='border-muted/60'>
            <CardContent className='p-4 text-sm text-muted-foreground'>読み込み中...</CardContent>
          </Card>
        )}

        {!isLoading && (
          <div>
            <ul>
              {pageResults.map((result) => {
                return (
                  <li key={result.reservationId}>
                    <RreservationCard reservationItem={result} />
                  </li>
                );
              })}
            </ul>
            {!isLoading && pageResults.length === 0 && !apiErrorMessage && (
              <Card className='border-muted/60'>
                <CardContent className='p-4 text-sm text-muted-foreground'>
                  条件に一致する列車が見つかりませんでした。
                </CardContent>
              </Card>
            )}
            <ul className='mt-6 flex items-center justify-center gap-2'>
              <li key={'forward'}>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage <= 1}
                  onClick={() => setPageToQuery(currentPage - 1)}
                >
                  前へ
                </Button>
              </li>

              {pageItems.map((item, index) => {
                if (item === '...') {
                  return (
                    <li key={item}>
                      <span
                        key={`ellipsis-${index}`}
                        className='px-2 text-sm text-muted-foreground'
                      >
                        …
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item}>
                    <Button
                      key={item}
                      size='sm'
                      variant={item === currentPage ? 'default' : 'outline'}
                      onClick={() => setPageToQuery(item)}
                    >
                      {item}
                    </Button>
                  </li>
                );
              })}

              <li key={'back'}>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage >= totalPages}
                  onClick={() => setPageToQuery(currentPage + 1)}
                >
                  次へ
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
