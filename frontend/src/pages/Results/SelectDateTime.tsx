import { Button } from "@/components/ui/button"
import { DateTimePicker } from "./DateTimePicker"


export const SelectDateTime: React.FC = () => {
    return (
        <div style={{display:"flex", alignItems:"center", backgroundColor:"#f5f5f5", borderRadius:"10px", minHeight:"2in"}}>
            <div style={{flex:"1 1 90%"}}>
                <DateTimePicker />
            </div>
            <div style={{flex:"1 1 10%", marginBottom:"0"}}>
                <Button style={{backgroundColor:"#008803"}}>日時指定</Button>
            </div>
        </div>
    )
}