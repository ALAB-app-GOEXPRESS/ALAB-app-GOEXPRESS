import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { SeatMapTab } from './SeatMapTab';
import { useSeatMap } from '@/pages/SeatMapPage/useSeatMap';
import { calculateAvailableSeat, formatSelectedSeat } from '@/utils/seat';
import type { SelectedSeat } from '@/types/Seat';
import { SelectedSeatsInfo } from './selectedSeatsInfo';
import { SeatMapPageSkeleton } from './SeatMapPageSkeleton';
<<<<<<< HEAD
import { toast } from 'sonner';
=======
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
>>>>>>> origin/main

const TOTAL_CARS_RESERVED = 8;
const GREEN_CAR_NUMBER = TOTAL_CARS_RESERVED + 1;
const GRANDCLASS_CAR_NUMBER = GREEN_CAR_NUMBER + 1;

export const SeatMapPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { seatClasses, trainDetail, initialSeatType } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [activeCar, setActiveCar] = useState<number>(1);

  const { reservedSeats, isLoading } = useSeatMap({
    trainCd: trainDetail.trainCd,
    departureDate: trainDetail.date,
  });

  const [selectedSeatsNumber, setSelectedSeatsNumber] = useState(Number(sessionStorage.getItem('selectedSeatsNumber')));

  useEffect(() => {
    if (selectedSeatsNumber) {

      const selectedSeatCdList: string[] = [];

      for (let i: number = 0; i < selectedSeatsNumber; i++) {
        const currentSeatCd = sessionStorage.getItem(`selectedSeat${i}`);
        console.log(currentSeatCd);

        if (reservedSeats.find((seat) => seat.seatCd === currentSeatCd)) {
          toast.error('選択した座席は既に予約されています。再度座席を選択してください。', {
            position: 'bottom-right',
            duration: 5000,
          });

          setSelectedSeats([]);
          for(let i = 0; i < selectedSeatsNumber; i++) {
            sessionStorage.removeItem(`selectedSeat${i}`);
          }
          sessionStorage.removeItem('selectedSeatsNumber');
          setSelectedSeatsNumber(0);
          break;
        }

        if (currentSeatCd) selectedSeatCdList.push(currentSeatCd);
      }

      setSelectedSeats(selectedSeatCdList.map((seatCd) => formatSelectedSeat(seatCd)));
    }
    return;
  }, [reservedSeats, location]);

  if (isLoading) {
    return <SeatMapPageSkeleton />;
  }

  if (!trainDetail) {
    return (
      <div className='p-8'>
        <p>列車情報がありません。前のページから再度操作してください。</p>
        <Button onClick={() => navigate(-1)}>戻る</Button>
      </div>
    );
  }

  const handleClickTrash = () => {
    setSelectedSeats([]);
  };

  const handleReserve = () => {
    for (let i = 0; i < selectedSeatsNumber; i++) {
      sessionStorage.removeItem(`selectedSeat${i}`);
    }
    selectedSeats.forEach((seat, index) => sessionStorage.setItem(`selectedSeat${index}`, seat.seatCd));
    sessionStorage.setItem('selectedSeatsNumber', selectedSeats.length.toString());

    navigate('/reservation-confirm', { state: { trainDetailResult: trainDetail, selectedSeats, initialSeatType } });
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8 relative'>
      <div className='mx-auto max-w-5xl'>
        <Button
          variant='link'
          onClick={() => navigate(-1)}
          className='p-0 text-black'
        >
          <ArrowLeft className='mr-1 h-4 w-4' />
          列車詳細に戻る
        </Button>

        <div className='flex items-start mt-4 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>座席を選択</CardTitle>
              <CardDescription>
                {trainDetail.trainTypeName} {trainDetail.trainNumber} ({trainDetail.departureStationName} →{' '}
                {trainDetail.arrivalStationName})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={initialSeatType}
                className='w-186.5'
              >
                <TabsList className='w-186.5'>
                  <TabsTrigger value='reserved'>指定席</TabsTrigger>
                  <TabsTrigger value='green'>グリーン車</TabsTrigger>
                  <TabsTrigger value='grandclass'>グランクラス</TabsTrigger>
                </TabsList>
                <TabsContent value='reserved'>
                  <div className='w-full'>
                    <div className='flex flex-col overflow-x-auto whitespace-nowrap pb-2 -mb-2'>
                      <span className='text-base text-black/50 mb-2'>号車を選択</span>
                      <div className='inline-flex gap-2'>
                        {Array.from({ length: TOTAL_CARS_RESERVED }, (_, i) => i + 1).map((carNumber) => (
                          <Button
                            key={carNumber}
                            variant={activeCar === carNumber ? 'default' : 'outline'}
                            className={[
                              'border',
                              activeCar === carNumber
                                ? 'disabled:bg-primary/10 disabled:text-primary border-primary'
                                : 'border-border',
                              'px-3 py-1 sm:px-4 h-16 w-16 border-3',
                            ].join(' ')}
                            onClick={() => setActiveCar(carNumber)}
                            aria-pressed={activeCar === carNumber}
                            disabled={activeCar === carNumber}
                          >
                            <div className='flex flex-col'>
                              <span>{carNumber}</span>
                              <span className='text-xs text-black/50'>
                                {calculateAvailableSeat(reservedSeats, carNumber, 75)}席
                              </span>
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
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        seatType='reserved'
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='green'>
                  <div className='w-full'>
                    <div className='mt-4'>
                      <SeatMapTab
                        reservedSeats={reservedSeats}
                        carNumber={GREEN_CAR_NUMBER}
                        seatClasses={seatClasses}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        seatType='green'
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='grandclass'>
                  <div className='w-full'>
                    <div className='mt-4'>
                      <SeatMapTab
                        reservedSeats={reservedSeats}
                        carNumber={GRANDCLASS_CAR_NUMBER}
                        seatClasses={seatClasses}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        seatType='grandclass'
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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

          <SelectedSeatsInfo
            selectedSeats={selectedSeats}
            totalPrice={selectedSeats.reduce((acc, current) => acc + current.price, 0)}
            handleClickTrash={handleClickTrash}
            handleReserve={handleReserve}
          />
        </div>
      </div>
    </div>
  );
};
