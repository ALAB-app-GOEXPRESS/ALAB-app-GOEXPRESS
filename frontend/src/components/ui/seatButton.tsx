import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SeatStatus = 'available' | 'reserved' | 'selected';

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = SEAT_COLUMNS.length;

interface SeatButtonProps {
  seatId: string;
  status: SeatStatus;
  // onClick: (seatId: string) => void;
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

export const SeatButton: React.FC<SeatButtonProps> = ({ seatId, status }) => {
  const { col, label } = getSeatDisplayInfo(seatId);
  const isDisabled = status === 'reserved';

  return (
    <Button
      variant='outline'
      className={cn('h-10 w-10 p-0', {
        'bg-primary text-primary-foreground hover:bg-primary/90': status === 'selected',
        'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted': status === 'reserved',
      })}
      // onClick={() => onClick(seatId)}
      disabled={isDisabled}
      aria-label={`座席 ${label}`}
    >
      {col}
    </Button>
  );
};
