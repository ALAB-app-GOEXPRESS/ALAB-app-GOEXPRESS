package com.alab.goexpress.reservation.application.query;

import java.time.LocalDateTime;

public record OperationView(
  String fromStationCd,
  String fromStationName,
  String toStationCd,
  String toStationName,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
