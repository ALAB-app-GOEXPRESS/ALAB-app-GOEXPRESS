package com.alab.goexpress.ticket;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketId;
import com.alab.goexpress.model.entity.ticket.TicketStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketService {

  private final TicketRepositoryPort ticketRepo;

  @Transactional
  public Ticket create(Ticket ticket) {
    if (ticket.getStatus() == null) {
      ticket.setStatus(TicketStatus.unused);
    }
    return ticketRepo.save(ticket);
  }

  @Transactional(readOnly = true)
  public Ticket get(TicketId id) {
    return ticketRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + id));
  }

  @Transactional
  public Ticket markUsed(TicketId id) {
    Ticket ticket = get(id);
    ticket.setStatus(TicketStatus.used);
    return ticketRepo.save(ticket);
  }

  @Transactional
  public void delete(TicketId id) {
    ticketRepo.deleteById(id);
  }
}
