import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stationNameMap } from '@/api/TrainListApi';
import type { ReservationDetails } from '@/api/ReservationApi';
import { ReservationDetail } from './ReservationDetail';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';

const ErrorDisplay: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-6'>
      <h1 className='text-2xl font-bold'>エラー</h1>
      <Card className='mt-6'>
        <CardContent className='p-6'>
          <p>予約処理に失敗しました。お手数ですが、前の画面から再度操作をしてください。</p>
        </CardContent>
      </Card>
      <div className='mt-6'>
        <Button
          variant='outline'
          onClick={() => navigate(-1)}
        >
          前の画面に戻る
        </Button>
      </div>
    </div>
  );
};

export const ReservationResultPage: React.FC = () => {
  const location = useLocation();

  const [isShownSnackBar, setIsShownSnackBar] = useState(true);

  const { reservationDetails } = (location.state || {}) as {
    reservationDetails?: ReservationDetails;
  };

  if (!reservationDetails) {
    return (
      <div className='min-h-[calc(100vh-64px)] bg-background'>
        <ErrorDisplay />
      </div>
    );
  }

  const { trainDetails, confirmedSeat, reservationDate, trackNumber } = reservationDetails;
  const departureStationCd = stationNameMap[trainDetails.departureStationCd];
  const arrivalStationCd = stationNameMap[trainDetails.arrivalStationCd];

  return (
    <div>
      <ReservationDetail
        trainDetails={trainDetails}
        confirmedSeat={confirmedSeat}
        reservationDate={reservationDate}
        trackNumber={trackNumber}
        departureStationName={departureStationCd}
        arrivalStationName={arrivalStationCd}
      />
      <AnimatePresence>
        {isShownSnackBar && (
          <motion.div
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 3 } }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className='fixed bottom-4 right-4 bg-popover text-popover-foreground px-6 py-4 rounded-lg shadow-lg border border-primary flex items-center gap-4 max-w-2xl'
            onAnimationComplete={() => setIsShownSnackBar(false)}
          >
            <CheckCircle2Icon />
            <span className='font-bold'>予約が完了しました！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
