package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDate;

public record TicketWithOperationDto(
  String trainCd,
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String emailAddress,
  String status,
  OperationDto operation
) {}
