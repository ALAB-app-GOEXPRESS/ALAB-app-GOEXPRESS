package com.alab.goexpress.reservation.adapter.out.persistence.mapper;

import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row.ReservationHeaderRow;
import com.alab.goexpress.reservation.adapter.out.persistence.mybatis.row.TicketOperationRow;
import com.alab.goexpress.reservation.application.query.*;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import java.util.*;
import java.util.stream.Collectors;

public class ReservationListAssembler {

  public static ReservationListView assemble(
    List<ReservationHeaderRow> headers,
    List<TicketOperationRow> ticketRows,
    int page,
    int size,
    long total
  ) {
    Map<Integer, List<TicketWithTrainNameAndOperationView>> ticketsByResId = ticketRows
      .stream()
      .collect(
        Collectors.groupingBy(
          TicketOperationRow::reservationId,
          LinkedHashMap::new,
          Collectors.mapping(ReservationListAssembler::toTicketView, Collectors.toList())
        )
      );

    List<ReservationListItemView> items = headers
      .stream()
      .map(h -> {
        List<TicketWithTrainNameAndOperationView> tickets = ticketsByResId.getOrDefault(h.reservationId(), List.of());
        return new ReservationListItemView(
          h.reservationId(),
          h.invalidFlg(),
          h.departureDate(),
          h.buyDatetime(),
          h.buyerName(),
          h.emailAddress(),
          tickets,
          new LinksView("/api/reservations/" + h.reservationId(), "/api/reservations/" + h.reservationId() + "/tickets")
        );
      })
      .toList();

    return new ReservationListView(
      items,
      new PageView(page, size, total),
      new LinksView("/api/reservations?page=" + page + "&size=" + size, null)
    );
  }

  public static ReservationListItemView assembleOne(
    ReservationHeaderRow header,
    List<TicketOperationRow> ticketRows
  ) {
    List<TicketWithTrainNameAndOperationView> tickets = ticketRows
      .stream()
      .filter(r -> Objects.equals(r.reservationId(), header.reservationId()))
      .map(ReservationListAssembler::toTicketView)
      .toList();

    return new ReservationListItemView(
      header.reservationId(),
      header.invalidFlg(),
      header.departureDate(),
      header.buyDatetime(),
      header.buyerName(),
      header.emailAddress(),
      tickets,
      new LinksView(
        "/api/reservations/" + header.reservationId(),
        "/api/reservations/" + header.reservationId() + "/tickets"
      )
    );
  }

  private static TicketWithTrainNameAndOperationView toTicketView(TicketOperationRow r) {
    var arrival = r.arrivalDateTime();
    if (arrival.isBefore(r.departureDateTime())) {
      arrival = arrival.plusDays(1);
    }
    return new TicketWithTrainNameAndOperationView(
      r.departureDate(),
      r.trainCarCd(),
      r.seatCd(),
      r.charge(),
      r.userName(),
      r.ticketEmailAddress(),
      r.status(),
      new TrainNameView(r.trainCd(), r.trainTypeName(), r.trainNumber()),
      new OperationView(
        r.fromStationCd(),
        r.fromStationName(),
        r.fromTrackNumber(),
        r.toStationCd(),
        r.toStationName(),
        r.toTrackNumber(),
        r.departureDateTime(),
        arrival
      )
    );
  }
}
