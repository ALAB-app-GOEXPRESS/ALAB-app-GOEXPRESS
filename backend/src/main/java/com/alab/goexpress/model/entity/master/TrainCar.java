package com.alab.goexpress.model.entity.master;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "M_TRAIN_CAR")
@IdClass(TrainCarId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainCar {

  @Id
  @Column(name = "train_cd", length = 5)
  private String trainCd;

  @Id
  @Column(name = "train_car_cd", length = 2)
  private String trainCarCd;

  @Column(name = "seat_type_cd", nullable = false, length = 2)
  private String seatTypeCd;

  @Column(name = "max_seat_number", nullable = false)
  private Integer maxSeatNumber;
}
