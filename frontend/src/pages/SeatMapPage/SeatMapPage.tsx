import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { SeatButton, type SeatStatus } from '@/components/ui/seatButton';
// import { SelectedSeatsInfo } from '@/components/ui/selectedSeatsInfo';
import type { SelectedSeat } from '@/types/Seat';
import { convertRowColToSeatCd } from '@/utils/seat';
import { SeatMap } from './SeatMap';

const TOTAL_CARS = 10;
const SEAT_ROWS = 15;
const SEAT_COLUMNS_3 = ['A', 'B', 'C'];
const SEAT_COLUMNS_2 = ['D', 'E'];

const DUMMY_RESERVED_SEATS: SelectedSeat[] = [
  { carNumber: 3, seatId: '021' },
  { carNumber: 3, seatId: '022' },
  { carNumber: 3, seatId: '023' },
];

export const SeatMapPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { trainDetail, searchParams } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const handleSeatClick = (carNumber: number, seatId: string) => {
    const isReserved = DUMMY_RESERVED_SEATS.some((s) => s.carNumber === carNumber && s.seatId === seatId);
    if (isReserved) return;

    const isSelected = selectedSeats.some((s) => s.carNumber === carNumber && s.seatId === seatId);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => !(s.carNumber === carNumber && s.seatId === seatId)));
    } else {
      setSelectedSeats((prev) => [...prev, { carNumber, seatId }]);
    }
  };

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

  if (!trainDetail || !searchParams) {
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
            <Tabs
              defaultValue='1'
              className='w-full'
            >
              <TabsList className='overflow-x-auto whitespace-nowrap'>
                {Array.from({ length: TOTAL_CARS }, (_, i) => i + 1).map((carNumber) => (
                  <TabsTrigger
                    key={carNumber}
                    value={String(carNumber)}
                  >
                    {carNumber}号車
                  </TabsTrigger>
                ))}
              </TabsList>

              {Array.from({ length: TOTAL_CARS }, (_, i) => i + 1).map((carNumber) => (
              <SeatMap key={carNumber} carNumber={carNumber} />
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
