package com.alab.goexpress.reservation.application.query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationListItemView(
  Integer reservationId,
  Boolean invalidFlg,
  LocalDate departureDate,
  LocalDateTime buyDatetime,
  String buyerName,
  String emailAddress,
  List<TicketWithTrainNameAndOperationView> tickets,
  LinksView links
) {}
