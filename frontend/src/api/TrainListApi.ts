import { calcDurationMin, toHHMM } from '@/utils/dateTime';

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
};

//残席数表示機能の破壊を防ぐための仮部分
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
export type SeatClass = 'reserved' | 'green' | 'grandclass';
export type RemainSeatNumber = Record<SeatClass, number>;

function buildRemainSeatNumber(seed: number): RemainSeatNumber {
  const reserved = Math.floor(pseudoRandom(seed + 1) * 21);
  const green = Math.floor(pseudoRandom(seed + 2) * 12);
  const grandclass = Math.floor(pseudoRandom(seed + 3) * 6);

  return { reserved, green, grandclass };
}
// 文字列から安定した数値seedを作る（簡易ハッシュ）
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

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

export type TrainResult = {
  trainCd: string;
  trainTypeName: string;
  trainNumber: string;
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
  departureStationCd: StationCode;
  arrivalStationCd: StationCode;
  durationMin: number;
  remainSeatNumber: RemainSeatNumber;
};

export type FetchTrainsResponse = {
  totalCount: number;
  results: TrainResult[];
};

function filterBySeatClass(results: TrainResult[], seatClass?: SeatClass): TrainResult[] {
  if (!seatClass) return results;
  return results.filter((train) => train.remainSeatNumber[seatClass] !== 0);
}

function normalizeTrainNumber(raw: string): string {
  const n = Number(raw);

  if (Number.isNaN(n)) {
    const stripped = raw.replace(/^0+(?=\d)/, '');
    return stripped.length ? stripped : '0';
  }

  return String(n);
}

/**
 * 実API：列車一覧取得（ページング + seatClassFilter 対応）
 * - GET /api/trains/between?from=xx&to=yy を叩く
 * - APIの配列レスポンスを TrainResult[] に変換
 * - seatClassFilter はクライアント側で適用（APIに無い前提）
 * - totalCount はフィルタ後の全件数
 * - results はフィルタ後に limit / offset した最大 limit 件
 */
export async function fetchTrains(
  params: TrainSearchParams,
  limit: number,
  offset: number,
  seatClassFilter?: SeatClass,
): Promise<FetchTrainsResponse> {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);

  const endpoint = `/api/trains/between?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`;

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`fetchTrains failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as TrainBetweenApiItem[];

  const dateSeed = Number(params.date.replaceAll('-', '')) || 0;

  const converted: TrainResult[] = data.map((item, index) => {
    const departureTime = toHHMM(item.departureTime);
    const arrivalTime = toHHMM(item.arrivalTime);
    const durationMin = calcDurationMin(departureTime, arrivalTime);

    // 残席はAPIにないので暫定生成：列車コード＋日付＋indexで安定させる
    const seed = hashSeed(item.trainCd) + dateSeed + index;
    const remainSeatNumber = buildRemainSeatNumber(seed);

    return {
      trainCd: item.trainCd,
      trainTypeName: item.trainTypeName,
      trainNumber: `${normalizeTrainNumber(item.trainNumber)}号`,
      departureTime,
      arrivalTime,
      departureStationCd: item.fromStationCd as StationCode,
      arrivalStationCd: item.toStationCd as StationCode,
      durationMin,
      remainSeatNumber,
    };
  });

  const filtered = filterBySeatClass(converted, seatClassFilter);
  const totalCount = filtered.length;
  const results = filtered.slice(safeOffset, safeOffset + safeLimit);

  return { totalCount, results };
}
