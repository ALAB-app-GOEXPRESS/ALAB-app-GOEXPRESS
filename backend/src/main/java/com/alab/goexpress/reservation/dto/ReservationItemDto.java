package com.alab.goexpress.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationItemDto(
  Integer reservationId,
  Boolean invalidFlg,
  LocalDate departureDate,
  LocalDateTime buyDatetime,
  String buyerName,
  String emailAddress,
  List<TicketWithOperationDto> tickets,
  LinksDto _links
) {}
