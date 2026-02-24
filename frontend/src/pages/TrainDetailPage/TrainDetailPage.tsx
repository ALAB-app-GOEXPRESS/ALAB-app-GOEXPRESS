import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { stationNameMap, type TrainResult, type SeatClass } from '@/api/TrainListApi';
import { formatJapaneseDate } from '@/utils/dateTime';
import { ArrowLeft, MapPin, TramFront } from 'lucide-react';
import { specifyTrainTypeIconColor } from '@/utils/train';

// 各座席クラスの追加情報（説明、料金など）を定義
const seatClassDetails = {
  reserved: {
    label: '指定席',
    description: '普通車指定席',
    price: 13320,
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
  },
  green: {
    label: 'グリーン車',
    description: '快適なシート',
    price: 18870,
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
  },
  grandclass: {
    label: 'グランクラス',
    description: '最上級の体験',
    price: 26620,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

// 金額をフォーマットするヘルパー関数
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

// 座席選択カードのコンポーネント
const SeatClassCard: React.FC<{
  seatType: SeatClass;
  remainingSeats: number;
}> = ({ seatType }) => {
  const details = seatClassDetails[seatType];

  const handleSelect = () => {
    alert(`${details.label}が選択されました。\n（ここから座席指定画面への遷移などを実装します）`);
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>{details.label}</CardTitle>
          {/* <Badge
            variant='outline'
            className={`shrink-0 ${details.badgeColor}`}
          >
            <Users className='mr-1 h-3 w-3' />
            {remainingSeats}
          </Badge> */}
        </div>
        <p className='text-sm text-muted-foreground'>{details.description}</p>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-end'>
        <p className='mb-4 text-2xl font-bold'>{formatCurrency(details.price)}</p>
        <Button
          onClick={handleSelect}
          className='w-full bg-green-600 hover:bg-green-700'
        >
          座席を選択
        </Button>
      </CardContent>
    </Card>
  );
};

// メインのページコンポーネント
export const TrainDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { train, searchDate } = (location.state || {}) as {
    train?: TrainResult;
    searchDate?: string;
  };

  if (!train || !searchDate) {
    return (
      <div className='p-4'>
        <p>列車情報が見つかりません。</p>
        <Button onClick={() => navigate(-1)}>戻る</Button>
      </div>
    );
  }

  const departureStationName = stationNameMap[train.departureStationCd];
  const arrivalStationName = stationNameMap[train.arrivalStationCd];

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='mx-auto max-w-4xl'>
        <Button
          variant='link'
          onClick={() => navigate(-1)}
          className='-ml-4 p-0 text-muted-foreground'
        >
          <ArrowLeft className='mr-1 h-4 w-4' />
          検索結果へ戻る
        </Button>

        <div className='mt-4 rounded-xl border bg-white p-6 shadow-sm'>
          {/* ヘッダー */}
          <div className='flex items-center gap-3'>
            <TramFront
              className={`${specifyTrainTypeIconColor(train.trainTypeName)} text-white text-[30px] rounded-sm`}
            />
            <div>
              <h1 className='text-2xl font-bold'>
                {train.trainTypeName} {train.trainNumber}
              </h1>
              <p className='text-muted-foreground'>
                {departureStationName} → {arrivalStationName}
              </p>
            </div>
          </div>

          {/* 出発・到着情報 */}
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>出発</p>
              <p className='text-4xl font-bold'>{train.departureTime}</p>
              <div className='mt-1 flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span>{departureStationName}</span>
              </div>
              <p className='mt-1 text-sm text-muted-foreground'>{formatJapaneseDate(searchDate)}</p>
              <p className='mt-1 text-sm text-muted-foreground'>{train.trackNumber}番線</p>
            </div>
            <div className='text-left'>
              <p className='text-sm text-muted-foreground'>到着</p>
              <p className='text-4xl font-bold'>{train.arrivalTime}</p>
              <div className='mt-1 flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span>{arrivalStationName}</span>
              </div>
              <p className='mt-1 text-sm text-muted-foreground'>{formatJapaneseDate(searchDate)}</p>
            </div>
          </div>

          {/* 空席状況 */}
          <div className='mt-8'>
            <h2 className='text-lg font-semibold'>空席状況</h2>
            <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <SeatClassCard
                seatType='reserved'
                remainingSeats={train.remainSeatNumber.reserved}
              />
              {/* <SeatClassCard
                seatType='green'
                remainingSeats={train.remainSeatNumber.green}
              />
              <SeatClassCard
                seatType='grandclass'
                remainingSeats={train.remainSeatNumber.grandclass}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
