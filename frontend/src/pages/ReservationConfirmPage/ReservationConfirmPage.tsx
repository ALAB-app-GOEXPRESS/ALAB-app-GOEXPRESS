import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatSeat } from '@/lib/utils';
import { ArrowLeft, Mail, User } from 'lucide-react';

// --- ここからダミーデータ ---
// 本来は前の画面から渡されるデータですが、レイアウト確認のためにここで定義します。
const trainDetail = {
  trainNumber: '1',
  trainTypeName: 'はやぶさ',
  departureStationName: '東京',
  arrivalStationName: '上野',
  date: '2026-02-04T06:32:00',
};

const selectedSeats = [
  { carNumber: 8, seatId: '805A' },
  { carNumber: 8, seatId: '805B' },
  { carNumber: 8, seatId: '805C' },
];

const pricePerSeat = 18870;
// --- ここまでダミーデータ ---

export const ReservationConfirmPage: React.FC = () => {
  // お客様情報を管理するための状態
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const totalPrice = selectedSeats.length * pricePerSeat;

  // 予約確定ボタンが押されたときの仮の処理
  const handleConfirmReservation = () => {
    if (!name || !email) {
      alert('購入者氏名とメールアドレスを入力してください。');
      return;
    }
    alert(`氏名: ${name}, メールアドレス: ${email} で予約処理を行います。（これはダミーの動作です）`);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='max-w-6xl mx-auto'>
        <Button
          variant='link'
          onClick={() => alert('座席選択ページに戻ります。（ダミー）')}
          className='p-0 text-black mb-4'
        >
          <ArrowLeft className='mr-1 h-4 w-4' />
          座席選択に戻る
        </Button>

        <h1 className='text-3xl font-bold mb-6'>予約内容の確認</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <span className='bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded'>
                    {trainDetail.trainTypeName}
                  </span>
                  <p className='text-xl font-bold'>{trainDetail.trainNumber}号</p>
                </div>
                <p className='font-semibold pt-2'>
                  {trainDetail.departureStationName} → {trainDetail.arrivalStationName}
                </p>
                <p className='text-sm text-gray-500'>
                  {new Date(trainDetail.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  06:32 発
                </p>
              </CardHeader>
              <CardContent>
                <Separator className='mb-4' />
                <h3 className='font-semibold mb-3'>選択した座席</h3>
                <div className='space-y-3'>
                  {selectedSeats.map((seat, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <p>{formatSeat(seat.seatId)}</p>
                      <p className='font-semibold'>¥{pricePerSeat.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <Card className='sticky top-8'>
              <CardHeader>
                <CardTitle>予約内容の確認</CardTitle>
                <p className='text-sm text-gray-600'>内容をご確認の上、予約を確定してください。</p>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>購入者氏名</Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='name'
                      placeholder='例：東日本 太朗'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='pl-9'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>メールアドレス</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='例：higasinihon@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='pl-9'
                    />
                  </div>
                </div>
                <Separator className='mb-4' />
                <div className='grid grid-cols-2 items-center text-sm'>
                  <p className='text-gray-600'>座席数合計:</p>
                  <p className='text-right'>{selectedSeats.length}席</p>
                </div>{' '}
                <div className='grid grid-cols-2 items-center font-bold text-xl'>
                  <p>お支払い合計:</p>
                  <p className='text-right text-primary'>¥{totalPrice.toLocaleString()}</p>
                </div>
                <Button
                  onClick={handleConfirmReservation}
                  className='w-full'
                  size='lg'
                >
                  予約を確定
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
