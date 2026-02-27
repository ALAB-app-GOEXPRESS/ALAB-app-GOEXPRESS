package com.alab.goexpress.master;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TrainInfoDTO {

  private final String trainTypeName;
  private final String trainNumber;
  private final String trainTypeCd;
}
