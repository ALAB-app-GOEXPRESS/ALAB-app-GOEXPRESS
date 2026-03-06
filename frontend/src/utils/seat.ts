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

export const ALL_COLUMNS = ['A', 'B', 'C', 'D', 'E'];
export const SEATS_PER_ROW = ALL_COLUMNS.length;

/**
 * seat_cdから表示用の '5A' 形式の文字列を計算する
 * @param seatId - '021' のようなDBのseat_cd
 * @returns '5A' のような表示用ラベル
 */
// export const convertSeatCdToLabel = (seatId: string): string => {
//   const seatIndex = parseInt(seatId, 10) - 1;
//   const row = Math.floor(seatIndex / SEATS_PER_ROW) + 1;
//   const col = ALL_COLUMNS[seatIndex % SEATS_PER_ROW];
//   return `${row}${col}`;
// };

/**
 * 行番号と列名からseat_cdを計算する
 * @param row - 行番号 (例: 5)
 * @param col - 列名 (例: 'A')
 * @returns '021' のようなDBのseat_cd
 */
export const convertRowColToSeatCd = (carNumber: number, row: number, col: string): string => {
  const colIndex = ALL_COLUMNS.indexOf(col);
  const seatIndex = (carNumber - 1) * 75 + (row - 1) * SEATS_PER_ROW + colIndex;
  return String(seatIndex + 1).padStart(3, '0');
};

export const calculateAvailableSeat = (reservedSeats: ReservedSeat[], carNumber: number) => {
  return (
    75 -
    reservedSeats.filter((seat) => {
      return seat.carNumber === carNumber;
    }).length
  );
};