import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import styles from './ResultPage.module.css';

type Props = {
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  reservedSeats: number;
  greenSeats: number;
  grandclassSeats: number;
  onClickDetail: () => void;
};

export const TrainCard: React.FC<Props> = ({
  trainTypeName,
  trainNumber,
  departureTime,
  arrivalTime,
  departureStation,
  arrivalStation,
  reservedSeats,
  greenSeats,
  grandclassSeats,
  onClickDetail,
}) => {
  return (
    <Card>
      <CardContent className={styles.trainCardContent}>
        <div className={styles.trainCardRow}>
          <div className={styles.trainCardLeft}>
            <span className={styles.trainTypeMarker}>■</span>
            <div className={styles.trainTypeBlock}>
              <span className={styles.trainTypeName}>{trainTypeName}</span>
              <span className={styles.trainNumber}>{trainNumber}</span>
            </div>
          </div>

          <div className={styles.trainCardCenter}>
            <div className={styles.stationBlock}>
              <span className={styles.time}>{departureTime}</span>
              <span className={styles.stationName}>{departureStation}</span>
            </div>

            <div
              className={styles.timeLine}
              aria-hidden='true'
            >
              <span className={styles.timeLineText}>＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿</span>
            </div>

            <div className={styles.stationBlock}>
              <span className={styles.time}>{arrivalTime}</span>
              <span className={styles.stationName}>{arrivalStation}</span>
            </div>
          </div>

          <div className={styles.trainCardRight}>
            <div className={styles.badgeRow}>
              <Button
                variant='outline'
                size='sm'
              >
                指定 {reservedSeats}
              </Button>
              <Button
                variant='outline'
                size='sm'
              >
                G {greenSeats}
              </Button>
              <Button
                variant='outline'
                size='sm'
              >
                グラン {grandclassSeats}
              </Button>
            </div>

            <div className={styles.detailRow}>
              <Button onClick={onClickDetail}>詳細を見る</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
