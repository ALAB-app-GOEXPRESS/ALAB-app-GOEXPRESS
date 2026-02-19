package com.alab.goexpress.model.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class PlanUpdateRequest {
  private LocalTime arrivalTime;
  private LocalTime departureTime;
  private String trackNumber;
}
