import { normalizeTrainNumber } from '@/utils/train';
export type { SeatClass } from '@/utils/seat';
import type { StationCode } from '@/types/Station';

export type TrainSearchParams = {
  from: StationCode;
  to: StationCode;
  date: string;
  time: string;
};

export type TrainResult = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  trackNumber: string;
};

export type TrainSearchResult = TrainResult & {
  seatAvailability: {
    reserved: number;
    green: number;
    grandclass: number;
  };
};

export async function fetchTrains(params: TrainSearchParams): Promise<TrainSearchResult[]> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    date: params.date,
    time: params.time,
  });

  const response = await fetch(`/api/trains?${query.toString()}`);

  if (!response.ok) {
    throw new Error('APIリクエストに失敗しました');
  }

  const data: TrainSearchResult[] = await response.json();

  const converted = data.map((item) => ({
    ...item,
    trainNumber: `${normalizeTrainNumber(item.trainNumber)}号`,
  }));

  return converted;
}
