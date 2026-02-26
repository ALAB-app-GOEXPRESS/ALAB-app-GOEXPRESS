package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDateTime;

public record OperationDto(
  String fromStationCd,
  String fromStationName,
  String toStationCd,
  String toStationName,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
