package com.alab.goexpress.model.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public class ReservationCreateRequest {

  public record CreateReservationRequest(
    boolean invalidFlg,
    @NotNull Integer accountId,
    @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @NotNull String buyerName,
    @NotNull String emailAddress,
    @NotNull String cardNumber,
    @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expirationDate
  ) {}

  public record UpdateBuyerInfoRequest(
    @NotNull String buyerName,
    @NotNull String emailAddress,
    @NotNull String cardNumber,
    @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expirationDate
  ) {}
}
