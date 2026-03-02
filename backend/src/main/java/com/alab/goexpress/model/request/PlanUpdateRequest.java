package com.alab.goexpress.model.request;

import java.time.LocalTime;
import lombok.Data;

@Data
public class PlanUpdateRequest {

  private LocalTime arrivalTime;
  private LocalTime departureTime;
  private String trackNumber;
}
