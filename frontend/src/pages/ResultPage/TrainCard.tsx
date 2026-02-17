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
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1 1 15%', display: 'flex' }}>
            <span style={{ color: 'green', fontSize: '30px' }}>■</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'san-serif' }}>{trainTypeName}</span>
              <span style={{ color: 'gray' }}>{trainNumber}</span>
            </div>
          </div>

          <div style={{ flex: '1 1 70%', display: 'flex' }}>
            <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column' }}>
              <span className={styles.time}>{departureTime}</span>
              <span style={{ color: 'gray' }}>{departureStation}</span>
            </div>

            <div
              style={{
                flex: '1 1 60%',
                display: 'flex',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <hr
                style={{
                  position: 'absolute',
                  borderColor: '#008803',
                  borderWidth: '1px',
                  width: '100%',
                  zIndex: '10',
                }}
              />
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  borderColor: '#000000',
                  borderWidth: '3px',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  zIndex: '20',
                }}
              />
            </div>

            <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column' }}>
              <span className={styles.time}>{arrivalTime}</span>
              <span style={{ color: 'gray' }}>{arrivalStation}</span>
            </div>
          </div>

          <div style={{ flex: '1 1 15%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
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

            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button onClick={onClickDetail}>詳細を見る</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
