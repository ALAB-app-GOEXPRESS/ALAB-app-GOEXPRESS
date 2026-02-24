import { stationNameMap, type StationCode } from './TrainListApi';
import { toHHMM } from '@/utils/dateTime';

export type TrainDetailApiItem = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  fromStationCd: StationCode;
  toStationCd: StationCode;
  departureTime: string;
  arrivalTime: string;
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
  if (seatTypeCd === '01') return 'reserved';
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

  const mockData: TrainDetailApiItem = {
    trainCd: params.trainCd,
    trainTypeName: 'はやぶさ',
    trainNumber: '1',
    fromStationCd: params.from,
    toStationCd: params.to,
    departureTime: `${params.date}T06:32:00`,
    arrivalTime: `${params.date}T06:37:00`,
    trackNumber: '20',
    seatClasses: [{ seatTypeCd: '01', seatTypeName: '指定席', charge: 13320, remainingSeats: 15 }],
  };
  const data = mockData;

  const converted: TrainDetailResult = {
    trainCd: data.trainCd,
    trainTypeName: data.trainTypeName,
    trainNumber: `${normalizeTrainNumber(data.trainNumber)}号`,
    departureTime: toHHMM(data.departureTime.substring(11, 16)),
    arrivalTime: toHHMM(data.arrivalTime.substring(11, 16)),
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
