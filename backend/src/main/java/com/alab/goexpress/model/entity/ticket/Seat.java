package com.alab.goexpress.model.entity.ticket;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "T_SEAT")
@IdClass(SeatId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

  @Id
  @Column(name = "train_cd", length = 5)
  private String trainCd;

  @Id
  @Column(name = "departure_date")
  private LocalDate departureDate;

  @Id
  @Column(name = "train_car_cd", length = 2)
  private String trainCarCd;

  @Id
  @Column(name = "seat_cd", length = 3)
  private String seatCd;

  @Id
  @Column(name = "departure_station_cd", length = 2)
  private String departureStationCd;

  @Id
  @Column(name = "arrival_station_cd", length = 2)
  private String arrivalStationCd;

  @Column(name = "reservation_id", nullable = false)
  private Integer reservationId;
}
