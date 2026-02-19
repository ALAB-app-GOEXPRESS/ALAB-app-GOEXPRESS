package com.alab.goexpress.model.dto;

import java.time.LocalTime;
import lombok.Data;

@Data
public class TrainBetweenStationsDto {

  private String trainCd;

  private String trainNumber;
  private String trainTypeCd;
  private String trainTypeName;

  private String fromStationCd;
  private String fromStationName;

  private String toStationCd;
  private String toStationName;

  private LocalTime departureTime;
  private LocalTime arrivalTime;
}
