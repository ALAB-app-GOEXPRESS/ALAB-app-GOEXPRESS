package com.alab.goexpress.ticket;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketId;
import com.alab.goexpress.model.request.TicketCreateRequest;
import com.alab.goexpress.model.request.TicketStatusPatchRequest;
import com.alab.goexpress.model.request.TicketUpdateRequest;
import java.net.URI;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

  private final TicketService ticketService;

  // --- CREATE ---
  @PostMapping
  public ResponseEntity<Ticket> create(@RequestBody TicketCreateRequest req) {
    Ticket ticket = Ticket.builder()
      .reservationId(req.getReservationId())
      .trainCd(req.getTrainCd())
      .departureDate(req.getDepartureDate())
      .trainCarCd(req.getTrainCarCd())
      .seatCd(req.getSeatCd())
      .departureStationCd(req.getDepartureStationCd())
      .arrivalStationCd(req.getArrivalStationCd())
      .charge(req.getCharge())
      .userName(req.getUserName())
      .emailAddress(req.getEmailAddress())
      .status(req.getStatus())
      .build();

    Ticket created = ticketService.create(ticket);

    // Location ヘッダ（複合PKなので長いが、一応返す）
    URI location = URI.create(
      String.format(
        "/api/tickets/%d/%s/%s/%s/%s/%s/%s",
        created.getReservationId(),
        created.getTrainCd(),
        created.getDepartureDate(),
        created.getTrainCarCd(),
        created.getSeatCd(),
        created.getDepartureStationCd(),
        created.getArrivalStationCd()
      )
    );
    return ResponseEntity.created(location).body(created);
  }

  // --- READ (by composite key) ---
  @GetMapping(
    "/{reservationId}/{trainCd}/{departureDate}/{trainCarCd}/{seatCd}/{departureStationCd}/{arrivalStationCd}"
  )
  public Ticket get(
    @PathVariable Integer reservationId,
    @PathVariable String trainCd,
    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @PathVariable String trainCarCd,
    @PathVariable String seatCd,
    @PathVariable String departureStationCd,
    @PathVariable String arrivalStationCd
  ) {
    TicketId id = new TicketId(
      reservationId,
      trainCd,
      departureDate,
      trainCarCd,
      seatCd,
      departureStationCd,
      arrivalStationCd
    );
    return ticketService.get(id);
  }

  // --- UPDATE (PUT) ---
  @PutMapping(
    "/{reservationId}/{trainCd}/{departureDate}/{trainCarCd}/{seatCd}/{departureStationCd}/{arrivalStationCd}"
  )
  public Ticket update(
    @PathVariable Integer reservationId,
    @PathVariable String trainCd,
    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @PathVariable String trainCarCd,
    @PathVariable String seatCd,
    @PathVariable String departureStationCd,
    @PathVariable String arrivalStationCd,
    @RequestBody TicketUpdateRequest req
  ) {
    TicketId id = new TicketId(
      reservationId,
      trainCd,
      departureDate,
      trainCarCd,
      seatCd,
      departureStationCd,
      arrivalStationCd
    );
    Ticket ticket = ticketService.get(id);

    // 全項目更新（必要な分だけ）
    ticket.setCharge(req.getCharge());
    ticket.setUserName(req.getUserName());
    ticket.setEmailAddress(req.getEmailAddress());
    ticket.setStatus(req.getStatus());

    return ticketService.create(ticket); // create() は save() してる想定。名前が気になるなら serviceに update() を作るのが本筋。
  }

  // --- PATCH status only ---
  @PatchMapping(
    "/{reservationId}/{trainCd}/{departureDate}/{trainCarCd}/{seatCd}/{departureStationCd}/{arrivalStationCd}/status"
  )
  public Ticket patchStatus(
    @PathVariable Integer reservationId,
    @PathVariable String trainCd,
    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @PathVariable String trainCarCd,
    @PathVariable String seatCd,
    @PathVariable String departureStationCd,
    @PathVariable String arrivalStationCd,
    @RequestBody TicketStatusPatchRequest req
  ) {
    TicketId id = new TicketId(
      reservationId,
      trainCd,
      departureDate,
      trainCarCd,
      seatCd,
      departureStationCd,
      arrivalStationCd
    );

    // 既存の markUsed() みたいな専用メソッドがあれば使う。今回は汎用で。
    Ticket ticket = ticketService.get(id);
    ticket.setStatus(req.getStatus());
    return ticketService.create(ticket);
  }

  // --- DELETE ---
  @DeleteMapping(
    "/{reservationId}/{trainCd}/{departureDate}/{trainCarCd}/{seatCd}/{departureStationCd}/{arrivalStationCd}"
  )
  public ResponseEntity<Void> delete(
    @PathVariable Integer reservationId,
    @PathVariable String trainCd,
    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
    @PathVariable String trainCarCd,
    @PathVariable String seatCd,
    @PathVariable String departureStationCd,
    @PathVariable String arrivalStationCd
  ) {
    TicketId id = new TicketId(
      reservationId,
      trainCd,
      departureDate,
      trainCarCd,
      seatCd,
      departureStationCd,
      arrivalStationCd
    );
    ticketService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
