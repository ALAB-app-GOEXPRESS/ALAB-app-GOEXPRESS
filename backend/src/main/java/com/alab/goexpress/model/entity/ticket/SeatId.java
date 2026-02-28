package com.alab.goexpress.model.entity.ticket;

import java.io.Serializable;
import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SeatId implements Serializable {

  private String trainCd;
  private LocalDate departureDate;
  private String trainCarCd;
  private String seatCd;
  private String departureStationCd;
  private String arrivalStationCd;
}
