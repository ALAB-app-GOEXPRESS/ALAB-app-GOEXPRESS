import { SeatButton, type SeatStatus } from '@/pages/SeatMapPage/seatButton';
import { calculateAvailableSeat, convertRowColToSeatCd } from '@/utils/seat';
import type { SelectedSeat } from '@/types/Seat';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ReservedSeat } from '@/api/SeatApi';
import type { SeatClassDetail } from '@/api/TrainDetailApi';
import { MAX_SELECTABLE } from '@/constants/Seat';

const SEAT_ROWS = 15;
const SEAT_COLUMNS_3 = ['A', 'B', 'C'];
const SEAT_COLUMNS_2 = ['D', 'E'];

type Props = {
  reservedSeats: ReservedSeat[];
  carNumber: number;
  seatClasses: SeatClassDetail[];
  selectedSeats: SelectedSeat[];
  setSelectedSeats: (value: React.SetStateAction<SelectedSeat[]>) => void;
};

export const SeatMapTab: React.FC<Props> = ({
  reservedSeats,
  carNumber,
  seatClasses,
  selectedSeats,
  setSelectedSeats,
}) => {
  const handleSeatClick = (carNumber: number, seatCd: string) => {
    const isReserved = reservedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);
    if (isReserved) return;

    const isSelected = selectedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => !(s.carNumber === carNumber && s.seatCd === seatCd)));
      return;
    }

    if (selectedSeats.length >= MAX_SELECTABLE) {
      return;
    } else {
      setSelectedSeats((prev) => [
        ...prev,
        { carNumber, seatCd, seatTypeName: seatClasses[0].name, price: seatClasses[0].price },
      ]);
    }

    console.log();
  };

  return (
    <div
      key={carNumber}
      className='mt-4'
    >
      <div className='flex flex-col items-start gap-3'>
        <div className='flex gap-4'>
          <span className='font-semibold text-xl'>{carNumber}号車</span>
          <Badge
            variant='outline'
            className='text-sm border-2'
          >
            空席 {calculateAvailableSeat(reservedSeats, carNumber)}席
          </Badge>
        </div>
        <div className='flex items-center gap-1.5'>
          <ArrowUp
            className='text-black/50'
            size={14}
          />
          <span className='text-black/50 text-xs'>東京方面</span>
        </div>
        <div className='flex justify-start sm:gap-4'>
          <div className='flex flex-col gap-2 pt-1'>
            {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) => (
              <div
                key={row}
                className='flex h-12 w-6 text-base items-center justify-start font-mono text-muted-foreground'
              >
                {row}
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 sm:gap-4'>
            <div className='grid grid-cols-3 gap-2'>
              {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) =>
                SEAT_COLUMNS_3.map((col) => {
                  const seatCd = convertRowColToSeatCd(carNumber, row, col);
                  const isReserved = reservedSeats.find(
                    (seat) => seat.carNumber === carNumber && seat.seatCd === seatCd,
                  );
                  const isSelected = selectedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);
                  const status: SeatStatus = isReserved ? 'reserved' : isSelected ? 'selected' : 'available';

                  return (
                    <SeatButton
                      key={seatCd}
                      seatCd={seatCd}
                      status={status}
                      onClick={() => handleSeatClick(carNumber, seatCd)}
                      isSelectedMax={selectedSeats.length >= MAX_SELECTABLE}
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
                  const seatCd = convertRowColToSeatCd(carNumber, row, col);
                  const isReserved = reservedSeats
                    .filter((seat) => {
                      return seat.carNumber === carNumber;
                    })
                    .find((seat) => seat.seatCd === seatCd);
                  const isSelected = selectedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);
                  const status: SeatStatus = isReserved ? 'reserved' : isSelected ? 'selected' : 'available';
                  return (
                    <SeatButton
                      key={seatCd}
                      seatCd={seatCd}
                      status={status}
                      onClick={() => handleSeatClick(carNumber, seatCd)}
                      isSelectedMax={selectedSeats.length >= MAX_SELECTABLE}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1.5'>
          <ArrowDown
            className='text-black/50'
            size={14}
          />
          <span className='text-black/50 text-xs'>新青森方面</span>
        </div>
      </div>
    </div>
  );
};
