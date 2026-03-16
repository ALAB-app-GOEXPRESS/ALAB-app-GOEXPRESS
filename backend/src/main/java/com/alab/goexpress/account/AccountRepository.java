package com.alab.goexpress.account;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.alab.goexpress.account.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    public Account findByEmailAddress(String emailAddress);

};