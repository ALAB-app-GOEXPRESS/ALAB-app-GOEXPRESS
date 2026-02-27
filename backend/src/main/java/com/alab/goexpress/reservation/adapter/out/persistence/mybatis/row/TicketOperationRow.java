package com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TicketOperationRow(
  Integer reservationId,
  LocalDate departureDate,
  String trainCarCd,
  String seatCd,
  Integer charge,
  String userName,
  String ticketEmailAddress,
  String status,
  String trainCd,
  String trainTypeName,
  String trainNumber,
  String fromStationCd,
  String fromStationName,
  String fromTrackNumber,
  String toStationCd,
  String toStationName,
  String toTrackNumber,
  LocalDateTime departureDateTime,
  LocalDateTime arrivalDateTime
) {}
