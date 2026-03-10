import type { TrainResult } from '@/api/TrainListApi';
import { formatSeat } from '@/utils/seat';
import { fetchJSON } from '@/lib/fetch';
import type { StationCode } from '@/types/Station';
import { toHHMM } from '@/utils/dateTime';
import { normalizeTrainNumber } from '@/utils/train';

export type ReservationListItem = {
  items: ReservationItem[];
  page: Page;
  _links: _links;
};

export type ReservationItem = {
  reservationId: number;
  invalidFlg: boolean;
  departureDate: string;
  buyDatetime: string;
  buyerName: string;
  emailAddress: string;
  tickets: Ticket[];
  _links: _links;
};

export type Ticket = {
  departureDate: string;
  trainCarCd: string;
  seatCd: string;
  charge: number;
  userName: string;
  emailAddress: string;
  status: TicketStatus;
  trainName: TrainName;
  operation: Operation;
};

export type TrainName = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
};

export type Operation = {
  fromStationCd: StationCode;
  fromStationName: string;
  fromTrackNumber: string;
  toStationCd: StationCode;
  toStationName: string;
  toTrackNumber: string;
  departureDateTime: string;
  arrivalDateTime: string;
};

export type TicketStatus = 'unused' | 'used' | 'canceled';

export type Page = {
  number: number;
  size: number;
  totalElements: number;
};

export type _links = {
  self: string;
  tickets: string | null;
};

export type FetchReservationListResponse = {
  totalCount: number;
  results: ReservationItem[];
};

export async function fetchReservations(page: number, size: number): Promise<FetchReservationListResponse> {
  const safePage = Math.max(0, page);
  const safeSize = Math.max(0, size);

  const endpoint = `/api/reservations?page=${safePage}&size=${safeSize}`;
  const data = await fetchJSON<ReservationListItem>(endpoint);

  const converted: ReservationItem[] = data.items;

  const totalCount = data.page.totalElements;

  const results = converted;

  return { totalCount, results };
}

export interface ReservationParams {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  trackNumber: string;
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
  const API_ENDPOINT_CREATE = 'api/reservations';

  const createPayload = {
    trainCd: reservationParams.trainCd,
    departureStationCd: reservationParams.departureStationCd,
    arrivalStationCd: reservationParams.arrivalStationCd,
    departureDate: date,
  };

  const createResponse = await fetchJSON<{
    _links: {
      self: string;
      tickets: string;
    };
  }>(API_ENDPOINT_CREATE, {
    method: 'POST',
    body: JSON.stringify(createPayload),
  });

  const detailResponse = await fetchJSON<ReservationItem>(createResponse._links.self);

  const ticket = detailResponse.tickets[0];
  const operation = ticket.operation;
  const trainName = ticket.trainName;

  const formattedData: ReservationDetails = {
    confirmedSeat: formatSeat(ticket.seatCd),
    trackNumber: operation.fromTrackNumber,
    reservationDate: detailResponse.departureDate,
    trainDetails: {
      trainCd: trainName.trainCd,
      trainTypeName: trainName.trainTypeName,
      trainNumber: `${normalizeTrainNumber(trainName.trainNumber)}号`,
      departureTime: toHHMM(operation.departureDateTime.slice(11, 17)),
      arrivalTime: toHHMM(operation.arrivalDateTime.slice(11, 17)),
      departureStationCd: operation.fromStationCd,
      arrivalStationCd: operation.toStationCd,
      trackNumber: operation.fromTrackNumber,
    },
  };

  return formattedData;
};
