package com.alab.goexpress.account;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Integer> {
  public Account findByEmailAddress(String emailAddress);
}
