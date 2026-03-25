import { SeatButton, type SeatStatus } from '@/pages/SeatMapPage/seatButton';
import { calculateAvailableSeat, convertRowColToSeatCd, type SeatClass } from '@/utils/seat';
import type { SelectedSeat } from '@/types/Seat';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ReservedSeat } from '@/api/SeatApi';
import type { SeatClassDetail } from '@/api/TrainDetailApi';
import { MAX_SELECTABLE } from '@/constants/Seat';
import { useMemo } from 'react';

const ORDINARY_LAYOUT = {
  rows: 15,
  leftCols: ['A', 'B', 'C'],
  rightCols: ['D', 'E'],
} as const;

const GREEN_LAYOUT = {
  rows: 14,
  leftCols: ['A', 'B'],
  rightCols: ['C', 'D'],
} as const;

const GRANDCLASS_LAYOUT = {
  rows: 6,
  leftCols: ['A'],
  rightCols: ['B', 'C'],
} as const;

type Props = {
  reservedSeats: ReservedSeat[];
  carNumber: number;
  seatClasses: SeatClassDetail[];
  selectedSeats: SelectedSeat[];
  setSelectedSeats: (value: React.SetStateAction<SelectedSeat[]>) => void;
  seatType: SeatClass;
};

const getLayoutBySeatType = (seatType: SeatClass) => {
  switch (seatType) {
    case 'green':
      return GREEN_LAYOUT;
    case 'grandclass':
      return GRANDCLASS_LAYOUT;
    default:
      return ORDINARY_LAYOUT;
  }
};

export const SeatMapTab: React.FC<Props> = ({
  reservedSeats,
  carNumber,
  seatClasses,
  selectedSeats,
  setSelectedSeats,
  seatType,
}) => {
  const layout = getLayoutBySeatType(seatType);
  const rows = layout.rows;

  const rowList = useMemo(() => Array.from({ length: rows }, (_, i) => i + 1), [rows]);

  const seatClassDetail = seatClasses[0];

  const isReservedSeat = (carNumber: number, seatCd: string) =>
    reservedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);

  const isSelectedSeat = (carNumber: number, seatCd: string) =>
    selectedSeats.some((s) => s.carNumber === carNumber && s.seatCd === seatCd);

  const handleSeatClick = (carNumber: number, seatCd: string) => {
    if (isReservedSeat(carNumber, seatCd)) return;

    const alreadySelected = isSelectedSeat(carNumber, seatCd);
    if (alreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => !(s.carNumber === carNumber && s.seatCd === seatCd)));
      return;
    }

    if (selectedSeats.length >= MAX_SELECTABLE) return;

    setSelectedSeats((prev) => [
      ...prev,
      {
        carNumber,
        seatCd,
        seatTypeName: seatClassDetail.name,
        price: seatClassDetail.price,
      },
    ]);
  };

  const renderSeatGrid = (cols: readonly string[], gridCols: number) => {
    return (
      <div
        className={`grid gap-2`}
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {rowList.map((row) =>
          cols.map((col) => {
            const seatCd = convertRowColToSeatCd(carNumber, row, col);
            const reserved = isReservedSeat(carNumber, seatCd);
            const selected = isSelectedSeat(carNumber, seatCd);
            const status: SeatStatus = reserved ? 'reserved' : selected ? 'selected' : 'available';

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
    );
  };

  const totalSeats = rows * (layout.leftCols.length + layout.rightCols.length);

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
            空席 {calculateAvailableSeat(reservedSeats, carNumber, totalSeats)}席
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
            {rowList.map((row) => (
              <div
                key={row}
                className='flex h-12 w-6 text-base items-center justify-start font-mono text-muted-foreground'
              >
                {row}
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 sm:gap-4'>
            {renderSeatGrid(layout.leftCols, layout.leftCols.length)}
            <div
              className='w-2 sm:w-4'
              aria-hidden='true'
            />
            {renderSeatGrid(layout.rightCols, layout.rightCols.length)}
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
