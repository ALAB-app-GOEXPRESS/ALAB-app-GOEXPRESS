import type { stationNameMap } from '@/constants/Station';

export type Station = {
  cd: string;
  name: string;
};

export type StationCode = keyof typeof stationNameMap;
