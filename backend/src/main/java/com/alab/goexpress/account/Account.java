package com.alab.goexpress.account;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Getter
@Entity
@Table(name = "t_account")
public class Account {

  @Id
  @Column(name = "account_id")
  private Integer accountId; // IDENTITY指定がないためアプリ/既存DB運用に従い採番

  @Column(name = "account_name", nullable = false)
  private String accountName;

  @Column(name = "email_address", nullable = false)
  private String emailAddress;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "card_number", nullable = false)
  private String cardNumber;

  @Column(name = "expiration_date", nullable = false)
  private LocalDate expirationDate;
}
