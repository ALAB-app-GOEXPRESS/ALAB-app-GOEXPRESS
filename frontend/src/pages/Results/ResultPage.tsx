import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TrainCard } from "./TrainCard";
import { ShowReturnPathButton } from "./ShowReturnPathButton";
import { DateTimePicker } from "./DateTimePicker";
import { ClassList } from "./ClassList";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Clock } from 'lucide-react';
import { nowHHMM, todayYYYYMMDD } from '@/utils/date';

import { stationNameMap, type SeatClass, type TrainSearchParams } from '@/api/mockTrainApi';

import { useTrainResults } from './useTrainResults';

type SeatClassFilter = 'all' | SeatClass;

const seatClassFilterOptions = [
  { value: 'all', label: '全クラス' },
  { value: 'reserved', label: '指定席' },
  { value: 'green', label: 'グリーン' },
  { value: 'grandclass', label: 'グランクラス' },
] as const;


export const ResultPage: React.FC = () => {
    const [departureStation, setDepartureStation] = useState("東京");
    const [arrivalStation, setArrivalStation] = useState("上野");

    const showReturnPath = () => {
        setDepartureStation(arrivalStation);
        setArrivalStation(departureStation);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap:"20px" }}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 80%', display:"flex", gap:"10px" }}>
            <span className='font-bold text-3xl'>
              {departureStation} → {arrivalStation}
            </span>
            <ShowReturnPathButton onClick={showReturnPath} />
          </div>
          <div style={{flex:"1 1 20%", display:"flex", justifyContent:"end"}}>
            <Button variant="outline">ホーム</Button>
          </div>
        </div>

        <div style={{width:"100%", backgroundColor:"#f5f5f5", borderRadius:"10px"}}>
            <DateTimePicker />
        </div>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <ClassList />
            <span style={{color:"#a9a9a9"}}>nn件の列車が見つかりました</span>
        </div>

        <TrainCard
          departureStation={departureStation}
          arrivalStation={arrivalStation}
        />
      </div>
    );
};