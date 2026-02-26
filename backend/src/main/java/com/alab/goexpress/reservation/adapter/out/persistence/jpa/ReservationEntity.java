package com.alab.goexpress.reservation.adapter.out.persistence.jpa;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "t_reservation")
public class ReservationEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "reservation_id")
  private Integer reservationId;

  @Column(name = "invalid_flg", nullable = false)
  private boolean invalidFlg;

  @Column(name = "account_id", nullable = false)
  private Integer accountId;

  @Column(name = "departure_date", nullable = false)
  private LocalDate departureDate;

  @Column(name = "buy_datetime", nullable = false)
  private LocalDateTime buyDatetime;

  @Column(name = "buyer_name", nullable = false)
  private String buyerName;

  @Column(name = "email_address", nullable = false)
  private String emailAddress;

  @Column(name = "card_number", nullable = false)
  private String cardNumber;

  @Column(name = "expiration_date", nullable = false)
  private LocalDate expirationDate;

  @PrePersist
  public void onCreate() {
    if (buyDatetime == null) {
      buyDatetime = LocalDateTime.now();
    }
  }
}
