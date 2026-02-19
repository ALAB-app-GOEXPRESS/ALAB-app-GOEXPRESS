package com.alab.goexpress.reservation;

import com.alab.goexpress.model.entity.reservation.Reservation;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryPort {

  private final ReservationJpaRepository jpa;

  @Override
  public Reservation save(Reservation reservation) {
    return Objects.requireNonNull(jpa.save(reservation), "jpa.save(reservation) returned null");
  }

  @Override
  public Optional<Reservation> findById(Integer id) {
    return jpa.findById(id);
  }

  @Override
  public List<Reservation> findByAccountId(Integer accountId) {
    return jpa.findByAccount_AccountId(accountId);
  }

  @Override
  public List<Reservation> findByDepartureDate(LocalDate departureDate) {
    return jpa.findByDepartureDate(departureDate);
  }

  @Override
  public List<Reservation> findByDepartureDateBetween(LocalDate start, LocalDate end) {
    return jpa.findByDepartureDateBetween(start, end);
  }

  @Override
  public List<Reservation> findByInvalidFlg(boolean invalidFlg) {
    return jpa.findByInvalidFlg(invalidFlg);
  }
}
