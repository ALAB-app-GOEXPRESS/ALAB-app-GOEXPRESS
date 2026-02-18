import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stationNameMap, type TrainResult } from '@/api/mockTrainApi';
import { ArrowLeft, Clock, MapPin, TrainFront } from 'lucide-react';

const formatDateToJapanese = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return `${adjustedDate.getFullYear()}年${adjustedDate.getMonth() + 1}月${adjustedDate.getDate()}日`;
  } catch (e) {
    return dateString;
  }
};

const ErrorDisplay: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-6'>
      <h1 className='text-2xl font-bold'>エラー</h1>
      <Card className='mt-6'>
        <CardContent className='p-6'>
          <p>予約情報が見つかりませんでした。お手数ですが、前の画面から再度操作をしてください。</p>
        </CardContent>
      </Card>
      <div className='mt-6'>
        <Button variant="outline" onClick={() => navigate(-1)}>
          前の画面に戻る
        </Button>
      </div>
    </div>
  );
};

export const ReservationDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedTrain, searchDate, seatNumber } = (location.state || {}) as {
    selectedTrain?: TrainResult & { platform?: string };
    searchDate?: string;
    seatNumber?: string;
  };

  if (!selectedTrain || !searchDate) {
    return (
      <div className='min-h-[calc(100vh-64px)] bg-background'>
        <ErrorDisplay />
      </div>
    );
  }

  const departureName = stationNameMap[selectedTrain.departureStationCd];
  const arrivalName = stationNameMap[selectedTrain.arrivalStationCd];

  const qrCodeData = {
    departureTime: selectedTrain.departureTime,
    arrivalTime: selectedTrain.arrivalTime,
    departureStation: departureName,
    arrivalStation: arrivalName,
    date: searchDate,
    seat: seatNumber ?? '指定なし',
  };

  // 作成したデータをJSON文字列に変換します
  const qrCodeValue = JSON.stringify(qrCodeData);

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-md px-4 py-6'>
        <div className='mb-4'>
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className='p-0 h-auto text-muted-foreground flex items-center gap-1 -ml-1'
          >
            <ArrowLeft className='h-4 w-4' />
            検索結果へ戻る
          </Button>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center flex flex-col space-y-0.5">
              <p className='text-xl font-semibold'>{selectedTrain.trainTypeName}</p>
              <p className='text-sm text-muted-foreground font-normal'>{selectedTrain.trainNumber}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2 pt-2">
            <QRCodeSVG value={qrCodeValue} size={180} />
            <p className="text-xs text-muted-foreground">QRコード</p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="py-4 px-6">
            <div className="grid grid-cols-2 items-start">
              <div>
                <p className="text-sm text-muted-foreground">出発</p>
                <p className="text-2xl font-semibold leading-tight">{selectedTrain.departureTime}</p>
                <p className="text-base">{departureName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">到着</p>
                <p className="text-2xl font-semibold leading-tight">{selectedTrain.arrivalTime}</p>
                <p className="text-base">{arrivalName}</p>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p>{selectedTrain.platform ?? '-'} 番線</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p>{formatDateToJapanese(searchDate)}</p>
              </div>
            </div>

            <figure className="mt-4">
              <figcaption className="text-sm text-muted-foreground mb-2">座席</figcaption>
              <div className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1">
                <TrainFront className="h-4 w-4 text-green-700 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-700">{seatNumber ?? '指定なし'}</p>
              </div>
            </figure>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
