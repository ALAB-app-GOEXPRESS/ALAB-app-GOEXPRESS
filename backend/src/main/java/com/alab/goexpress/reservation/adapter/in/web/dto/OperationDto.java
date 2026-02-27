package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDateTime;

public record OperationDto(
  String fromStationCd,
  String fromStationName,
  String fromTrackNumber,
  String toStationCd,
  String toStationName,
  String toTrackNumber,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
