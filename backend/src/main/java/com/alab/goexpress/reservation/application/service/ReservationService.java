package com.alab.goexpress.reservation.application.service;

import com.alab.goexpress.reservation.application.port.out.ReservationStorePort;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ReservationService {

  private final ReservationStorePort store;

  @Transactional
  public Reservation save(Reservation reservation) {
    return store.save(reservation);
  }

  @Transactional(readOnly = true)
  public Optional<Reservation> findById(int id) {
    return store.findById(new ReservationId(id));
  }

  @Transactional
  public void deleteById(int id) {
    store.deleteById(new ReservationId(id));
  }

  @Transactional(readOnly = true)
  public ReservationListView listAllInOne(int page, int size, String sortKey) {
    return store.listAllWithTicketsAndOperation(page, size, sortKey);
  }
}
