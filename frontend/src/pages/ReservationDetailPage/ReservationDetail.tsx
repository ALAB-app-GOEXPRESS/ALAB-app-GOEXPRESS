import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type TrainResult } from '@/api/TrainListApi';
import { ArrowLeft, Clock, MapPin, TrainFront } from 'lucide-react';
import { formatJapaneseDate } from '@/utils/dateTime';

type props = {
  trainDetails: TrainResult;
  confirmedSeat: string;
  reservationDate: string;
  trackNumber: string;
  departureStationName: string;
  arrivalStationName: string;
};

export const ReservationDetail: React.FC<props> = ({
  trainDetails,
  confirmedSeat,
  reservationDate,
  trackNumber,
  departureStationName,
  arrivalStationName,
}) => {
  const navigate = useNavigate();

  const qrCodeData = {
    date: reservationDate,
    departure: `${trainDetails.departureTime} ${departureStationName}`,
    arrival: `${trainDetails.arrivalTime} ${arrivalStationName}`,
    seat: confirmedSeat,
  };

  const qrCodeJson = JSON.stringify(qrCodeData);

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-md px-4 py-6'>
        <div className='mb-4'>
          <Button
            variant='link'
            onClick={() => navigate(-1)}
            className='p-0 h-auto text-muted-foreground flex items-center gap-1 -ml-1'
          >
            <ArrowLeft className='h-4 w-4' />
            検索結果へ戻る
          </Button>
        </div>
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
              <div className='inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1'>
                <TrainFront className='h-4 w-4 text-green-700 shrink-0' />
                <p className='text-sm font-semibold text-green-700'>{confirmedSeat}</p>
              </div>
            </figure>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
