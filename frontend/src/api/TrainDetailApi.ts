import { normalizeTrainNumber } from '@/utils/train';
import { type StationCode } from '@/types/Station';
import { toSeatClassType, SEAT_CLASS_DESCRIPTIONS, type SeatClass } from '@/utils/seat';
import { fetchJSON } from '@/lib/fetch';
import { StationNameMap } from '@/constants/Station';
import { toHHMM } from '@/utils/dateTime';

export type TrainDetailApiItem = {
  trainBasicInfo: {
    trainCd: string;
    trainNumber: string;
    trainTypeCd: string;
    trainTypeName: string;
    fromStationCd: StationCode;
    fromStationName: string;
    toStationCd: StationCode;
    toStationName: string;
    departureTime: string; // "HH:mm"
    arrivalTime: string; // "HH:mm"
  };
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
    trainCd: data.trainBasicInfo.trainCd,
    trainTypeName: data.trainBasicInfo.trainTypeName,
    trainNumber: `${normalizeTrainNumber(data.trainBasicInfo.trainNumber)}号`,
    departureTime: toHHMM(data.trainBasicInfo.departureTime),
    arrivalTime: toHHMM(data.trainBasicInfo.arrivalTime),
    departureStationName: StationNameMap[data.trainBasicInfo.fromStationCd],
    arrivalStationName: StationNameMap[data.trainBasicInfo.toStationCd],
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
