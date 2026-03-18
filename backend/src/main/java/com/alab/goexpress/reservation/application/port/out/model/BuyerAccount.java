package com.alab.goexpress.reservation.application.port.out.model;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record BuyerAccount(
  Integer accountId,
  String accountName,
  String emailAddress,
  String cardNumber,
  LocalDate expirationDate
) {}
