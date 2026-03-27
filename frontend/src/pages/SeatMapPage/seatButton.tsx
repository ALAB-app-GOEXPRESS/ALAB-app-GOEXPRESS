import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { calcCarNumber } from '@/utils/seat';

export type SeatStatus = 'available' | 'reserved' | 'selected';

const DEFAULT_COLUMNS = ['A', 'B', 'C', 'D', 'E'] as const;
const GREEN_COLUMNS = ['A', 'B', 'C', 'D'] as const; // 9号車
const GRAN_COLUMNS = ['A', 'B', 'C'] as const; // 10

const getSeatColumnsByCar = (carNumber: number) => {
  if (carNumber === 9) return GREEN_COLUMNS;
  if (carNumber === 10) return GRAN_COLUMNS;
  return DEFAULT_COLUMNS;
};

interface SeatButtonProps {
  seatCd: string;
  status: SeatStatus;
  onClick: (seatId: string) => void;
  isSelectedMax: boolean;
}

const getSeatDisplayInfo = (seatCd: string) => {
  const columns = getSeatColumnsByCar(calcCarNumber(seatCd));
  const seatsPerRow = columns.length;

  let seatOffset = 1;

  switch (calcCarNumber(seatCd)) {
    case 10:
      seatOffset = 657;
      break;
    case 9:
      seatOffset = 601;
      break;
    default:
      break;
  }

  const seatIndex = parseInt(seatCd, 10) - seatOffset;
  console.log('seatInd:' + seatIndex);
  const row = Math.floor(seatIndex / seatsPerRow) + 1;
  const col = columns[seatIndex % seatsPerRow];
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
