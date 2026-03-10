import type { SeatClass } from "@/utils/seat";

export interface SelectedSeat {
  carNumber: number;
  seatCd: string;
  seatType: SeatClass;
  price: number;
}
