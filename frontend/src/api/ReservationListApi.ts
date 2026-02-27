import type { StationCode } from './TrainListApi';

export type ReservationListItem = {
  item: ReservationItem;
  page: Page;
  _link: _link;
};

export type ReservationItem = {
  reservationId: number;
  invalidFlg: boolean;
  departureDate: string;
  buyDatetime: string;
  buyerName: string;
  emailAddress: string;
  tickets: Ticket[];
  _link: _link;
};

export type Ticket = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureDate: string;
  trainCarCd: string;
  seatCd: string;
  charge: number;
  userName: string;
  emailAddress: string;
  status: TicketStatus;
  operation: Operation;
};

export type Operation = {
  fromStationCd: StationCode;
  fromStationName: string;
  toStationCd: StationCode;
  toStationName: string;
  departureDateTime: string;
  arrivalDateTime: string;
  departureTrackNumber: string;
  arrivalTrackNumber: string;
};

export type TicketStatus = "unused" | "used" | "canceled";

export type Page = {
    number: number;
    size: number;
    totalElements: number;
};

export type _link = {
    self: string;
    tickets: string | null;
}

export type FetchReservationListResponse = {
  totalCount: number;
  results: ReservationItem[];
};

export async function fetchReservations(
  page: number,
  size: number,
): Promise<FetchReservationListResponse> {
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

  const data = (await res.json()) as ReservationListItem[];

  const converted: ReservationItem[] = data.map((item) => {
    return item.item;
  });

  const totalCount = converted.length;
  const results = converted.slice(safePage, safePage + safeSize);

  return { totalCount, results };
}