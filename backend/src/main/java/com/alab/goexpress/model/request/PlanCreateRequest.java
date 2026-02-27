package com.alab.goexpress.model.request;

import java.time.LocalTime;
import lombok.Data;

@Data
public class PlanCreateRequest {

  private String trainCd;
  private String arrivalStationCd;
  private LocalTime arrivalTime;
  private LocalTime departureTime;
  private String trackNumber;
}
