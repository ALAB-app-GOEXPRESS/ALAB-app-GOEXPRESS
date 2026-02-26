package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservationResponse(
  Integer reservationId,
  Boolean invalidFlg,
  Integer accountId,
  LocalDate departureDate,
  LocalDateTime buyDatetime,
  String buyerName,
  String emailAddress
) {}
