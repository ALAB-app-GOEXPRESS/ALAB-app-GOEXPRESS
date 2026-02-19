package com.alab.goexpress.reservation;

import com.alab.goexpress.model.entity.reservation.Reservation;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationJpaRepository extends JpaRepository<Reservation, Integer> {

  // Reservation.java では Account は ManyToOne のため、プロパティパスで検索
  List<Reservation> findByAccount_AccountId(Integer accountId);

  List<Reservation> findByDepartureDate(LocalDate departureDate);

  List<Reservation> findByDepartureDateBetween(LocalDate start, LocalDate end);

  List<Reservation> findByInvalidFlg(boolean invalidFlg);
}
