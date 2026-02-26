package com.alab.goexpress.reservation.adapter.out.persistence.mapper;

import com.alab.goexpress.reservation.adapter.out.persistence.jpa.ReservationEntity;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;

public class ReservationEntityMapper {

  public static ReservationEntity toEntity(Reservation d) {
    ReservationEntity e = new ReservationEntity();
    if (d.getReservationId() != null) {
      e.setReservationId(d.getReservationId().value());
    }
    e.setInvalidFlg(d.isInvalidFlg());
    e.setAccountId(d.getAccountId());
    e.setDepartureDate(d.getDepartureDate());
    e.setBuyDatetime(d.getBuyDatetime());
    e.setBuyerName(d.getBuyerName());
    e.setEmailAddress(d.getEmailAddress());
    e.setCardNumber(d.getCardNumber());
    e.setExpirationDate(d.getExpirationDate());
    return e;
  }

  public static Reservation toDomain(ReservationEntity e) {
    Reservation d = new Reservation();
    d.setReservationId(new ReservationId(e.getReservationId()));
    d.setInvalidFlg(e.isInvalidFlg());
    d.setAccountId(e.getAccountId());
    d.setDepartureDate(e.getDepartureDate());
    d.setBuyDatetime(e.getBuyDatetime());
    d.setBuyerName(e.getBuyerName());
    d.setEmailAddress(e.getEmailAddress());
    d.setCardNumber(e.getCardNumber());
    d.setExpirationDate(e.getExpirationDate());
    return d;
  }
}
