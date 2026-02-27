package com.alab.goexpress.model.entity.master;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "M_SEAT_TYPE")
@Getter
@NoArgsConstructor
public class SeatType {

  @Id
  @Column(name = "seat_type_cd", length = 2)
  private String seatTypeCd;

  @Column(name = "seat_name", nullable = false)
  private String seatName;

  @Column(name = "seat_type_icon", nullable = false)
  private String seatTypeIcon;
}
