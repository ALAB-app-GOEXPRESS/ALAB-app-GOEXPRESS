import { fetchJSON } from '@/lib/fetch';
import { formatSeat } from '@/lib/utils';

export type SeatBetweenApiItem = {
    seatCd: string;
}

export type SeatsParams = {
    trainCd: string;
    departureDate: string;
};

export type ReservedSeat = {
    convertedSeat: string;
}

export async function FetchSeats(params: SeatsParams) {
    const endpoint = `/api/seats?traind_cd=${encodeURIComponent(params.trainCd)}&departure_date=${encodeURIComponent(params.departureDate)}`;

    const data = await fetchJSON<SeatBetweenApiItem[]>(endpoint);

    const converted: ReservedSeat[] = data.map((seat) => {
        return {
            convertedSeat: formatSeat(seat.seatCd)
        }
    });

    return converted;
};