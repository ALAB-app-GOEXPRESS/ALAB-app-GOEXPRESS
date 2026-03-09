package com.alab.goexpress.reservation.adapter.out;

import com.alab.goexpress.reservation.application.port.out.SeatReservationPort;
import com.alab.goexpress.reservation.application.port.out.model.ChosenSeat;
import com.alab.goexpress.seat.SeatChoice;
import com.alab.goexpress.seat.SeatService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationSeatReservationAdapter implements SeatReservationPort {

  private final SeatService seatService;

  @Override
  public ChosenSeat chooseSeat(String trainCd, LocalDate depDate) {
    SeatChoice seat = seatService.chooseSeat(trainCd, depDate);
    return new ChosenSeat(seat.trainCarCd(), seat.seatCd(), seat.seatTypeCd());
  }

  @Override
  public void reserveSeat(
    String trainCd,
    LocalDate depDate,
    String trainCarCd,
    String seatCd,
    String depSt,
    String arrSt,
    Integer reservationId
  ) {
    seatService.reserveSeat(trainCd, depDate, trainCarCd, seatCd, depSt, arrSt, reservationId);
  }
}
