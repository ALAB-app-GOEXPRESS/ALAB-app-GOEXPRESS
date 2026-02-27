package com.alab.goexpress.model.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

  private Integer reservationId;
  private boolean invalidFlg;
  private Integer accountId;
  private LocalDate departureDate;
  private LocalDateTime buyDatetime;
  private String buyerName;
  private String emailAddress;
  private String cardNumber;
  private LocalDate expirationDate;
}
