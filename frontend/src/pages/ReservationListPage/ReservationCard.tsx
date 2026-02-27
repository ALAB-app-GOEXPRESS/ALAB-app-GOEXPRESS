import type { ReservationDetails } from '@/api/reservationApi';
import type { Reservation } from './useResavationList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatJapaneseDate, calcDurationMin, toHHMM } from '@/utils/dateTime';
import { formatSeat, normalizeTrainNumber } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge"
import { Ticket, QrCode } from 'lucide-react';

type props = {
  reservationItem: Reservation;
};

export const RreservationCard: React.FC<props> = ({ reservationItem }) => {
  const navigate = useNavigate();

  const departureTime = toHHMM(reservationItem.tickets[0].operation.departureDateTime.slice(11, 17));
  const arrivalTime = toHHMM(reservationItem.tickets[0].operation.arrivalDateTime.slice(11, 17));
  const durationMin = calcDurationMin(departureTime, arrivalTime);
  const validation = reservationItem.invalidFlg === true? "無効" : "有効";

  const reservationDetails: ReservationDetails = {
    confirmedSeat: formatSeat(reservationItem.tickets[0].seatCd),
    trackNumber: reservationItem.tickets[0].operation.fromTrackNumber,
    reservationDate: reservationItem.departureDate,
    trainDetails: {
      trainCd: reservationItem.tickets[0].trainCd,
      trainTypeName: reservationItem.tickets[0].trainTypeName,
      trainNumber: `${normalizeTrainNumber(reservationItem.tickets[0].trainNumber)}号`,
      departureTime,
      arrivalTime,
      departureStationCd: reservationItem.tickets[0].operation.fromStationCd,
      arrivalStationCd: reservationItem.tickets[0].operation.toStationCd,
      durationMin,
      remainSeatNumber: {
        reserved: 1,
        green: 0,
        grandclass: 0,
      },
    },
  };

  return (
    <Card className='border-brand-green-light my-4'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-left flex space-y-0.5'>
          <div className='flex flex-col grow-1 shrink-1 basis-0'>
            <p className='flex items-center text-xl font-semibold'>
              <Ticket />
              {reservationItem.tickets[0].trainTypeName + reservationItem.tickets[0].trainNumber}号
            </p>
            <p className='text-sm text-muted-foreground font-normal'>
              {reservationItem.tickets[0].operation.fromStationName}→
              {reservationItem.tickets[0].operation.toStationName}
            </p>
          </div>
          <div className='grow-1 shrink-1 basis-0 w-full text-right'>
            <Badge className=''>{validation}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-left gap-2'>
        <div className='flex item-left'>
          <div className='grow-1 shrink-1 basis-0'>
            <p className='text-sm text-muted-foreground font-normal'>出発</p>
            <p className='text-sm font-semibold'>{formatJapaneseDate(reservationItem.departureDate)}</p>
            <p className='text-sm'>{departureTime}</p>
          </div>
          <div className='grow-1 shrink-1 basis-0'>
            <p className='text-sm text-muted-foreground font-normal'>ホーム</p>
            <p className='text-sm font-semibold'>{reservationItem.tickets[0].operation.fromTrackNumber}番線</p>
          </div>
        </div>
        <div className='flex flex-col pt-2'>
          <p className='text-sm text-muted-foreground font-normal'>座席</p>
          <ul className='flex'>
            {reservationItem.tickets.map((ticket) => {
              return (
                <li key={ticket.seatCd}>
                  <Badge variant='outline'>{formatSeat(ticket.seatCd)}</Badge>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContent>
      <hr className='mx-4' />
      <CardFooter className='flex items-left gap-2 pt-2'>
        <p className='flex grow-1 shrink-1 text-xl font-semibold'>
          合計:\{reservationItem.tickets[0].charge.toString()}
        </p>
        <div className='flex grow-1 shrink-1 basis-0 justify-end gap-2'>
          {/* <Button>キャンセル</Button> */}
          <Button onClick={() => navigate('/reservation-detail', { state: { reservationDetails } })}>
            <QrCode />
            チケットを表示
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
