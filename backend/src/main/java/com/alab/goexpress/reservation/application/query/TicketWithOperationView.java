package com.alab.goexpress.reservation.application.query;

import java.time.LocalDate;

public record TicketWithOperationView(
  String trainCd,
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String emailAddress,
  String status,
  OperationView operation
) {}
