import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SeatStatus = 'available' | 'reserved' | 'selected';

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = SEAT_COLUMNS.length;

interface SeatButtonProps {
  seatCd: string;
  status: SeatStatus;
  onClick: (seatId: string) => void;
  isSelectedMax: boolean;
}

const getSeatDisplayInfo = (seatId: string) => {
  const seatIndex = parseInt(seatId, 10) - 1;
  const row = Math.floor(seatIndex / SEATS_PER_ROW) + 1;
  const col = SEAT_COLUMNS[seatIndex % SEATS_PER_ROW];
  return {
    row,
    col,
    label: `${row}${col}`,
  };
};

export const SeatButton: React.FC<SeatButtonProps> = ({ seatCd, status, onClick, isSelectedMax }) => {
  const { col, label } = getSeatDisplayInfo(seatCd);
  const isDisabled = status === 'reserved';

  return (
    <Button
      variant='outline'
      className={cn('h-12 w-12 p-0 text-xs', {
        'bg-primary text-primary-foreground hover:bg-primary/90': status === 'selected',
        'cursor-default hover:bg-white': status === 'available' && isSelectedMax,
        'text-muted-foreground cursor-not-allowed hover:bg-muted': status === 'reserved',
      })}
      onClick={() => onClick(seatCd)}
      disabled={isDisabled}
      aria-label={`座席 ${label}`}
    >
      {col}
    </Button>
  );
};
