import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TrainResult } from '@/api/TrainListApi';
import { Clock, MapPin, TrainFront } from 'lucide-react';
import { formatJapaneseDate } from '@/utils/dateTime';
import { Badge } from '@/components/ui/badge';

type Props = {
  trainDetails: TrainResult;
  confirmedSeats: string[];
  reservationDate: string;
  trackNumber: string;
  departureStationName: string;
  arrivalStationName: string;
};

export const ReservationDetail: React.FC<Props> = ({
  trainDetails,
  confirmedSeats,
  reservationDate,
  trackNumber,
  departureStationName,
  arrivalStationName,
}) => {
  const qrCodeData = {
    date: reservationDate,
    departure: `${trainDetails.departureTime} ${departureStationName}`,
    arrival: `${trainDetails.arrivalTime} ${arrivalStationName}`,
    seat: confirmedSeats[0],
  };

  const qrCodeJson = JSON.stringify(qrCodeData);

  return (
    <>
      <Card className='border-brand-green-light'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-center flex flex-col space-y-0.5'>
            <p className='text-xl font-semibold'>{trainDetails.trainTypeName}</p>
            <p className='text-sm text-muted-foreground font-normal'>{trainDetails.trainNumber}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-2 pt-2'>
          <QRCodeSVG
            value={qrCodeJson}
            size={180}
          />
        </CardContent>
      </Card>

      <Card className='mt-4 border-brand-green-light'>
        <CardContent className='py-4 px-6'>
          <div className='grid grid-cols-2 items-start'>
            <div>
              <p className='text-sm text-muted-foreground'>出発</p>
              <p className='text-2xl font-semibold leading-tight'>{trainDetails.departureTime}</p>
              <p className='text-base'>{departureStationName}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>到着</p>
              <p className='text-2xl font-semibold leading-tight'>{trainDetails.arrivalTime}</p>
              <p className='text-base'>{arrivalStationName}</p>
            </div>
          </div>

          <div className='mt-4 space-y-2 text-sm'>
            <div className='flex items-center gap-3'>
              <MapPin className='h-4 w-4 text-muted-foreground shrink-0' />
              <p>{trackNumber}番線</p>
            </div>
            <div className='flex items-center gap-3'>
              <Clock className='h-4 w-4 text-muted-foreground shrink-0' />
              <p>{formatJapaneseDate(reservationDate)}</p>
            </div>
          </div>

          <figure className='mt-4'>
            <figcaption className='text-sm text-muted-foreground mb-2'>座席</figcaption>
            <div className='flex gap-2 flex-wrap'>
              {confirmedSeats.map((seat) => {
                return (
                  <div>
                    <div className='inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-1'>
                      <TrainFront className='h-3 w-3 text-green-700 shrink-0' />
                      <p className='text-xs font-semibold text-green-700'>{seat}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </figure>
        </CardContent>
      </Card>
    </>
  );
};
