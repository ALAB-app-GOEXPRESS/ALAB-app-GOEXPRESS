import { FetchSeats, type ReservedSeat, type SeatsParams } from "@/api/SeatApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseSeatMapArgs = {
    trainCd: string;
    departureDate: string;
}

type UseSeatMapReturn = {
    reservedSeats: ReservedSeat[];
    isLoading: boolean;
    apiErrorMessage: string;
}

export function useSeatMap(args: UseSeatMapArgs): UseSeatMapReturn {
    const params: SeatsParams = args;

    const seatsQuery = useQuery({ queryKey: ['reservedSeats', params], queryFn: () => FetchSeats(params) });

    const reservedSeats = useMemo(() => {
        return seatsQuery.data ?? [];
      }, [seatsQuery]);

    const isLoading = seatsQuery.isPending;
    const apiErrorMessage = seatsQuery.isError ? '検索に失敗しました。時間をおいて再度お試しください。' : '';

    return {
        reservedSeats,
        isLoading,
        apiErrorMessage
    };
};