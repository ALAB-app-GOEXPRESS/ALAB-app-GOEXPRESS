import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatSeat = (seatCode: string): string => {
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
