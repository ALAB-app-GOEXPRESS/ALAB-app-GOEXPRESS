package com.alab.goexpress.seat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SelectedSeatDto {

  private final String carNumber;
  private final String seatCd;
}
