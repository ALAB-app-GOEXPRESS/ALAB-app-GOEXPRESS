package com.alab.goexpress.reservation.adapter.out;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.reservation.application.port.out.TicketCommandPort;
import com.alab.goexpress.ticket.TicketService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationTicketCommandAdapter implements TicketCommandPort {

  private final TicketService ticketService;

  @Override
  public void createTicket(
    Integer reservationId,
    String trainCd,
    LocalDate departureDate,
    String trainCarCd,
    String seatCd,
    String departureStationCd,
    String arrivalStationCd,
    int charge,
    String userName,
    String emailAddress
  ) {
    Ticket t = Ticket.builder()
      .reservationId(reservationId)
      .trainCd(trainCd)
      .departureDate(departureDate)
      .trainCarCd(trainCarCd)
      .seatCd(seatCd)
      .departureStationCd(departureStationCd)
      .arrivalStationCd(arrivalStationCd)
      .charge(charge)
      .userName(userName)
      .emailAddress(emailAddress)
      .status(null) // TicketService 側で null → unused に補正
      .build();
    ticketService.create(t);
  }
}
