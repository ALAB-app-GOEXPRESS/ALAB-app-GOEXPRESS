package com.alab.goexpress.reservation.adapter.in.web.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationListItemDto(
  Integer reservationId,
  Boolean invalidFlg,
  LocalDate departureDate,
  LocalDateTime buyDatetime,
  String buyerName,
  String emailAddress,
  List<TicketWithTrainNameAndOperationDto> tickets,
  LinksDto _links
) {}
