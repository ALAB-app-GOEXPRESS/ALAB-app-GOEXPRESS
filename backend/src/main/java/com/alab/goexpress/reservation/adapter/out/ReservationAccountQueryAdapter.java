package com.alab.goexpress.reservation.adapter.out;

import com.alab.goexpress.account.Account;
import com.alab.goexpress.account.AccountService;
import com.alab.goexpress.reservation.application.port.out.AccountQueryPort;
import com.alab.goexpress.reservation.application.port.out.model.BuyerAccount;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationAccountQueryAdapter implements AccountQueryPort {

  private final EntityManager em;
  private final AccountService accountService;

  @Override
  public BuyerAccount getDefaultBuyerAccount() {
    List<Account> list = em
      .createQuery("SELECT a FROM Account a ORDER BY a.accountId ASC", Account.class)
      .setMaxResults(1)
      .getResultList();
    if (list.isEmpty()) {
      throw new IllegalArgumentException("no account found to create reservation");
    }
    Account a = list.getFirst();
    return new BuyerAccount(
      a.getAccountId(),
      a.getAccountName(),
      a.getEmailAddress(),
      a.getCardNumber(),
      a.getExpirationDate()
    );
  }

  @Override
  public BuyerAccount findBuyerAccount(String userEmail) {
    Account account = accountService.findUserByEmailAddres(userEmail);

    return BuyerAccount.builder()
      .accountId(account.getAccountId())
      .accountName(account.getAccountName())
      .cardNumber(account.getCardNumber())
      .emailAddress(account.getEmailAddress())
      .expirationDate(account.getExpirationDate())
      .build();
  }
}
