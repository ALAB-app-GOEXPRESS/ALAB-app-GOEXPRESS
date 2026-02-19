package com.alab.goexpress.reservation;

import com.alab.goexpress.account.Account;
import com.alab.goexpress.model.entity.reservation.Reservation;
import com.alab.goexpress.model.request.ReservationCreateRequest.CreateReservationRequest;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationService {

  private final ReservationRepositoryPort reservationRepo;
  private final EntityManager em;

  @Transactional
  public Reservation create(CreateReservationRequest req) {
    Reservation r = new Reservation();
    r.setInvalidFlg(req.invalidFlg());
    r.setDepartureDate(req.departureDate());
    r.setBuyerName(req.buyerName());
    r.setEmailAddress(req.emailAddress());
    r.setCardNumber(req.cardNumber());
    r.setExpirationDate(req.expirationDate());
    // AccountはID参照のみ（存在する前提）。遅延読み込みのため参照プロキシをセット
    Account accRef = em.getReference(Account.class, req.accountId());
    r.setAccount(accRef);
    return reservationRepo.save(r);
  }

  @Transactional(readOnly = true)
  public Reservation get(Integer reservationId) {
    return reservationRepo.findById(reservationId)
      .orElseThrow(() -> new IllegalArgumentException("reservation not found: " + reservationId));
  }

  @Transactional
  public Reservation invalidate(Integer reservationId) {
    Reservation r = get(reservationId);
    r.setInvalidFlg(true);
    return reservationRepo.save(r);
  }

  @Transactional
  public Reservation updateBuyerInfo(Integer reservationId, String buyerName, String emailAddress,
                                    String cardNumber, LocalDate expirationDate) {
    Reservation r = get(reservationId);
    r.setBuyerName(buyerName);
    r.setEmailAddress(emailAddress);
    r.setCardNumber(cardNumber);
    r.setExpirationDate(expirationDate);
    return reservationRepo.save(r);
  }

  @Transactional(readOnly = true)
  public List<Reservation> getByAccount(Integer accountId) {
    return reservationRepo.findByAccountId(accountId);
  }

  @Transactional(readOnly = true)
  public List<Reservation> getByDepartureDate(LocalDate departureDate) {
    return reservationRepo.findByDepartureDate(departureDate);
  }

  @Transactional(readOnly = true)
  public List<Reservation> getByDepartureDateRange(LocalDate start, LocalDate end) {
    return reservationRepo.findByDepartureDateBetween(start, end);
  }

  @Transactional(readOnly = true)
  public List<Reservation> getByInvalidFlg(boolean invalidFlg) {
    return reservationRepo.findByInvalidFlg(invalidFlg);
  }
}
