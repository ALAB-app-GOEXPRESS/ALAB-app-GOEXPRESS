package com.alab.goexpress.ticket;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketId;
import com.alab.goexpress.model.entity.ticket.TicketStatus;
import java.util.List;
import java.util.Optional;

public interface TicketRepositoryPort {
  Ticket save(Ticket ticket);

  Optional<Ticket> findById(TicketId id);

  boolean existsById(TicketId id);

  void deleteById(TicketId id);

  List<Ticket> findByReservationId(Integer reservationId);

  List<Ticket> findByReservationIdAndStatus(Integer reservationId, TicketStatus status);
}
