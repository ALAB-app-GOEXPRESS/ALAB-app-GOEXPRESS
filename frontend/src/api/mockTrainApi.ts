export const stationNameMap = {
  '01': '東京',
  '02': '上野',
} as const;

export type StationCode = keyof typeof stationNameMap;

export type TrainSearchParams = {
  from: StationCode;
  to: StationCode;
  date: string;
  time: string;
};

export type SeatClass = 'reserved' | 'green' | 'grandclass';

export type RemainSeatNumber = Record<SeatClass, number>;

export type TrainResult = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  durationMin: number;
  remainSeatNumber: RemainSeatNumber;
};

export type FetchTrainsResponse = {
  totalCount: number;
  results: TrainResult[];
};

type TrainPattern = {
  trainTypeName: string;
  durationMin: number;
};

const trainPatterns: TrainPattern[] = [
  { trainTypeName: 'やまびこ', durationMin: 7 },
  { trainTypeName: 'やまびこ', durationMin: 7 },
  { trainTypeName: 'はやぶさ', durationMin: 6 },
  { trainTypeName: 'なすの', durationMin: 7 },
];

const totalResultsCount = 37;

function addMinutesToHHMM(hhmm: string, addMinutes: number): string {
  const [hours, minutes] = hhmm.split(':').map(Number);
  const total = hours * 60 + minutes + addMinutes;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(normalized / 60);
  const mm = normalized % 60;

  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildRemainSeatNumber(seed: number): RemainSeatNumber {
  const reserved = Math.floor(pseudoRandom(seed + 1) * 21);
  const green = Math.floor(pseudoRandom(seed + 2) * 12);
  const grandclass = Math.floor(pseudoRandom(seed + 3) * 6);

  return {
    reserved,
    green,
    grandclass,
  };
}

function buildAllTrains(params: TrainSearchParams): TrainResult[] {
  const dateSeed = Number(params.date.replaceAll('-', '')) || 0;

  const results: TrainResult[] = [];

  for (let index = 0; index < totalResultsCount; index += 1) {
    const pattern = trainPatterns[index % trainPatterns.length];
    const departureTime = addMinutesToHHMM(params.time, index * 18);
    const arrivalTime = addMinutesToHHMM(departureTime, pattern.durationMin);

    const remainSeatNumber = buildRemainSeatNumber(dateSeed + index);

    results.push({
      trainCd: `T-${params.from}-${params.to}-${index}`,
      trainTypeName: pattern.trainTypeName,
      trainNumber: `${40 + index}号`,
      departureTime,
      arrivalTime,
      departureStationCd: params.from,
      arrivalStationCd: params.to,
      durationMin: pattern.durationMin,
      remainSeatNumber,
    });
  }

  return results;
}

function filterBySeatClass(results: TrainResult[], seatClass?: SeatClass): TrainResult[] {
  if (!seatClass) {
    return results;
  }

  return results.filter((train) => train.remainSeatNumber[seatClass] !== 0);
}

/**
 * モックAPI：列車一覧取得（ページング + seatClassFilter 対応）
 * - seatClassFilter が指定された場合：そのクラスの残席が 0 でない列車のみ返す
 * - totalCount はフィルタ後の全件数
 * - results はフィルタ後に limit / offset した最大 limit 件
 */
export async function fetchTrainsMock(
  params: TrainSearchParams,
  limit: number,
  offset: number,
  seatClassFilter?: SeatClass,
): Promise<FetchTrainsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const allResults = buildAllTrains(params);
  const filteredResults = filterBySeatClass(allResults, seatClassFilter);

  const totalCount = filteredResults.length;

  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);

  const results = filteredResults.slice(safeOffset, safeOffset + safeLimit);

  return {
    totalCount,
    results,
  };
}
