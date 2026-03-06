package com.alab.goexpress.reservation.application.port.out;

import com.alab.goexpress.reservation.application.port.out.model.ChosenSeat;
import java.time.LocalDate;

public interface SeatReservationPort {
  ChosenSeat chooseSeat(String trainCd, LocalDate depDate);

  void reserveSeat(
    String trainCd,
    LocalDate depDate,
    String trainCarCd,
    String seatCd,
    String depSt,
    String arrSt,
    Integer reservationId
  );
}
