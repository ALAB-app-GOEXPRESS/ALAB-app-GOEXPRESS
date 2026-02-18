package com.alab.goexpress.ticket;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketId;
import com.alab.goexpress.model.entity.ticket.TicketStatus;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TicketRepositoryImpl implements TicketRepositoryPort {

  private final TicketJpaRepository jpa;

  @Override
  public Ticket save(Ticket ticket) {
    return Objects.requireNonNull(jpa.save(ticket), "jpa.save(ticket) returned null");
  }

  @Override
  public Optional<Ticket> findById(TicketId id) {
    return jpa.findById(id);
  }

  @Override
  public boolean existsById(TicketId id) {
    return jpa.existsById(id);
  }

  @Override
  public void deleteById(TicketId id) {
    jpa.deleteById(id);
  }

  @Override
  public List<Ticket> findByReservationId(Integer reservationId) {
    return jpa.findByReservationId(reservationId);
  }

  @Override
  public List<Ticket> findByReservationIdAndStatus(Integer reservationId, TicketStatus status) {
    return jpa.findByReservationIdAndStatus(reservationId, status);
  }
}
