package com.alab.goexpress.model.entity.master;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "M_CHARGE")
@IdClass(ChargeId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Charge {

  @Id
  @Column(name = "departure_station_cd", length = 2)
  private String departureStationCd;

  @Id
  @Column(name = "arrival_station_cd", length = 2)
  private String arrivalStationCd;

  @Id
  @Column(name = "train_type_cd", length = 2)
  private String trainTypeCd;

  @Id
  @Column(name = "seat_type_cd", length = 2)
  private String seatTypeCd;

  @Column(name = "charge", nullable = false)
  private Integer charge;
}
