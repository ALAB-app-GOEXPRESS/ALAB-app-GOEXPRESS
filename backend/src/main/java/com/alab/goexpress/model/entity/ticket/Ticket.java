package com.alab.goexpress.model.entity.ticket;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "T_TICKET")
@IdClass(TicketId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

  @Id
  @Column(name = "reservation_id", nullable = false)
  private Integer reservationId;

  @Id
  @Column(name = "train_cd", nullable = false, length = 5)
  private String trainCd;

  @Id
  @Column(name = "departure_date", nullable = false)
  private LocalDate departureDate;

  @Id
  @Column(name = "train_car_cd", nullable = false, length = 2)
  private String trainCarCd;

  @Id
  @Column(name = "seat_cd", nullable = false, length = 3)
  private String seatCd;

  @Id
  @Column(name = "departure_station_cd", nullable = false, length = 2)
  private String departureStationCd;

  @Id
  @Column(name = "arrival_station_cd", nullable = false, length = 2)
  private String arrivalStationCd;

  @Column(name = "charge", nullable = false)
  private Integer charge;

  @Column(name = "user_name", nullable = false, length = 255)
  private String userName;

  @Column(name = "email_address", nullable = false, length = 255)
  private String emailAddress;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "status", nullable = false, columnDefinition = "use_status")
  private TicketStatus status;

  public TicketId toId() {
    return new TicketId(
      reservationId,
      trainCd,
      departureDate,
      trainCarCd,
      seatCd,
      departureStationCd,
      arrivalStationCd
    );
  }
}
