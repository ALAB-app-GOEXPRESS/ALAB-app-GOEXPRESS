import type { StationCode } from './TrainListApi';

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

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`fetchTrains failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as ReservationListItem;

  const converted: ReservationItem[] = data.items;

  const totalCount = data.page.totalElements;

  const results = converted;

  return { totalCount, results };
}
