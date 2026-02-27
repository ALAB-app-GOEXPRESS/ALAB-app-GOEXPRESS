package com.alab.goexpress.reservation.application.query;

import java.time.LocalDate;

public record TicketWithTrainNameAndOperationView(
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String emailAddress,
  String status,
  TrainNameView trainName,
  OperationView operation
) {}
