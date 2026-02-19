import type { TrainResult } from './TrainListApi'; // 型の参照元をTrainListApiに

/**
 * APIサーバーから返却される、予約成功時のレスポンスデータの「型」
 */
interface ApiReservationResponse {
  reservationId: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  trackNumber: string;
  seatCd: string; // "001" から "850" までの3桁の文字列
}

/**
 * フロントエンドの画面で使いやすいように整形された予約詳細データの「型」
 * この型を ReservationDetailPage に渡します。
 */
export interface ReservationDetails {
  reservationId: string;
  confirmedSeat: string; // "1号車 1番 A席" のような表示用の文字列
  trackNumber: string;
  reservationDate: string;
  trainDetails: TrainResult; // 予約した列車の詳細情報
}

/**
 * サーバーに予約を作成するリクエストを送信する非同期関数
 * @param train - 予約したい列車の情報
 * @param date - 予約日
 * @returns 成功した場合、フロントエンド用に整形された予約詳細データ
 */
export const createReservation = async (train: TrainResult, date: string): Promise<ReservationDetails> => {
  // ★★★ 将来、本物のバックエンドAPIのエンドポイントに差し替えてください ★★★
  const API_ENDPOINT = 'http://localhost:8080/api/reservations'; // 例

  const payload = {
    trainCd: train.trainCd,
    date: date,
  };
  console.log('【API通信開始】予約作成リクエストをサーバーに送信します:', payload);

  try {
    // --- ここからが本物のAPI処理の想定 ---
    /*
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `サーバーエラーが発生しました (ステータス: ${response.status})`);
    }
    const responseData: ApiReservationResponse = await response.json();
    */
    // --- ここまで ---

    // --- 以下は、バックエンドが完成するまでの「モック」処理です ---
    // 1.5秒待機して、ダミーの応答を返します。
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (Math.random() < 0.2) {
      throw new Error('座席の確保に失敗しました。時間をおいて再度お試しください。');
    }
    const responseData: ApiReservationResponse = {
      reservationId: `RES-${Date.now()}`,
      departureDate: date,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      trackNumber: `${10 + Math.floor(Math.random() * 8)}`,
      seatCd: `${String(Math.floor(Math.random() * 850) + 1).padStart(3, '0')}`,
    };
    // --- モック処理ここまで ---

    console.log('【API通信成功】サーバーからの生の応答:', responseData);

    // 座席コードを人間が読める形式に変換する関数
    const formatSeat = (seatCode: string): string => {
      try {
        const seatNumberInt = parseInt(seatCode, 10);
        if (isNaN(seatNumberInt) || seatNumberInt < 1) return seatCode;
        const carNumber = Math.floor((seatNumberInt - 1) / 85) + 1;
        const seatAlphabetIndex = (seatNumberInt - 1) % 5;
        const seatAlphabet = ['A', 'B', 'C', 'D', 'E'][seatAlphabetIndex];
        const seatRowNumber = Math.floor((seatNumberInt - 1) / 5) + 1;
        return `${carNumber}号車 ${seatRowNumber}番 ${seatAlphabet}席`;
      } catch (error) {
        return seatCode;
      }
    };

    // APIからのデータを、フロントエンドで使う ReservationDetails 形式に変換
    const formattedData: ReservationDetails = {
      reservationId: responseData.reservationId,
      confirmedSeat: formatSeat(responseData.seatCd),
      trackNumber: responseData.trackNumber,
      reservationDate: responseData.departureDate,
      trainDetails: train, // 元の列車情報をそのまま含める
    };

    console.log('【データ変換後】フロントエンドで使うデータ:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('予約APIの通信中にエラーが発生しました:', error);
    throw error;
  }
};
