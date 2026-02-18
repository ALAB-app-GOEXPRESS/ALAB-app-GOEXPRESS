package com.alab.goexpress.ticket;

import com.alab.goexpress.model.entity.ticket.Ticket;
import com.alab.goexpress.model.entity.ticket.TicketId;
import com.alab.goexpress.model.entity.ticket.TicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketJpaRepository extends JpaRepository<Ticket, TicketId> {
  List<Ticket> findByReservationId(Integer reservationId);

  List<Ticket> findByReservationIdAndStatus(Integer reservationId, TicketStatus status);
}
