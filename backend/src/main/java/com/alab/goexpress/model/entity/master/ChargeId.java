package com.alab.goexpress.model.entity.master;

import java.io.Serializable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ChargeId implements Serializable {

  private String departureStationCd;
  private String arrivalStationCd;
  private String trainTypeCd;
  private String seatTypeCd;
}
