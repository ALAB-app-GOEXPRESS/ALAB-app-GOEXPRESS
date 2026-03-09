package com.alab.goexpress.reservation.application.port.out;

import java.time.LocalDate;

public interface TicketCommandPort {
  void createTicket(
    Integer reservationId,
    String trainCd,
    LocalDate departureDate,
    String trainCarCd,
    String seatCd,
    String departureStationCd,
    String arrivalStationCd,
    int charge,
    String userName,
    String emailAddress
  );
}
