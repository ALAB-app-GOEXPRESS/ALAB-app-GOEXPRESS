import React, { useState } from "react"
import { TabsContent } from '@/components/ui/tabs';
import { SeatButton, type SeatStatus } from '@/components/ui/seatButton';
import type { SelectedSeat } from '@/types/Seat';
import { convertRowColToSeatCd } from '@/utils/seat';

const SEAT_ROWS = 15;
const SEAT_COLUMNS_3 = ['A', 'B', 'C'];
const SEAT_COLUMNS_2 = ['D', 'E'];

const DUMMY_RESERVED_SEATS: SelectedSeat[] = [
  { carNumber: 3, seatId: '021' },
  { carNumber: 3, seatId: '022' },
  { carNumber: 3, seatId: '023' },
];

type props = {
    carNumber: number;
}

export const SeatMap: React.FC<props> = ({ carNumber }) => {
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

    return (
        <TabsContent 
                  key={carNumber}
                  value={String(carNumber)}
                  className='mt-4'
                >
                  <div className='flex flex-col items-start gap-4'>
                    <div className='flex justify-start gap-2 sm:gap-4'>
                      <div className='flex flex-col gap-2 pt-1'>
                        {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) => (
                          <div
                            key={row}
                            className='flex h-10 w-8 items-center justify-center font-mono text-muted-foreground'
                          >
                            {row}
                          </div>
                        ))}
                      </div>
                      <div className='flex items-center gap-2 sm:gap-4'>
                        <div className='grid grid-cols-3 gap-2'>
                          {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) =>
                            SEAT_COLUMNS_3.map((col) => {
                              const seatId = convertRowColToSeatCd(row, col);
                              const isReserved = DUMMY_RESERVED_SEATS.some(
                                (s) => s.carNumber === carNumber && s.seatId === seatId,
                              );
                              const isSelected = selectedSeats.some(
                                (s) => s.carNumber === carNumber && s.seatId === seatId,
                              );
                              const status: SeatStatus = isReserved
                                ? 'reserved'
                                : isSelected
                                  ? 'selected'
                                  : 'available';
                              return (
                                <SeatButton
                                  key={seatId}
                                  seatId={seatId}
                                  status={status}
                                  onClick={() => handleSeatClick(carNumber, seatId)}
                                />
                              );
                            }),
                          )}
                        </div>
                        <div
                          className='w-2 sm:w-4'
                          aria-hidden='true'
                        />
                        <div className='grid grid-cols-2 gap-2'>
                          {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) =>
                            SEAT_COLUMNS_2.map((col) => {
                              const seatId = convertRowColToSeatCd(row, col);
                              const isReserved = DUMMY_RESERVED_SEATS.some(
                                (s) => s.carNumber === carNumber && s.seatId === seatId,
                              );
                              const isSelected = selectedSeats.some(
                                (s) => s.carNumber === carNumber && s.seatId === seatId,
                              );
                              const status: SeatStatus = isReserved
                                ? 'reserved'
                                : isSelected
                                  ? 'selected'
                                  : 'available';
                              return (
                                <SeatButton
                                  key={seatId}
                                  seatId={seatId}
                                  status={status}
                                  onClick={() => handleSeatClick(carNumber, seatId)}
                                />
                              );
                            }),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
    );
};