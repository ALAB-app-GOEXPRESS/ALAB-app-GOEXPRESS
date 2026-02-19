package com.alab.goexpress.model.entity.reservation;

import com.alab.goexpress.account.Account;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "t_reservation")
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "reservation_id")
  private Integer reservationId;

  @Column(name = "invalid_flg", nullable = false)
  private boolean invalidFlg;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "account_id", nullable = false)
  private Account account;

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
