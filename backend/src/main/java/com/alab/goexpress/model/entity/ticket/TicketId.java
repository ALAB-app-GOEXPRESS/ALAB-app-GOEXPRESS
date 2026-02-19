package com.alab.goexpress.model.entity.ticket;

import java.io.Serializable;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TicketId implements Serializable {

  private Integer reservationId;
  private String trainCd;
  private LocalDate departureDate;
  private String trainCarCd;
  private String seatCd;
  private String departureStationCd;
  private String arrivalStationCd;
}
