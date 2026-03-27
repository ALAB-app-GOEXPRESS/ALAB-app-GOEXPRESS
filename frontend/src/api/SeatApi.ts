import { fetchJSON } from '@/lib/fetch';
import { calcCarNumber } from '@/utils/seat';

export type SeatBetweenApiItem = {
  seatCd: string;
};

export type SeatsParams = {
  trainCd: string;
  departureDate: string;
};

export type ReservedSeat = {
  seatCd: string;
  carNumber: number;
};

export async function FetchSeats(params: SeatsParams) {
  const endpoint = `/api/seats?train_cd=${encodeURIComponent(params.trainCd)}&departure_date=${encodeURIComponent(params.departureDate)}`;

  const data = await fetchJSON<SeatBetweenApiItem[]>(endpoint);

  const reservedSeats: ReservedSeat[] = data.map((seat) => {
    return {
      seatCd: seat.seatCd,
      carNumber: calcCarNumber(seat.seatCd),
    };
  });

  return reservedSeats;
}
