package com.alab.goexpress.model.request;

import com.alab.goexpress.model.entity.ticket.TicketStatus;
import lombok.Data;

@Data
public class TicketUpdateRequest {

  private Integer charge;
  private String userName;
  private String emailAddress;
  private TicketStatus status;
}
