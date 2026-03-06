package com.alab.goexpress.reservation.application.service;

import com.alab.goexpress.model.request.TicketReservationRequest;
import com.alab.goexpress.model.response.TicketReservationResponse;
import com.alab.goexpress.reservation.application.port.out.AccountQueryPort;
import com.alab.goexpress.reservation.application.port.out.MasterQueryPort;
import com.alab.goexpress.reservation.application.port.out.ReservationStorePort;
import com.alab.goexpress.reservation.application.port.out.SeatReservationPort;
import com.alab.goexpress.reservation.application.port.out.TicketCommandPort;
import com.alab.goexpress.reservation.application.port.out.model.BuyerAccount;
import com.alab.goexpress.reservation.application.port.out.model.ChosenSeat;
import com.alab.goexpress.reservation.application.port.out.model.DepartureStationInfo;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ReservationService {

  private final ReservationStorePort store;
  private final TicketCommandPort ticketCommand;
  private final MasterQueryPort masterQuery;
  private final SeatReservationPort seatReservation;
  private final AccountQueryPort accountQuery;

  @Transactional
  public Reservation save(Reservation reservation) {
    return store.save(reservation);
  }

  @Transactional(readOnly = true)
  public Optional<Reservation> findById(int id) {
    return store.findById(new ReservationId(id));
  }

  @Transactional
  public void deleteById(int id) {
    store.deleteById(new ReservationId(id));
  }

  @Transactional(readOnly = true)
  public ReservationListView listAllInOne(int page, int size, String sortKey) {
    return store.listAllWithTicketsAndOperation(page, size, sortKey);
  }

  @Transactional
  public TicketReservationResponse createReservationWithTicketAndSeat(TicketReservationRequest req) {
    String trainCd = req.getTrainCd();
    LocalDate depDate = req.getDepartureDate();
    String depSt = req.getDepartureStationCd();
    String arrSt = req.getArrivalStationCd();

    String trainTypeCd = masterQuery.getTrainTypeCd(trainCd);

    DepartureStationInfo depInfo = masterQuery.getDepartureInfo(trainCd, depSt);
    LocalTime arrivalTime = masterQuery.getArrivalTime(trainCd, arrSt);

    ChosenSeat seat = seatReservation.chooseSeat(trainCd, depDate);

    int charge = masterQuery.getCharge(depSt, arrSt, trainTypeCd, seat.seatTypeCd());

    BuyerAccount buyer = accountQuery.getDefaultBuyerAccount();
    Reservation r = new Reservation();
    r.setInvalidFlg(false);
    r.setAccountId(buyer.accountId());
    r.setDepartureDate(depDate);
    r.setBuyerName(buyer.accountName());
    r.setEmailAddress(buyer.emailAddress());
    r.setCardNumber(buyer.cardNumber());
    r.setExpirationDate(buyer.expirationDate());
    Reservation savedReservation = store.save(r);

    ticketCommand.createTicket(
      savedReservation.getReservationId().value(),
      trainCd,
      depDate,
      seat.trainCarCd(),
      seat.seatCd(),
      depSt,
      arrSt,
      charge,
      savedReservation.getBuyerName(),
      savedReservation.getEmailAddress()
    );

    seatReservation.reserveSeat(
      trainCd,
      depDate,
      seat.trainCarCd(),
      seat.seatCd(),
      depSt,
      arrSt,
      savedReservation.getReservationId().value()
    );

    return new TicketReservationResponse(
      depInfo.departureTime(),
      arrivalTime,
      depInfo.trackNumber(),
      depDate,
      seat.seatCd()
    );
  }
}
