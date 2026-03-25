package com.alab.goexpress.train.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TrainSearchResultDto(
  String trainCd,
  String trainTypeName,
  String trainNumber,
  String departureTime,
  String arrivalTime,

  @JsonProperty("departureStationCd")
  String fromStationCd,

  @JsonProperty("arrivalStationCd")
  String toStationCd,

  String trackNumber,
  SeatAvailabilityDto seatAvailability
) {}
 