import type { TrainResult } from './TrainListApi';

interface ApiReservationResponse {
  departureTime: string;
  arrivalTime: string;
  departureTrackNumber: string;
  departureDate: string;
  seatCd: string;
}

export interface ReservationDetails {
  confirmedSeat: string;
  trackNumber: string;
  reservationDate: string;
  trainDetails: TrainResult;
}

const formatSeat = (seatCode: string): string => {
  try {
    const seatNumberInt = parseInt(seatCode, 10);
    if (isNaN(seatNumberInt) || seatNumberInt < 1) {
      return seatCode;
    }
    const carNumber = Math.floor((seatNumberInt - 1) / 85) + 1;
    const seatAlphabetIndex = (seatNumberInt - 1) % 5;
    const seatAlphabet = ['A', 'B', 'C', 'D', 'E'][seatAlphabetIndex];
    const seatRowNumber = Math.floor((seatNumberInt - 1) / 5) + 1;

    return `${carNumber}号車 ${seatRowNumber}番 ${seatAlphabet}席`;
  } catch (error) {
    console.error('座席コードのフォーマット中にエラーが発生しました:', error);
    return seatCode;
  }
};

export const createReservation = async (train: TrainResult, date: string): Promise<ReservationDetails> => {
  const API_ENDPOINT = 'api/ticket-reservations';

  const payload = {
    trainCd: train.trainCd,
    departureStationCd: train.departureStationCd,
    arrivalStationCd: train.arrivalStationCd,
    departureDate: date,
  };

  console.log('【API通信開始】予約作成リクエストをサーバーに送信します:', API_ENDPOINT, payload);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `サーバーエラーが発生しました (ステータス: ${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.warn('APIエラーレスポンスのJSON解析に失敗しました：', parseError);
      }
      throw new Error(errorMessage);
    }

    const responseData: ApiReservationResponse = await response.json();
    console.log('【API通信成功】サーバーからの生の応答:', responseData);

    const formattedData: ReservationDetails = {
      confirmedSeat: formatSeat(responseData.seatCd),
      trackNumber: responseData.departureTrackNumber,
      reservationDate: responseData.departureDate,
      trainDetails: {
        ...train,
        departureTime: responseData.departureTime.slice(0, 5),
        arrivalTime: responseData.arrivalTime.slice(0, 5),
      },
    };

    console.log('【データ変換後】フロントエンドで使うデータ:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('予約APIの通信または処理中にエラーが発生しました:', error);
    throw error;
  }
};
