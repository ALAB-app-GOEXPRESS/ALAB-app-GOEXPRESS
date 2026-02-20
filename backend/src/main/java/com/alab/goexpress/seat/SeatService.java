package com.alab.goexpress.seat;

import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SeatService {

  private final SeatRepositoryPort seatRepo;

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
}
