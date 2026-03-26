import React from 'react';
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
import { useForm } from 'react-hook-form';

type ReservationConfirmState = {
  trainDetailResult: TrainDetailResult;
  selectedSeats: SelectedSeat[];
};

type FormValues = {
  buyerName: string;
  emailAddress: string;
};

export const ReservationConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useTypedLocation<ReservationConfirmState | undefined>();
  const state = location.state;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      buyerName: '',
      emailAddress: '',
    },
  });

  React.useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const trainDetailResult = state.trainDetailResult;
  const selectedSeats = state.selectedSeats;
  const totalPrice = selectedSeats.reduce((sum, item) => sum + item.price, 0);

  const onSubmit = async (data: FormValues) => {
    if (!trainDetailResult) return;

    try {
      const reservationDetails = await createReservation(
        {
          trainCd: trainDetailResult.trainCd,
          trainTypeName: trainDetailResult.trainTypeName,
          trainNumber: trainDetailResult.trainNumber,
          departureStationCd: trainDetailResult.departureStationCd as StationCode,
          arrivalStationCd: trainDetailResult.arrivalStationCd as StationCode,
          trackNumber: trainDetailResult.trackNumber,
          buyerName: data.buyerName,
          emailAddress: data.emailAddress,
          selectedSeat: selectedSeats,
        },
        trainDetailResult.date,
      );

      toast.success('予約が完了しました！', { position: 'bottom-right' });

      navigate('/reservation-result', {
        state: { reservationDetails },
      });
    } catch (error) {
      console.error(error);
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
                  座席を再選択する
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <CardContent className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>購入者氏名</Label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                      <Input
                        id='name'
                        placeholder='例：東日本 太朗'
                        aria-invalid={!!errors.buyerName}
                        aria-describedby={errors.buyerName ? 'name-error' : undefined}
                        className={`pl-9 ${errors.buyerName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register('buyerName', {
                          required: '氏名が入力されていません',
                          setValueAs: (v: string) => (typeof v === 'string' ? v.trim() : v),
                        })}
                      />
                    </div>
                    {errors.buyerName && (
                      <p
                        id='name-error'
                        className='mt-1 text-sm text-red-600'
                      >
                        {errors.buyerName.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>メールアドレス</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='例：higasinihon@example.com'
                        aria-invalid={!!errors.emailAddress}
                        aria-describedby={errors.emailAddress ? 'email-error' : undefined}
                        className={`pl-9 ${errors.emailAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register('emailAddress', {
                          required: 'メールアドレスが入力されていません',
                          setValueAs: (v: string) => (typeof v === 'string' ? v.trim() : v),
                        })}
                      />
                    </div>
                    {errors.emailAddress && (
                      <p
                        id='email-error'
                        className='mt-1 text-sm text-red-600'
                      >
                        {errors.emailAddress.message}
                      </p>
                    )}
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
                    type='submit'
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
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
