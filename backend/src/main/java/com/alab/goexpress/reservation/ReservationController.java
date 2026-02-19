package com.alab.goexpress.reservation;

import com.alab.goexpress.model.entity.reservation.Reservation;
import com.alab.goexpress.model.request.ReservationCreateRequest.CreateReservationRequest;
import com.alab.goexpress.model.request.ReservationCreateRequest.UpdateBuyerInfoRequest;
import com.alab.goexpress.model.response.ReservationResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

  private final ReservationService reservationService;

  private ReservationResponse toResponse(Reservation r) {
    return new ReservationResponse(
      r.getReservationId(),
      r.isInvalidFlg(),
      r.getAccount().getAccountId(),
      r.getDepartureDate(),
      r.getBuyDatetime(),
      r.getBuyerName(),
      r.getEmailAddress(),
      r.getCardNumber(),
      r.getExpirationDate()
    );
  }

  @PostMapping
  public ResponseEntity<ReservationResponse> create(@Valid @RequestBody CreateReservationRequest req) {
    Reservation saved = reservationService.create(req);
    return ResponseEntity
      .created(URI.create("/api/reservations/" + saved.getReservationId()))
      .body(toResponse(saved));
  }

  @PatchMapping("/{id}/invalidate")
  public ResponseEntity<ReservationResponse> invalidate(@PathVariable Integer id) {
    Reservation updated = reservationService.invalidate(id);
    return ResponseEntity.ok(toResponse(updated));
  }

  @PatchMapping("/{id}/buyer")
  public ResponseEntity<ReservationResponse> updateBuyer(
    @PathVariable Integer id,
    @Valid @RequestBody UpdateBuyerInfoRequest req
  ) {
    Reservation updated = reservationService.updateBuyerInfo(
      id, req.buyerName(), req.emailAddress(), req.cardNumber(), req.expirationDate());
    return ResponseEntity.ok(toResponse(updated));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ReservationResponse> getById(@PathVariable Integer id) {
    return ResponseEntity.ok(toResponse(reservationService.get(id)));
  }

  // Search: accountId / departureDate / startDate&endDate / invalidFlg のいずれかで検索
  @GetMapping
  public ResponseEntity<List<ReservationResponse>> search(
    @RequestParam(required = false) Integer accountId,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
    @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
    @RequestParam(required = false) Boolean invalidFlg
  ) {
    List<Reservation> list;
    if (accountId != null) {
      list = reservationService.getByAccount(accountId);
    } else if (departureDate != null) {
      list = reservationService.getByDepartureDate(departureDate);
    } else if (start != null && end != null) {
      list = reservationService.getByDepartureDateRange(start, end);
    } else if (invalidFlg != null) {
      list = reservationService.getByInvalidFlg(invalidFlg);
    } else {
      list = List.of();
    }
    return ResponseEntity.ok(list.stream().map(this::toResponse).collect(Collectors.toList()));
  }
}
