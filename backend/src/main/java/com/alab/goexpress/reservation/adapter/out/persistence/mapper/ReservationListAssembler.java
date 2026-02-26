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
    Map<Integer, List<TicketWithOperationView>> ticketsByResId = ticketRows
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
        List<TicketWithOperationView> tickets = ticketsByResId.getOrDefault(h.reservationId(), List.of());
        return new ReservationListItemView(
          h.reservationId(),
          h.invalidFlg(),
          h.departureDate(),
          h.buyDatetime(),
          h.buyerName(),
          h.emailAddress(),
          tickets,
          new LinksView("/reservations/" + h.reservationId(), "/reservations/" + h.reservationId() + "/tickets")
        );
      })
      .toList();

    return new ReservationListView(
      items,
      new PageView(page, size, total),
      new LinksView("/reservations?page=" + page + "&size=" + size, null)
    );
  }

  private static TicketWithOperationView toTicketView(TicketOperationRow r) {
    var arrival = r.arrivalDateTime();
    if (arrival.isBefore(r.departureDateTime())) {
      arrival = arrival.plusDays(1);
    }
    return new TicketWithOperationView(
      r.trainCd(),
      r.departureDate(),
      r.trainCarCd(),
      r.seatCd(),
      r.charge(),
      r.userName(),
      r.ticketEmailAddress(),
      r.status(),
      new OperationView(
        r.fromStationCd(),
        r.fromStationName(),
        r.toStationCd(),
        r.toStationName(),
        r.departureDateTime(),
        arrival
      )
    );
  }
}
