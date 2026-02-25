package com.alab.goexpress.seat;

import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.transactional;

@Service
@RequiredArgsConstructor
public class SeatService {

  private final SeatRepositoryPort seatRepo;
  private final SeatReservationJpaRepository.SeatReservationJpaRepository;
  private final TrainCarMasterJpaRepository TrainCarMasterJpaRepository;

  public SeatChoice chooseSeat(String trainCd, LocalDate depDate) {
    return seatRepo.chooseSeat(trainCd, depDate);
  }

  public void reserveSeat(
      String trainCd,
      LocalDate depDate,
      String trainCarCd,
      String seatCd,
      String depSt,
      String arrSt,
      Integer reservationId
  ) {
    seatRepo.insertSeat(trainCd, depDate, trainCarCd, seatCd, depSt, arrSt, reservationId);
  }

  @Transactional(readOnly = true)
public int countAvailableSeats(String trainCd, LocalDate date, String seatTypeCd) {
    Long totalSeats = trainCarMasterJpaRepository.sumMaxSeatNumber(trainCd, seatTypeCd);
    if (totalSeats == null) {
        return 0;
    }

    long reservedSeats = seatReservationJpaRepository.countReservedSeatsBySeatType(trainCd, date, seatTypeCd);

    int availableSeats = (int) (totalSeats - reservedSeats);

    return Math.max(0, availableSeats);
}
}
