package com.alab.goexpress.model.request;

import com.alab.goexpress.model.entity.ticket.TicketStatus;
import java.time.LocalDate;
import lombok.Data;

@Data
public class TicketCreateRequest {

  private Integer reservationId;
  private String trainCd;
  private LocalDate departureDate;
  private String trainCarCd;
  private String seatCd;
  private String departureStationCd;
  private String arrivalStationCd;

  private Integer charge;
  private String userName;
  private String emailAddress;

  private TicketStatus status;
}
