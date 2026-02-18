package com.alab.goexpress.model.entity.plan;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "M_PLAN")
@IdClass(PlanId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {

  @Id
  @Column(name = "train_cd", nullable = false, length = 5)
  private String trainCd;

  @Id
  @Column(name = "arrival_station_cd", nullable = false, length = 2)
  private String arrivalStationCd;

  @Column(name = "arrival_time", nullable = false)
  private LocalTime arrivalTime;

  @Column(name = "departure_time", nullable = false)
  private LocalTime departureTime;

  @Column(name = "track_number", nullable = false, length = 2)
  private String trackNumber;

  public PlanId toId() {
    return new PlanId(trainCd, arrivalStationCd);
  }
}
