package com.alab.goexpress.reservation.application.service;

import com.alab.goexpress.model.request.TicketReservationRequest;
import com.alab.goexpress.reservation.application.port.out.AccountQueryPort;
import com.alab.goexpress.reservation.application.port.out.MasterQueryPort;
import com.alab.goexpress.reservation.application.port.out.ReservationStorePort;
import com.alab.goexpress.reservation.application.port.out.TicketCommandPort;
import com.alab.goexpress.reservation.application.port.out.model.BuyerAccount;
import com.alab.goexpress.reservation.application.query.ReservationListItemView;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import com.alab.goexpress.seat.SeatRepositoryPort;
import com.alab.goexpress.seat.dto.SelectedSeatDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.Objects;
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
  private final SeatRepositoryPort seatRepository;
  private final AccountQueryPort accountQuery;
  private final ReservationMailService reservationMailService;

  @PersistenceContext
  private EntityManager entityManager;

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
  public ReservationListItemView createReservationWithTicketAndSeat(TicketReservationRequest req, String userEmail) {
    String trainCd = req.getTrainCd();
    LocalDate depDate = req.getDepartureDate();
    String depSt = req.getDepartureStationCd();
    String arrSt = req.getArrivalStationCd();
    String buyerName = req.getBuyerName();
    String emailAddress = req.getEmailAddress();
    SelectedSeatDto[] selectedSeats = req.getSelectedSeat();

    boolean areSeatsAvailable = seatRepository.areSeatsAvailable(trainCd, depDate, selectedSeats);
    if (!areSeatsAvailable) {
      throw new SeatAlreadyReservedException("選択された座席の一部は既に予約されています。再度座席を選択してください。");
    }

    String trainTypeCd = masterQuery.getTrainTypeCd(trainCd);
    if (Objects.isNull(trainTypeCd)) {
      throw new IllegalStateException("指定された列車の列車種別が見つかりません。trainCd: " + trainCd);
    }

    BuyerAccount buyer = accountQuery.findBuyerAccount(userEmail);
    if (Objects.isNull(buyer)) {
      throw new IllegalStateException("購入者のアカウント情報が見つかりません。email: " + userEmail);
    }

    Reservation r = new Reservation();
    r.setInvalidFlg(false);
    r.setAccountId(buyer.accountId());
    r.setDepartureDate(depDate);
    r.setBuyerName(buyerName);
    r.setEmailAddress(emailAddress);
    r.setCardNumber(buyer.cardNumber());
    r.setExpirationDate(buyer.expirationDate());
    Reservation savedReservation = store.save(r);

    for (SelectedSeatDto seat : selectedSeats) {
      int charge = masterQuery.getCharge(depSt, arrSt, trainTypeCd, "10"); // 指定席で固定

      ticketCommand.createTicket(
        savedReservation.getReservationId().value(),
        trainCd,
        depDate,
        String.format("%02d", Integer.parseInt(seat.getCarNumber())),
        seat.getSeatCd(),
        depSt,
        arrSt,
        charge,
        savedReservation.getBuyerName(),
        savedReservation.getEmailAddress()
      );

      seatRepository.insertSeat(
        trainCd,
        depDate,
        String.format("%02d", Integer.parseInt(seat.getCarNumber())),
        seat.getSeatCd(),
        depSt,
        arrSt,
        savedReservation.getReservationId().value()
      );
    }

    if (entityManager != null) {
      entityManager.flush();
    }

    reservationMailService.MailWriter(buyerName, emailAddress);

    return store.findItemWithTicketsAndOperationById(savedReservation.getReservationId().value());
  }

  @Transactional(readOnly = true)
  public Optional<ReservationListItemView> findItemViewById(int id) {
    try {
      return Optional.of(store.findItemWithTicketsAndOperationById(id));
    } catch (IllegalArgumentException e) {
      return Optional.empty();
    }
  }
}
