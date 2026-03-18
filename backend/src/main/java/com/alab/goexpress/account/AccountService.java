package com.alab.goexpress.account;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

  private final AccountRepository repo;

  public Account findUserByEmailAddres(String email) {
    return repo.findByEmailAddress(email);
  }
}
