package com.alab.goexpress.model.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class PlanCreateRequest {
  private String trainCd;
  private String arrivalStationCd;
  private LocalTime arrivalTime;
  private LocalTime departureTime;
  private String trackNumber;
}
