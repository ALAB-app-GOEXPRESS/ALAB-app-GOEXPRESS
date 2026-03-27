import type { ReservedSeat } from '@/api/SeatApi';

/**
 * 座席クラスの種別
 * - reserved: 普通車指定席
 * - green: グリーン車
 * - grandclass: グランクラス
 */
export type SeatClass = 'reserved' | 'green' | 'grandclass';

/**
 * APIレスポンスの seatTypeCd を SeatClass 型に変換する関数
 * @param seatTypeCd APIから返される座席種別コード
 * @returns SeatClass 型。対応するコードがない場合は 'reserved' を返す
 */
export function toSeatClassType(seatTypeCd: string): SeatClass {
  if (seatTypeCd === '10') return 'reserved';
  if (seatTypeCd === '20') return 'green';
  if (seatTypeCd === '30') return 'grandclass';
  return 'reserved';
}

/**
 * 各座席クラスの説明文
 */
export const SEAT_CLASS_DESCRIPTIONS: Record<SeatClass, string> = {
  reserved: '普通車指定席',
  green: '快適なシートでくつろぎの旅を',
  grandclass: '最上級のおもてなしと体験を',
};

/**
 * 行番号と列名からseat_cdを計算する
 * @param row - 行番号 (例: 5)
 * @param col - 列名 (例: 'A')
 * @returns '021' のようなDBのseat_cd
 */
export const convertRowColToSeatCd = (carNumber: number, row: number, col: string): string => {
  switch (carNumber) {
    case 10: {
      const ALL_COLUMNS = ['A', 'B', 'C'];
      const SEATS_PER_ROW = ALL_COLUMNS.length;
      const colIndex = ALL_COLUMNS.indexOf(col);
      const seatIndex = 8 * 75 + 56 + (row - 1) * SEATS_PER_ROW + colIndex;
      return String(seatIndex + 1).padStart(3, '0');
    }
    case 9: {
      const ALL_COLUMNS = ['A', 'B', 'C', 'D'];
      const SEATS_PER_ROW = ALL_COLUMNS.length;
      const colIndex = ALL_COLUMNS.indexOf(col);
      const seatIndex = 8 * 75 + (row - 1) * SEATS_PER_ROW + colIndex;
      return String(seatIndex + 1).padStart(3, '0');
    }
    default: {
      const ALL_COLUMNS = ['A', 'B', 'C', 'D', 'E'];
      const SEATS_PER_ROW = ALL_COLUMNS.length;
      const colIndex = ALL_COLUMNS.indexOf(col);
      const seatIndex = (carNumber - 1) * 75 + (row - 1) * SEATS_PER_ROW + colIndex;
      return String(seatIndex + 1).padStart(3, '0');
    }
  }
};

export const calculateAvailableSeat = (reservedSeats: ReservedSeat[], carNumber: number, totalSeats: number) => {
  return (
    totalSeats -
    reservedSeats.filter((seat) => {
      return seat.carNumber === carNumber;
    }).length
  );
};

export const formatSeat = (seatCd: string): string => {
  try {
    const seatNumberInt = parseInt(seatCd, 10);

    if (Number.isNaN(seatNumberInt) || seatNumberInt < 1) {
      return seatCd;
    }

    const seatIndex = seatNumberInt - 1;

    const CAR_1_TO_8_SEATS_PER_CAR = 75;
    const CAR9_START = 8 * CAR_1_TO_8_SEATS_PER_CAR; // 600
    const CAR10_START = CAR9_START + 56; // 656 （= 8*75+56）

    let carNumber: number;
    let row: number;
    let col: string;

    if (seatIndex < CAR9_START) {
      const ALL_COLUMNS = ['A', 'B', 'C', 'D', 'E'] as const;
      const SEATS_PER_ROW = ALL_COLUMNS.length; // 5

      carNumber = Math.floor(seatIndex / CAR_1_TO_8_SEATS_PER_CAR) + 1;

      const inCarIndex = seatIndex % CAR_1_TO_8_SEATS_PER_CAR;
      row = Math.floor(inCarIndex / SEATS_PER_ROW) + 1;

      const colIndex = inCarIndex % SEATS_PER_ROW;
      col = ALL_COLUMNS[colIndex];
    } else if (seatIndex < CAR10_START) {
      const ALL_COLUMNS = ['A', 'B', 'C', 'D'] as const;
      const SEATS_PER_ROW = ALL_COLUMNS.length; // 4

      carNumber = 9;

      const inCarIndex = seatIndex - CAR9_START;
      row = Math.floor(inCarIndex / SEATS_PER_ROW) + 1;

      const colIndex = inCarIndex % SEATS_PER_ROW;
      col = ALL_COLUMNS[colIndex];
    } else {
      const ALL_COLUMNS = ['A', 'B', 'C'] as const;
      const SEATS_PER_ROW = ALL_COLUMNS.length; // 3

      carNumber = 10;

      const inCarIndex = seatIndex - CAR10_START;
      row = Math.floor(inCarIndex / SEATS_PER_ROW) + 1;

      const colIndex = inCarIndex % SEATS_PER_ROW;
      col = ALL_COLUMNS[colIndex];
    }

    if (!col || row < 1 || carNumber < 1) {
      return seatCd;
    }

    return `${carNumber}号車 ${row}番${col}席`;
  } catch (error) {
    console.error('座席コードのフォーマット中にエラーが発生しました:', error);
    return seatCd;
  }
};

export const formatSeats = (seatCdList: string[]): string[] => {
  try {
    return seatCdList.map((seat) => formatSeat(seat));
  } catch (error) {
    console.error('座席コードのフォーマット中にエラーが発生しました:', error);
    return seatCdList;
  }
};

export const calcCarNumber = (seatCd: string): number => {
  try {
    const seatNumberInt = parseInt(seatCd, 10);

    if (Number.isNaN(seatNumberInt) || seatNumberInt < 1) {
      throw 0;
    }

    const seatIndex = seatNumberInt - 1;

    const CAR_1_TO_8_SEATS_PER_CAR = 75;
    const CAR9_START = 8 * CAR_1_TO_8_SEATS_PER_CAR; // 600
    const CAR10_START = CAR9_START + 56; // 656 （= 8*75+56）

    let carNumber: number;

    if (seatIndex < CAR9_START) {
      carNumber = Math.floor(seatIndex / CAR_1_TO_8_SEATS_PER_CAR) + 1;
    } else if (seatIndex < CAR10_START) {
      carNumber = 9;
    } else {
      carNumber = 10;
    }

    return carNumber;
  } catch (error) {
    console.error('座席コードのフォーマット中にエラーが発生しました:', error);
    return 0;
  }
};
