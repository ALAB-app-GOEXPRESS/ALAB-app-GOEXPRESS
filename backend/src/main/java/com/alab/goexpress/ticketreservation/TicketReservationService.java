package com.alab.goexpress.ticketreservation;

import com.alab.goexpress.account.Account;
import com.alab.goexpress.model.entity.reservation.Reservation;
import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketStatus;
import com.alab.goexpress.model.request.TicketReservationRequest;
import com.alab.goexpress.model.response.TicketReservationResponse;
import com.alab.goexpress.reservation.ReservationRepositoryPort;
import com.alab.goexpress.ticket.TicketService;
import jakarta.persistence.EntityManager;
import com.alab.goexpress.master.MasterRepositoryPort;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketReservationService {

  private final EntityManager em;
  private final ReservationRepositoryPort reservationRepo;
  private final TicketService ticketService;
  private final MasterRepositoryPort masterRepo;
  private final com.alab.goexpress.seat.SeatService seatService;

  @Transactional
  public TicketReservationResponse createReservationWithTicketAndSeat(TicketReservationRequest req) {
    String trainCd = req.getTrainCd();
    LocalDate depDate = req.getDepartureDate();
    String depSt = req.getDepartureStationCd();
    String arrSt = req.getArrivalStationCd();

    // 1) マスタ参照: 列車種別
    String trainTypeCd = masterRepo.getTrainTypeCd(trainCd);

    // 2) マスタ参照: 出発・到着時刻、番線
    var depInfo = masterRepo.getDepartureInfo(trainCd, depSt);
    LocalTime arrivalTime = masterRepo.getArrivalTime(trainCd, arrSt);

    // 3) 座席選択（seat_type_cd = '10' 優先）
    var seat = seatService.chooseSeat(trainCd, depDate);

    // 4) 料金取得
    int charge = masterRepo.getCharge(depSt, arrSt, trainTypeCd, seat.seatTypeCd());

    // 5) 予約作成（Account の最小IDを買い手に採用）
    Account buyer = getDefaultBuyerAccount();
    Reservation r = new Reservation();
    r.setInvalidFlg(false);
    r.setAccount(buyer);
    r.setDepartureDate(depDate);
    r.setBuyerName(buyer.getAccountName());
    r.setEmailAddress(buyer.getEmailAddress());
    r.setCardNumber(buyer.getCardNumber());
    r.setExpirationDate(buyer.getExpirationDate());
    Reservation savedReservation = reservationRepo.save(r);

    // 6) チケット作成（TicketService で unused デフォルト設定）
    Ticket t = Ticket.builder()
      .reservationId(savedReservation.getReservationId())
      .trainCd(trainCd)
      .departureDate(depDate)
      .trainCarCd(seat.trainCarCd())
      .seatCd(seat.seatCd())
      .departureStationCd(depSt)
      .arrivalStationCd(arrSt)
      .charge(charge)
      .userName(savedReservation.getBuyerName())
      .emailAddress(savedReservation.getEmailAddress())
      .status((TicketStatus) null) // Service 側で null → unused に補正
      .build();
    ticketService.create(t);

    // 7) 座席確保（T_SEAT へ登録）
    seatService.reserveSeat(trainCd, depDate, seat.trainCarCd(), seat.seatCd(), depSt, arrSt, savedReservation.getReservationId());

    // 8) レスポンス生成
    return new TicketReservationResponse(
      depInfo.departureTime(),
      arrivalTime,
      depInfo.trackNumber(),
      depDate,
      seat.seatCd()
    );
  }

  private Account getDefaultBuyerAccount() {
    List<Account> list = em.createQuery("SELECT a FROM Account a ORDER BY a.accountId ASC", Account.class)
      .setMaxResults(1)
      .getResultList();
    if (list.isEmpty()) {
      throw new IllegalArgumentException("no account found to create reservation");
    }
    return list.getFirst();
  }
}
