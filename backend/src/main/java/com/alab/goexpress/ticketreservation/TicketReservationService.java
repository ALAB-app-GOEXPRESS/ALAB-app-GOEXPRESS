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
    SeatChoice seat = chooseSeat(trainCd, depDate);

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
    insertSeat(trainCd, depDate, seat.trainCarCd(), seat.seatCd(), depSt, arrSt, savedReservation.getReservationId());

    // 8) レスポンス生成
    return new TicketReservationResponse(
      depInfo.departureTime(),
      arrivalTime,
      depInfo.trackNumber(),
      depDate,
      seat.seatCd()
    );
  }

  private record SeatChoice(String trainCarCd, String seatCd, String seatTypeCd) {}

  /**
   * 同一列車・同一日付で既に一度も使用されていない seat を割り当てます（重複区間判定は簡略化）。
   */
  private SeatChoice chooseSeat(String trainCd, LocalDate depDate) {
    // 候補車両（指定席 '10'）を取得
    @SuppressWarnings("unchecked")
    List<Object[]> cars = em.createNativeQuery(
        "SELECT train_car_cd, seat_type_cd, max_seat_number " +
        "FROM M_TRAIN_CAR WHERE train_cd = :trainCd AND seat_type_cd = '10' ORDER BY train_car_cd")
      .setParameter("trainCd", trainCd)
      .getResultList();

    if (cars.isEmpty()) {
      throw new IllegalArgumentException("no available cars (seat_type_cd='10') for train: " + trainCd);
    }

    // 既使用座席（列車＋日付で一意とみなす）
    @SuppressWarnings("unchecked")
    List<Object[]> used = em.createNativeQuery(
        "SELECT train_car_cd, seat_cd FROM T_SEAT WHERE train_cd = :trainCd AND departure_date = :depDate")
      .setParameter("trainCd", trainCd)
      .setParameter("depDate", depDate)
      .getResultList();

    Set<String> occupied = new HashSet<>();
    for (Object[] u : used) {
      occupied.add(Objects.toString(u[0]) + ":" + Objects.toString(u[1]));
    }

    for (Object[] car : cars) {
      String trainCarCd = Objects.toString(car[0]);
      String seatTypeCd = Objects.toString(car[1]);
      int max = ((Number) car[2]).intValue();

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

  private Account getDefaultBuyerAccount() {
    List<Account> list = em.createQuery("SELECT a FROM Account a ORDER BY a.accountId ASC", Account.class)
      .setMaxResults(1)
      .getResultList();
    if (list.isEmpty()) {
      throw new IllegalArgumentException("no account found to create reservation");
    }
    return list.get(0);
  }

  private void insertSeat(
      String trainCd, LocalDate depDate, String trainCarCd, String seatCd,
      String depSt, String arrSt, Integer reservationId) {

    em.createNativeQuery(
        "INSERT INTO T_SEAT (train_cd, departure_date, train_car_cd, seat_cd, " +
        "departure_station_cd, arrival_station_cd, reservation_id) " +
        "VALUES (:trainCd, :depDate, :car, :seat, :depSt, :arrSt, :resId)")
      .setParameter("trainCd", trainCd)
      .setParameter("depDate", depDate)
      .setParameter("car", trainCarCd)
      .setParameter("seat", seatCd)
      .setParameter("depSt", depSt)
      .setParameter("arrSt", arrSt)
      .setParameter("resId", reservationId)
      .executeUpdate();
  }
}
