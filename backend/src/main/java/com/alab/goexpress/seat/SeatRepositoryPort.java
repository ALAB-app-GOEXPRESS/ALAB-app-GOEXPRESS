package com.alab.goexpress.seat;

import java.time.LocalDate;

import com.alab.goexpress.seat.dto.SelectedSeatDto;

public interface SeatRepositoryPort {
  SeatChoice chooseSeat(String trainCd, LocalDate depDate);

  void insertSeat(
    String trainCd,
    LocalDate depDate,
    String trainCarCd,
    String seatCd,
    String depSt,
    String arrSt,
    Integer reservationId
  );

  boolean areSeatsAvailable(String trainCd, LocalDate depDate, SelectedSeatDto[] seats);
}
