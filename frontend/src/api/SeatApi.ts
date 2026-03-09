import { fetchJSON } from '@/lib/fetch';

export type SeatBetweenApiItem = {
    seatCd: string;
}

export type SeatsParams = {
    trainCd: string;
    departureDate: string;
};

export type ReservedSeat = {
    seatCd: string;
    carNumber: number;
}

export async function FetchSeats(params: SeatsParams) {
    const endpoint = `/api/seats?train_cd=${encodeURIComponent(params.trainCd)}&departure_date=${encodeURIComponent(params.departureDate)}`;

    const data = await fetchJSON<SeatBetweenApiItem[]>(endpoint);

    const resetvedSeats: ReservedSeat[] = data.map((seat) => {
        return {
            seatCd: seat.seatCd,
            carNumber: Math.floor((parseInt(seat.seatCd) - 1) / 75) + 1
        }
    });

    return resetvedSeats;
};