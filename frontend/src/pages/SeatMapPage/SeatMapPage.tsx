import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
// import { SelectedSeatsInfo } from '@/components/ui/selectedSeatsInfo';
import { SeatMapTab } from './SeatMapTab';
import { useSeatMap } from '@/pages/SeatMapPage/useSeatMap';
import { calculateAvailableSeat } from '@/utils/seat';
const TOTAL_CARS = 8;

export const SeatMapPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { seatClasses, trainDetail } = location.state || {};

  const [activeCar, setActiveCar] = useState<number>(1);

  const { reservedSeats } = useSeatMap({
  trainCd: trainDetail.trainCd,
  departureDate: trainDetail.date
  });

  // const handleConfirmReservation = () => {
  //   if (selectedSeats.length === 0) {
  //     alert('座席を1つ以上選択してください。');
  //     return;
  //   }
  //   const selectedSeatLabels = selectedSeats
  //     .map((s) => `${s.carNumber}号車 ${convertSeatCdToLabel(s.seatId)}`)
  //     .join(', ');
  //   alert(`以下の座席で予約します：\n${selectedSeatLabels}\n（この先の機能は別途実装が必要です）`);
  // };

  if (!trainDetail) {
    return (
      <div className='p-8'>
        <p>列車情報がありません。前のページから再度操作してください。</p>
        <Button onClick={() => navigate(-1)}>戻る</Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8 relative'>
      {/* <SelectedSeatsInfo
        selectedSeats={selectedSeats}
        onConfirm={handleConfirmReservation}
      /> */}

      <div className='mx-auto max-w-5xl'>
        <Button
          variant='link'
          onClick={() => navigate(-1)}
          className='p-0 text-black'
        >
          <ArrowLeft className='mr-1 h-4 w-4' />
          列車詳細に戻る
        </Button>

        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>座席を選択</CardTitle>
            <CardDescription>
              {trainDetail.trainTypeName} {trainDetail.trainNumber} ({trainDetail.departureStationName} →{' '}
              {trainDetail.arrivalStationName})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='w-full'>
              <div className='flex flex-col overflow-x-auto whitespace-nowrap pb-2 -mb-2'>
                <span className='text-base text-black/50 mb-2'>号車を選択</span>
                <div className='inline-flex gap-2'>
                  {Array.from({ length: TOTAL_CARS }, (_, i) => i + 1).map((carNumber) => (
                    <Button
                      key={carNumber}
                      variant={activeCar === carNumber ? 'default' : 'outline'}
                      className={[
                        // どの状態でも border 幅を確保
                        'border',
                        activeCar === carNumber
                          ? 'disabled:bg-primary/10 disabled:text-primary border-primary'
                          : 'border-border',
                        // 必要に応じて最小幅も追加
                        'px-3 py-1 sm:px-4 h-16 w-16 border-3',
                      ].join(' ')}
                      onClick={() => setActiveCar(carNumber)}
                      aria-pressed={activeCar === carNumber}
                      disabled={activeCar === carNumber}
                    >
                      <div className='flex flex-col'>
                        <span>{carNumber}</span>
                        <span className='text-xs text-black/50'>{calculateAvailableSeat(reservedSeats, carNumber)}席</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className='mt-4'>
                <SeatMapTab
                  reservedSeats={reservedSeats}
                  carNumber={activeCar}
                  seatClasses={seatClasses}
                />
              </div>
            </div>
            <div className='flex mt-4 items-center'>
              <Button
                variant='outline'
                className='border-border h-8 w-8 disabled:bg-background'
                disabled
              />
              <span className='ml-2'>空席</span>
              <Button
                variant='outline'
                className='border-border disabled:bg-primary h-8 w-8 ml-4'
                disabled
              />
              <span className='ml-2'>選択中</span>
              <Button
                variant='outline'
                className='border-border h-8 w-8 ml-4'
                disabled
              />
              <span className='ml-2'>予約済み</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
