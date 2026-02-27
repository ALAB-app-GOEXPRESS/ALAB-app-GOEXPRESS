package com.alab.goexpress.seat;

import com.alab.goexpress.model.entity.ticket.Seat;
import com.alab.goexpress.model.entity.ticket.SeatId;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * T_SEAT 参照/登録用
 */
public interface SeatReservationJpaRepository extends JpaRepository<Seat, SeatId> {
  // 使用済み座席（同一列車・同一日付）を軽量プロジェクションで取得
  interface UsedSeatView {
    String getTrainCarCd();
    String getSeatCd();
  }

  @Query(
    """
    select s.trainCarCd as trainCarCd, s.seatCd as seatCd
    from Seat s
    where s.trainCd = :trainCd and s.departureDate = :depDate
    """
  )
  List<UsedSeatView> findUsedSeats(@Param("trainCd") String trainCd, @Param("depDate") LocalDate depDate);

  @Query(
    """
     SELECT COUNT(s)
     FROM Seat s
     JOIN TrainCar tc ON s.trainCd = tc.trainCd AND s.trainCarCd = tc.trainCarCd
     WHERE s.trainCd = :trainCd AND s.departureDate = :date AND tc.seatTypeCd = :seatTypeCd
    """
  )
  long countReservedSeatsBySeatType(
    @Param("trainCd") String trainCd,
    @Param("date") LocalDate date,
    @Param("seatTypeCd") String seatTypeCd
  );
}
