package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDate;

public record TicketWithTrainNameAndOperationDto(
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String emailAddress,
  String status,
  TrainNameDto trainName,
  OperationDto operation
) {}
