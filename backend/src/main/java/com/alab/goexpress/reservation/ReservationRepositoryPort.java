package com.alab.goexpress.reservation;

import com.alab.goexpress.model.entity.reservation.Reservation;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepositoryPort {
  Reservation save(Reservation reservation);

  Optional<Reservation> findById(Integer id);

  List<Reservation> findByAccountId(Integer accountId);

  List<Reservation> findByDepartureDate(LocalDate departureDate);

  List<Reservation> findByDepartureDateBetween(LocalDate start, LocalDate end);

  List<Reservation> findByInvalidFlg(boolean invalidFlg);
}
