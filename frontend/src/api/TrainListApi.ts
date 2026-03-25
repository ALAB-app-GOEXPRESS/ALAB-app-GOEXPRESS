import { normalizeTrainNumber } from '@/utils/train';
export type { SeatClass } from '@/utils/seat';
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
  seatAvailability: {
    reserved: number;
    green: number;
    grandclass: number;
  };
};

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
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
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

const TRAIN_TYPES = [
  { cd: '01', name: 'はやぶさ' },
  { cd: '02', name: 'はやて' },
  { cd: '03', name: 'やまびこ' },
  { cd: '04', name: 'なすの' },
];

const SEAT_MAX_COUNT = {
  reserved: 75,
  green: 56,
  grandclass: 18,
};

const createMockTrainData = (params: TrainSearchParams): TrainBetweenApiItem[] => {
  const mockData: TrainBetweenApiItem[] = [];
  const baseTime = new Date(`${params.date}T${params.time}`);

  for (let i = 0; i < 30; i++) {
    const depTime = new Date(baseTime.getTime() + i * 15 * 60000);
    const arrTime = new Date(depTime.getTime() + (90 + (i % 3) * 10) * 60000);
    const trainType = TRAIN_TYPES[i % TRAIN_TYPES.length];

    mockData.push({
      trainCd: `${trainType.name.charAt(0).toUpperCase()}${100 + i}`,
      trainNumber: `${200 + i}`,
      trainTypeCd: trainType.cd,
      trainTypeName: trainType.name,
      fromStationCd: params.from,
      fromStationName: '東京',
      toStationCd: params.to,
      toStationName: '仙台',
      departureTime: depTime.toISOString(),
      arrivalTime: arrTime.toISOString(),
      trackNumber: `${14 + (i % 4)}`,
      seatAvailability: {
        // ▼▼▼ 全ての席種で満席(0)になるケースを追加 ▼▼▼
        reserved: i % 5 === 0 ? 0 : Math.floor(Math.random() * SEAT_MAX_COUNT.reserved) + 1,
        green: i % 7 === 0 ? 0 : Math.floor(Math.random() * SEAT_MAX_COUNT.green),
        grandclass: i % 4 === 0 ? 0 : Math.floor(Math.random() * SEAT_MAX_COUNT.grandclass),
      },
    });
  }
  return mockData;
};

export async function fetchTrains(params: TrainSearchParams): Promise<TrainSearchResult[]> {
  const data = createMockTrainData(params);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const formatToHHMM = (isoString: string): string => {
    const date = new Date(isoString);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const converted: TrainSearchResult[] = data.map((item) => {
    const departureTime = formatToHHMM(item.departureTime);
    const arrivalTime = formatToHHMM(item.arrivalTime);

    return {
      trainCd: item.trainCd,
      trainTypeName: item.trainTypeName,
      trainNumber: `${normalizeTrainNumber(item.trainNumber)}号`,
      departureTime,
      arrivalTime,
      departureStationCd: item.fromStationCd as StationCode,
      arrivalStationCd: item.toStationCd as StationCode,
      trackNumber: item.trackNumber,
      seatAvailability: item.seatAvailability,
    };
  });

  return converted;
}
