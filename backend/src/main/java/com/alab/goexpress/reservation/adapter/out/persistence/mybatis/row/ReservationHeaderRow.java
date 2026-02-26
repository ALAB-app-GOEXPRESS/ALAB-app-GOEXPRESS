package com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservationHeaderRow(
  Integer reservationId,
  Boolean invalidFlg,
  LocalDate departureDate,
  LocalDateTime buyDatetime,
  String buyerName,
  String emailAddress
) {}
