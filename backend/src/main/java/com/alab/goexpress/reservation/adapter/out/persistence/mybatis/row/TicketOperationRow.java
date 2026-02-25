package com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TicketOperationRow(
  Integer reservationId,
  String trainCd,
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String ticketEmailAddress,
  String status,
  String fromStationCd,
  String fromStationName,
  String toStationCd,
  String toStationName,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
