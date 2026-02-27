package com.alab.goexpress.reservation.application.query;

import java.time.LocalDateTime;

public record OperationView(
  String fromStationCd,
  String fromStationName,
  String fromTrackNumber,
  String toStationCd,
  String toStationName,
  String toTrackNumber,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
