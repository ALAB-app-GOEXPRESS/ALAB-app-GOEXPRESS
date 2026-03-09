package com.alab.goexpress.reservation.application.port.out.model;

import java.time.LocalDate;

public record BuyerAccount(
  Integer accountId,
  String accountName,
  String emailAddress,
  String cardNumber,
  LocalDate expirationDate
) {}
