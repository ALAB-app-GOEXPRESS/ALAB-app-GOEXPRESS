package com.alab.goexpress.reservation.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CreateReservationRequest(
  boolean invalidFlg,
  @NotNull @Min(1) Integer accountId,
  @NotNull LocalDate departureDate,
  @NotNull LocalDateTime buyDatetime,
  @NotBlank String buyerName,
  @NotBlank @Email String emailAddress,
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @NotBlank @Pattern(regexp = "\\d{12,19}") String cardNumber,
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @NotNull @Future LocalDate expirationDate
) {}
