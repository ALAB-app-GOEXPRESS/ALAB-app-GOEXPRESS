import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import style from './ResultsPage.module.css';

export const TrainCard: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1 1 15%', display: 'flex' }}>
            <span style={{ color: 'green', fontSize: '30px' }}>■</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'san-serif' }}>はやぶさ</span>
              <span style={{ color: 'gray' }}>5号</span>
            </div>
          </div>

          <div style={{ flex: '1 1 70%', display: 'flex' }}>
            <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column' }}>
              <span className={style.time}>06:32</span>
              <span style={{ color: 'gray' }}>東京</span>
            </div>
            <div className={style.timeLine}>
              <span>＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿</span>
            </div>
            <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column' }}>
              <span className={style.time}>06:39</span>
              <span style={{ color: 'gray' }}>上野</span>
            </div>
          </div>

          <div style={{ flex: '1 1 15%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'end' }}>
              <Button
                variant='outline'
                size='sm'
              >
                nnn
              </Button>
              <Button
                variant='outline'
                size='sm'
              >
                nnn
              </Button>
              <Button
                variant='outline'
                size='sm'
              >
                nnn
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button>詳細を見る</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
