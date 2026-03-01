import type { TrainResult } from '@/api/TrainListApi';
import { formatSeat } from '@/lib/utils';
import { fetchJSON } from '@/lib/fetch';

interface ApiReservationResponse {
  departureTime: string;
  arrivalTime: string;
  departureTrackNumber: string;
  departureDate: string;
  seatCd: string;
}

export interface ReservationDetails {
  confirmedSeat: string;
  trackNumber: string;
  reservationDate: string;
  trainDetails: TrainResult;
}

export const createReservation = async (train: TrainResult, date: string): Promise<ReservationDetails> => {
  const API_ENDPOINT = 'api/ticket-reservations';

  const payload = {
    trainCd: train.trainCd,
    departureStationCd: train.departureStationCd,
    arrivalStationCd: train.arrivalStationCd,
    departureDate: date,
  };

  const responseData = await fetchJSON<ApiReservationResponse>(API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const formattedData: ReservationDetails = {
    confirmedSeat: formatSeat(responseData.seatCd),
    trackNumber: responseData.departureTrackNumber,
    reservationDate: responseData.departureDate,
    trainDetails: {
      ...train,
      departureTime: responseData.departureTime.slice(0, 5),
      arrivalTime: responseData.arrivalTime.slice(0, 5),
    },
  };

  return formattedData;
};
