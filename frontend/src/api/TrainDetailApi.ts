import type { StationCode } from './TrainListApi';
import { stationNameMap } from './TrainListApi';

export type TrainDetailApiItem = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  fromStationCd: StationCode;
  toStationCd: StationCode;
  departureTime: string; // "HH:mm"
  arrivalTime: string; // "HH:mm"
  trackNumber: string;
  seatClasses: Array<{
    seatTypeCd: string;
    seatTypeName: string;
    charge: number;
    remainingSeats: number;
  }>;
};

export type SeatClassDetail = {
  type: 'reserved' | 'green' | 'grandclass';
  name: string;
  description: string;
  price: number;
  remainingSeats: number;
};

export type TrainDetailResult = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStationName: string;
  arrivalStationName: string;
  trackNumber: string;
  date: string;
  seatClasses: SeatClassDetail[];
};

export type TrainDetailParams = {
  trainCd: string;
  from: StationCode;
  to: StationCode;
  date: string;
};

function normalizeTrainNumber(raw: string): string {
  const n = Number(raw);
  if (Number.isNaN(n)) {
    const stripped = raw.replace(/^0+(?=\d)/, '');
    return stripped.length ? stripped : '0';
  }
  return String(n);
}

function toSeatClassType(seatTypeCd: string): SeatClassDetail['type'] {
  if (seatTypeCd === '01' || seatTypeCd === '10') return 'reserved'; // '10'も指定席として扱う
  if (seatTypeCd === '02') return 'green';
  if (seatTypeCd === '03') return 'grandclass';
  return 'reserved';
}

const seatClassDescriptions: Record<SeatClassDetail['type'], string> = {
  reserved: '普通車指定席',
  green: '快適なシートでくつろぎの旅を',
  grandclass: '最上級のおもてなしと体験を',
};

export async function fetchTrainDetail(params: TrainDetailParams): Promise<TrainDetailResult> {
  const endpoint = `/api/trains/detail?trainCd=${encodeURIComponent(params.trainCd)}&from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&date=${encodeURIComponent(params.date)}`;

  console.log(`[API通信] 列車詳細情報をリクエストします: ${endpoint}`);

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`列車詳細の取得に失敗しました: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as TrainDetailApiItem;

  const converted: TrainDetailResult = {
    trainCd: data.trainCd,
    trainTypeName: data.trainTypeName,
    trainNumber: `${normalizeTrainNumber(data.trainNumber)}号`,
    departureTime: data.departureTime,
    arrivalTime: data.arrivalTime,
    departureStationName: stationNameMap[data.fromStationCd],
    arrivalStationName: stationNameMap[data.toStationCd],
    trackNumber: data.trackNumber,
    date: params.date,
    seatClasses: data.seatClasses.map((sc) => {
      const type = toSeatClassType(sc.seatTypeCd);
      return {
        type: type,
        name: sc.seatTypeName,
        description: seatClassDescriptions[type],
        price: sc.charge,
        remainingSeats: sc.remainingSeats,
      };
    }),
  };

  console.log('[APIレスポンス変換後]', converted);
  return converted;
}
