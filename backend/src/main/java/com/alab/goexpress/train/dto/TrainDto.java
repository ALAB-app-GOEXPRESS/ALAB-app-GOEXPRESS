package com.alab.goexpress.train.dto;

import java.time.LocalTime;

public record TrainDto(
  String trainCd,

  String trainNumber,
  String trainTypeCd,
  String trainTypeName,

  String fromStationCd,
  String fromStationName,

  String toStationCd,
  String toStationName,

  LocalTime departureTime,
  LocalTime arrivalTime
) {}
