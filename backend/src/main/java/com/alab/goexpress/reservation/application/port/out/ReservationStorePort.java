package com.alab.goexpress.reservation.application.port.out;

import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import java.util.Optional;

public interface ReservationStorePort {
  Reservation save(Reservation reservation);
  Optional<Reservation> findById(ReservationId reservationId);
  void deleteById(ReservationId reservationId);

  ReservationListView listAllWithTicketsAndOperation(int page, int size, String sortKey);
}
