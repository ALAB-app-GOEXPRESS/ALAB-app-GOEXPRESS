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
