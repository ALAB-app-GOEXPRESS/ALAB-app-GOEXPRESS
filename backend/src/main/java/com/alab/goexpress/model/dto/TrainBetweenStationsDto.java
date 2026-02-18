package com.alab.goexpress.model.dto;

import lombok.Data;

@Data
public class TrainBetweenStationsDto {
  private String trainCd;

  private String fromStationCd;
  private String toStationCd;
}
