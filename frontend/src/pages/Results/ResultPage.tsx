import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TrainCard } from "./TrainCard";
import { ShowReturnPathButton } from "./showReturnPathButton";
import { SelectDateTime } from "./SelectDateTime";
import { DateTimePicker } from "./DateTimePicker";

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

        <TrainCard
          departureStation={departureStation}
          arrivalStation={arrivalStation}
        />
      </div>
    );
};