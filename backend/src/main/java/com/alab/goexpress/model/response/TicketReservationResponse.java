package com.alab.goexpress.model.response;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketReservationResponse {

  private LocalTime departureTime;
  private LocalTime arrivalTime;
  private String departureTrackNumber;
  private LocalDate departureDate;
  private String seatCd;
}
