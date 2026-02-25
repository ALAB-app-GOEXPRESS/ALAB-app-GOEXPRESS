package com.alab.goexpress.reservation.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Reservation {

  private ReservationId reservationId;
  private boolean invalidFlg;
  private Integer accountId;
  private LocalDate departureDate;
  private LocalDateTime buyDatetime;
  private String buyerName;
  private String emailAddress;

  private String cardNumber;
  private java.time.LocalDate expirationDate;
}
