import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatSeat } from '@/utils/seat';
import { Mail, User, Loader2, TramFront } from 'lucide-react';
import { createReservation } from '@/api/ReservationApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { TrainDetailResult } from '@/api/TrainDetailApi';
import type { SelectedSeat } from '@/types/Seat';
import { useTypedLocation } from '@/lib/router';
import type { StationCode } from '@/types/Station';
import { Badge } from '@/components/ui/badge';
import { specifyTrainTypeIconColor } from '@/utils/train';

type ReservationConfirmState = {
  trainDetailResult: TrainDetailResult;
  selectedSeats: SelectedSeat[];
};

export const ReservationConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useTypedLocation<ReservationConfirmState | undefined>();

  const [buyerName, setName] = useState('');
  const [emailAddress, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state;

  if (!state) {
    navigate(-1);
    return <></>;
  }

  const trainDetailResult = state.trainDetailResult;
  const selectedSeats = state.selectedSeats;
  const totalPrice = selectedSeats.reduce((sum, item) => sum + item.price, 0);

  const handleReserve = async () => {
    if (!buyerName || !emailAddress) {
      alert('購入者氏名とメールアドレスを入力してください。');
      return;
    }

    if (!trainDetailResult) return;

    setIsSubmitting(true);

    try {
      const reservationDetails = await createReservation(
        {
          trainCd: trainDetailResult.trainCd,
          trainTypeName: trainDetailResult.trainTypeName,
          trainNumber: trainDetailResult.trainNumber,
          departureStationCd: trainDetailResult.departureStationCd as StationCode,
          arrivalStationCd: trainDetailResult.arrivalStationCd as StationCode,
          trackNumber: trainDetailResult.trackNumber,
          buyerName: buyerName,
          emailAddress: emailAddress,
          selectedSeat: selectedSeats,
        },
        trainDetailResult.date,
      );

      toast.success('予約が完了しました！', { position: 'bottom-right' });

      navigate('/reservation-result', {
        state: { reservationDetails },
      });
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        toast.error('選択した座席は既に予約されています。再度座席を選択してください。', {
          position: 'bottom-right',
          duration: 5000,
        });

        navigate(`/seat-map`, {
          replace: true,
          state: {
            seatClasses: trainDetailResult.seatClasses,
            trainDetail: trainDetailResult,
          },
        });
      } else {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>予約内容の確認</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex gap-2 items-center'>
                  <TramFront
                    className={`${specifyTrainTypeIconColor(trainDetailResult.trainTypeName)} text-white text-[30px] rounded-sm`}
                  />

                  <div className='flex flex-col'>
                    <span className='font-sans text-[20px] font-bold'>
                      {trainDetailResult.trainTypeName}
                      {trainDetailResult.trainNumber}
                    </span>
                  </div>
                </div>
                <p className='font-semibold pt-2'>
                  {trainDetailResult.departureStationName} → {trainDetailResult.arrivalStationName}
                </p>
                <p className='text-sm text-gray-500'>
                  {new Date(trainDetailResult.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  {trainDetailResult.departureTime} 発
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  variant='link'
                  onClick={() => navigate(-1)}
                  className='p-0 text-sm'
                >
                  座席選択に戻る
                </Button>
                <div className='space-y-3'>
                  {selectedSeats.map((seat, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <div className='flex min-w-38 justify-between'>
                        <span>{formatSeat(seat.seatCd)}</span>
                        <Badge variant='outline'>{seat.seatTypeName}</Badge>
                      </div>
                      <p className='font-semibold'>¥{seat.price.toLocaleString()}</p>
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
                      value={buyerName}
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
                      value={emailAddress}
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
                  <p className='text-right text-primary text-3xl'>¥{totalPrice.toLocaleString()}</p>
                </div>
                <Button
                  onClick={handleReserve}
                  className='w-full'
                  size='lg'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      予約処理中...
                    </>
                  ) : (
                    '予約を確定'
                  )}
                </Button>
                {isSubmitting && (
                  <p className='mt-2 text-sm text-center text-muted-foreground'>
                    画面を閉じず、しばらくお待ちください。
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
