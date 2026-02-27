package com.alab.goexpress.model.entity.master;

import com.alab.goexpress.model.entity.master.SeatType;
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "seat_type_cd", insertable = false, updatable = false)
  @ToString.Exclude // 循環参照によるStackOverflowErrorを防ぎます
  @EqualsAndHashCode.Exclude // 同上
  private SeatType seatType;
}
