package com.alab.goexpress.reservation.adapter.in.web.mapper;

import com.alab.goexpress.reservation.adapter.in.web.dto.CreateReservationRequest;
import com.alab.goexpress.reservation.adapter.in.web.dto.ReservationResponse;
import com.alab.goexpress.reservation.adapter.in.web.dto.UpdateReservationRequest;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;

public final class ReservationMapper {

  private ReservationMapper() {}

  public static ReservationResponse toResponse(Reservation d) {
    return new ReservationResponse(
      d.getReservationId().value(),
      d.isInvalidFlg(),
      d.getAccountId(),
      d.getDepartureDate(),
      d.getBuyDatetime(),
      d.getBuyerName(),
      d.getEmailAddress()
    );
  }

  public static Reservation toDomain(CreateReservationRequest req, ReservationId id) {
    Reservation d = new Reservation();
    d.setReservationId(id);
    d.setInvalidFlg(req.invalidFlg());
    d.setAccountId(req.accountId());
    d.setDepartureDate(req.departureDate());
    d.setBuyDatetime(req.buyDatetime());
    d.setBuyerName(req.buyerName());
    d.setEmailAddress(req.emailAddress());
    d.setCardNumber(req.cardNumber());
    d.setExpirationDate(req.expirationDate());
    return d;
  }

  public static Reservation toDomain(UpdateReservationRequest req, ReservationId id) {
    Reservation d = new Reservation();
    d.setReservationId(id);
    d.setInvalidFlg(req.invalidFlg());
    d.setAccountId(req.accountId());
    d.setDepartureDate(req.departureDate());
    d.setBuyDatetime(req.buyDatetime());
    d.setBuyerName(req.buyerName());
    d.setEmailAddress(req.emailAddress());
    d.setCardNumber(req.cardNumber());
    d.setExpirationDate(req.expirationDate());
    return d;
  }
}
