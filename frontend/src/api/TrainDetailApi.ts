import { normalizeTrainNumber } from '@/utils/train';
import { type StationCode } from '@/types/Station';
import { toSeatClassType, SEAT_CLASS_DESCRIPTIONS, type SeatClass } from '@/utils/seatClass';
import { fetchJSON } from '@/lib/fetch';
import { stationNameMap } from '@/constants/Station';

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
  type: SeatClass;
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

export async function fetchTrainDetail(params: TrainDetailParams): Promise<TrainDetailResult> {
  const { date, trainCd, from, to } = params;

  const endpoint = `/api/trains/${encodeURIComponent(date)}/${encodeURIComponent(
    trainCd,
  )}/detail?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  console.log(`[API通信] 列車詳細情報をリクエストします: ${endpoint}`);

  const data = await fetchJSON<TrainDetailApiItem>(endpoint);

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
        description: SEAT_CLASS_DESCRIPTIONS[type],
        price: sc.charge,
        remainingSeats: sc.remainingSeats,
      };
    }),
  };

  console.log('[APIレスポンス変換後]', converted);
  return converted;
}
