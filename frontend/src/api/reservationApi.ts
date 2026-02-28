import type { TrainResult } from '@/api/TrainListApi';
import { formatSeat } from '@/lib/utils';

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

export const createReservation = async (train: TrainResult, date: string): Promise<ReservationDetails> => {
  const API_ENDPOINT = 'api/ticket-reservations';

  const payload = {
    trainCd: train.trainCd,
    departureStationCd: train.departureStationCd,
    arrivalStationCd: train.arrivalStationCd,
    departureDate: date,
  };

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
        console.warn('エラーレスポンスのJSON解析に失敗しました:', parseError);
      }
      throw new Error(errorMessage);
    }

    const responseData: ApiReservationResponse = await response.json();

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

    return formattedData;
  } catch (error) {
    console.error('予約APIエラー:', error);
    throw error;
  }
};
