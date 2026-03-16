package com.alab.goexpress.account;

import org.springframework.stereotype.Service;
import java.util.Optional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService{

private final AccountRepository repo;

public Account findUserByEmailAddres(String email){
  return repo.findByEmailAddress(email);
}

}