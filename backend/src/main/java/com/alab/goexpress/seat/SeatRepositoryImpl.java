package com.alab.goexpress.seat;

import com.alab.goexpress.master.train.TrainCarMasterJpaRepository;
import com.alab.goexpress.model.entity.master.TrainCar;
import com.alab.goexpress.model.entity.ticket.Seat;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatRepositoryImpl implements SeatRepositoryPort {

  private final TrainCarMasterJpaRepository trainCarRepo;
  private final SeatReservationJpaRepository seatRepo;

  @Override
  public SeatChoice chooseSeat(String trainCd, LocalDate depDate) {
    // 指定席 seat_type_cd='10' を優先（要件踏襲）
    List<TrainCar> cars = trainCarRepo.findByTrainCdAndSeatTypeCdOrderByTrainCarCdAsc(trainCd, "10");
    if (cars.isEmpty()) {
      throw new IllegalArgumentException("no available cars (seat_type_cd='10') for train: " + trainCd);
    }

    // 同一列車・同一日付の使用済み座席を取得（区間重複判定は簡略化：現行踏襲）
    List<SeatReservationJpaRepository.UsedSeatView> used = seatRepo.findUsedSeats(trainCd, depDate);
    Set<String> occupied = new HashSet<>(used.size());
    for (SeatReservationJpaRepository.UsedSeatView v : used) {
      occupied.add(v.getTrainCarCd() + ":" + v.getSeatCd());
    }

    // 空席探索（1..max_seat_number）
    for (TrainCar car : cars) {
      String trainCarCd = car.getTrainCarCd();
      String seatTypeCd = car.getSeatTypeCd();
      int max = car.getMaxSeatNumber();

      for (int i = 1; i <= max; i++) {
        String seatCd = String.format("%03d", i);
        String key = trainCarCd + ":" + seatCd;
        if (!occupied.contains(key)) {
          return new SeatChoice(trainCarCd, seatCd, seatTypeCd);
        }
      }
    }
    throw new IllegalArgumentException("no free seat found for train " + trainCd + " on " + depDate);
  }

  @Override
  @Transactional
  public void insertSeat(
      String trainCd,
      LocalDate depDate,
      String trainCarCd,
      String seatCd,
      String depSt,
      String arrSt,
      Integer reservationId
  ) {
    // 主キー: (train_cd, departure_date, train_car_cd, seat_cd, departure_station_cd, arrival_station_cd)
    Seat s = new Seat();
    s.setTrainCd(trainCd);
    s.setDepartureDate(depDate);
    s.setTrainCarCd(trainCarCd);
    s.setSeatCd(seatCd);
    s.setDepartureStationCd(depSt);
    s.setArrivalStationCd(arrSt);
    s.setReservationId(reservationId);

    try {
      seatRepo.save(s);
    } catch (DataIntegrityViolationException e) {
      // 主キー重複などの一意制約違反を業務例外へ変換（同時予約競合の可能性）
      throw new IllegalArgumentException("seat already reserved: " + trainCd + " " + depDate +
        " car " + trainCarCd + " seat " + seatCd, e);
    }
  }
}
