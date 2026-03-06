import type { TrainResult } from '@/api/TrainListApi';
import { formatSeat } from '@/lib/utils';
import { fetchJSON } from '@/lib/fetch';
import type { StationCode } from '@/types/Station';

export interface ReservationParams {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  trackNumber: string;
}

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

export const createReservation = async (
  reservationParams: ReservationParams,
  date: string,
): Promise<ReservationDetails> => {
  const API_ENDPOINT_CREATE = 'api/ticket-reservations';

  const createPayload = {
    trainCd: reservationParams.trainCd,
    departureStationCd: reservationParams.departureStationCd,
    arrivalStationCd: reservationParams.arrivalStationCd,
    departureDate: date,
  };

  const createResponse = await fetchJSON<{ resourceUri: string }>(API_ENDPOINT_CREATE, {
    method: 'POST',
    body: JSON.stringify(createPayload),
  });

  const detailResponse = await fetchJSON<ApiReservationResponse>(createResponse.resourceUri);

  const formattedData: ReservationDetails = {
    confirmedSeat: formatSeat(detailResponse.seatCd),
    trackNumber: detailResponse.departureTrackNumber,
    reservationDate: detailResponse.departureDate,
    trainDetails: {
      ...reservationParams,
      departureTime: detailResponse.departureTime.slice(0, 5),
      arrivalTime: detailResponse.arrivalTime.slice(0, 5),
    },
  };

  return formattedData;
};
