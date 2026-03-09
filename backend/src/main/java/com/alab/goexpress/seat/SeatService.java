package com.alab.goexpress.seat;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SeatService {

  private final SeatRepositoryPort seatRepo;

  private final SeatMapper mapper;

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
  public List<SeatResponse> find(String trainCd, LocalDate departureDate) {
    return mapper.findReservedSeats(trainCd, departureDate);
  }
}
