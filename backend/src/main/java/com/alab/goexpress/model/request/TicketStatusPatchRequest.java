package com.alab.goexpress.model.request;

import com.alab.goexpress.model.entity.ticket.TicketStatus;
import lombok.Data;

@Data
public class TicketStatusPatchRequest {

  private TicketStatus status;
}
