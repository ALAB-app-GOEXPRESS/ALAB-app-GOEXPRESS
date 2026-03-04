// TrainListApi.ts

import { calcDurationMin, toHHMM } from '@/utils/dateTime';
import type { SeatClass } from '@/utils/seatClass';
import { normalizeTrainNumber } from '@/utils/train';
export type { SeatClass } from '@/utils/seatClass';
import { fetchJSON } from '@/lib/fetch';
import type { StationCode } from '@/types/Station';

export type TrainBetweenApiItem = {
  trainCd: string;
  trainNumber: string;
  trainTypeCd: string;
  trainTypeName: string;
  fromStationCd: string;
  fromStationName: string;
  toStationCd: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  trackNumber: string;
};

export type RemainSeatNumber = Record<SeatClass, number>;

export type TrainSearchParams = {
  from: StationCode;
  to: StationCode;
  // date: string;
  // time: string;
};

export type TrainResult = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  durationMin: number;
  trackNumber: string;
};

export type FetchTrainsResponse = {
  totalCount: number;
  results: TrainResult[];
};

/**
 * 実API：列車一覧取得（ページング + seatClassFilter 対応）
 * - GET /api/trains/between?from=xx&to=yy を叩く
 * - APIの配列レスポンスを TrainResult[] に変換
 * - results はフィルタ後に limit / offset した最大 limit 件
 */
export async function fetchTrains(
  params: TrainSearchParams,
  limit: number,
  offset: number,
): Promise<FetchTrainsResponse> {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);

  const endpoint = `/api/trains?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`;

  const data = await fetchJSON<TrainBetweenApiItem[]>(endpoint);

  console.log('[APIレスポンス確認生データ]', data);

  const converted: TrainResult[] = data.map((item) => {
    const departureTime = toHHMM(item.departureTime);
    const arrivalTime = toHHMM(item.arrivalTime);
    const durationMin = calcDurationMin(departureTime, arrivalTime);

    return {
      trainCd: item.trainCd,
      trainTypeName: item.trainTypeName,
      trainNumber: `${normalizeTrainNumber(item.trainNumber)}号`,
      departureTime,
      arrivalTime,
      departureStationCd: item.fromStationCd as StationCode,
      arrivalStationCd: item.toStationCd as StationCode,
      durationMin,
      trackNumber: item.trackNumber,
    };
  });

  const totalCount = converted.length;
  const results = converted.slice(safeOffset, safeOffset + safeLimit);

  return { totalCount, results };
}
