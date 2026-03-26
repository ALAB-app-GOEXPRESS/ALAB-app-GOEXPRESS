import type { ReservedSeat } from '@/api/SeatApi';
import type { SelectedSeat } from '@/types/Seat';

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
    if (isNaN(seatNumberInt) || seatNumberInt < 1) {
      return seatCd;
    }
    const carNumber = Math.floor((seatNumberInt - 1) / 75) + 1;
    const seatAlphabetIndex = (seatNumberInt - 1) % 5;
    const seatAlphabet = ['A', 'B', 'C', 'D', 'E'][seatAlphabetIndex];
    const seatRowNumber = Math.floor(((seatNumberInt - 1) % 75) / 5) + 1;

    return `${carNumber}号車 ${seatRowNumber}番${seatAlphabet}席`;
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

export const calculateCarNumber = (seatCd: string) => {
  const seatNumberInt = parseInt(seatCd, 10);

  return Math.floor((seatNumberInt - 1) / 75) + 1;
};

export const getSeatTypeName = (carNumbar: string) => {
  if (carNumbar === '9') return 'グリーン席';
  if (carNumbar === '10') return 'グランクラス';
  return '指定席';
};

export const formatSelectedSeat = (seatCd: string): SelectedSeat => {
  return {
    carNumber: calculateCarNumber(seatCd),
    seatCd: seatCd,
    seatTypeName: getSeatTypeName(seatCd),
    price: 1000,
  };
};

export const removeSelectedSeatsSession = () => {
  for (let i = 0; i < Number(sessionStorage.getItem('selectedSeatsNumber')); i++) {
    sessionStorage.removeItem(`selectedSeat${i}`);
  }
  sessionStorage.removeItem('selectedSeatsNumber');
};