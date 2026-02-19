package com.alab.goexpress.ticketreservation;

import com.alab.goexpress.model.request.TicketReservationRequest;
import com.alab.goexpress.model.response.TicketReservationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ticket-reservations")
@RequiredArgsConstructor
public class TicketReservationController {

  private final TicketReservationService service;

  @PostMapping
  public ResponseEntity<TicketReservationResponse> create(@Valid @RequestBody TicketReservationRequest req) {
    TicketReservationResponse res = service.createReservationWithTicketAndSeat(req);
    return ResponseEntity.ok(res);
  }
}
