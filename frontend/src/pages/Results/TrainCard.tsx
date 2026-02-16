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
import style from './ResultPage.module.css';

type props = {
  departureStation: string;
  arrivalStation: string;
}

export const TrainCard: React.FC<props> = ({ departureStation, arrivalStation }) => {
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
              <span style={{ color: 'gray' }}>{departureStation}</span>
            </div>
            <div style={{ flex:"1 1 60%", display:"flex", position:"relative", justifyContent:"center", alignItems:"center" }}>
              <hr style={{ position:"absolute", borderColor:"#008803", borderWidth:"1px", width:"100%", zIndex:"10" }} />
              <span style={{width:"20px", height:"20px", borderRadius:"50%", borderColor:"#000000", borderWidth:"3px", backgroundColor:"#ffffff", position:"absolute", zIndex:"20"}} />
            </div>
            <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column' }}>
              <span className={style.time}>06:39</span>
              <span style={{ color: 'gray' }}>{arrivalStation}</span>
            </div>
          </div>

          <div style={{ flex: '1 1 15%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
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
              <Button style={{backgroundColor:"#008803"}}>詳細を見る</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
