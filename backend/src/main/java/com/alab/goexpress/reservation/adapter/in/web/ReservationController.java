package com.alab.goexpress.reservation.adapter.in.web;

import com.alab.goexpress.reservation.adapter.in.web.dto.*;
import com.alab.goexpress.reservation.application.service.ReservationService;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.net.URI;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

  private final ReservationService service;

  @GetMapping
  public ResponseEntity<ReservationListResponse> list(
    @RequestParam(defaultValue = "0") @Min(0) int page,
    @RequestParam(defaultValue = "20") @Min(1) @Max(200) int size,
    @RequestParam(defaultValue = "buyDatetime,desc") String sort
  ) {
    String normalizedSort = SortUtil.normalize(sort, Set.of("buyDatetime", "departureDate"));

    var view = service.listAllInOne(page, size, normalizedSort);

    return ResponseEntity.ok(toResponse(view));
  }

  @GetMapping("/{reservationId}")
  public ResponseEntity<ReservationResponse> get(@PathVariable int reservationId) {
    return service
      .findById(reservationId)
      .map(this::toResponse)
      .map(ResponseEntity::ok)
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ReservationResponse> create(@RequestBody CreateReservationRequest req) {
    Reservation domain = toDomain(req, null);
    Reservation saved = service.save(domain);

    URI location = URI.create("/reservations/" + saved.getReservationId().value());
    return ResponseEntity.created(location).body(toResponse(saved));
  }

  @PutMapping("/{reservationId}")
  public ResponseEntity<ReservationResponse> update(
    @PathVariable int reservationId,
    @RequestBody UpdateReservationRequest req
  ) {
    Reservation domain = toDomain(req, new ReservationId(reservationId));
    Reservation saved = service.save(domain);
    return ResponseEntity.ok(toResponse(saved));
  }

  @DeleteMapping("/{reservationId}")
  public ResponseEntity<Void> delete(@PathVariable int reservationId) {
    service.deleteById(reservationId);
    return ResponseEntity.noContent().build();
  }

  private ReservationListResponse toResponse(
    com.alab.goexpress.reservation.application.query.ReservationListView view
  ) {
    var items = view
      .items()
      .stream()
      .map(v ->
        new ReservationListItemDto(
          v.reservationId(),
          v.invalidFlg(),
          v.departureDate(),
          v.buyDatetime(),
          v.buyerName(),
          v.emailAddress(),
          v
            .tickets()
            .stream()
            .map(t ->
              new TicketWithTrainNameAndOperationDto(
                t.departureDate(),
                t.trainCarCd(),
                t.seatCd(),
                t.charge(),
                t.userName(),
                t.emailAddress(),
                t.status(),
                new TrainNameDto(t.trainName().trainCd(), t.trainName().trainTypeName(), t.trainName().trainNumber()),
                new OperationDto(
                  t.operation().fromStationCd(),
                  t.operation().fromStationName(),
                  t.operation().fromTrackNumber(),
                  t.operation().toStationCd(),
                  t.operation().toStationName(),
                  t.operation().toTrackNumber(),
                  t.operation().departureDateTime(),
                  t.operation().arrivalDateTime()
                )
              )
            )
            .toList(),
          new LinksDto(v.links().self(), v.links().tickets())
        )
      )
      .toList();

    return new ReservationListResponse(
      items,
      new PageDto(view.page().number(), view.page().size(), view.page().totalElements()),
      new LinksDto(view.links().self(), view.links().tickets())
    );
  }

  // --- 変換（API DTO ↔ Domain） ---
  private ReservationResponse toResponse(Reservation d) {
    return new ReservationResponse(
      d.getReservationId().value(),
      d.isInvalidFlg(),
      d.getAccountId(),
      d.getDepartureDate(),
      d.getBuyDatetime(),
      d.getBuyerName(),
      d.getEmailAddress()
    );
  }

  private Reservation toDomain(CreateReservationRequest req, ReservationId id) {
    Reservation d = new Reservation();
    d.setReservationId(id);
    d.setInvalidFlg(req.invalidFlg());
    d.setAccountId(req.accountId());
    d.setDepartureDate(req.departureDate());
    d.setBuyDatetime(req.buyDatetime());
    d.setBuyerName(req.buyerName());
    d.setEmailAddress(req.emailAddress());
    d.setCardNumber(req.cardNumber());
    d.setExpirationDate(req.expirationDate());
    return d;
  }

  private Reservation toDomain(UpdateReservationRequest req, ReservationId id) {
    Reservation d = new Reservation();
    d.setReservationId(id);
    d.setInvalidFlg(req.invalidFlg());
    d.setAccountId(req.accountId());
    d.setDepartureDate(req.departureDate());
    d.setBuyDatetime(req.buyDatetime());
    d.setBuyerName(req.buyerName());
    d.setEmailAddress(req.emailAddress());
    d.setCardNumber(req.cardNumber());
    d.setExpirationDate(req.expirationDate());
    return d;
  }
}
