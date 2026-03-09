package com.alab.goexpress.reservation.adapter.in.web;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.endsWith;

import com.alab.goexpress.reservation.application.query.LinksView;
import com.alab.goexpress.reservation.application.query.ReservationListItemView;
import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.application.service.ReservationService;
import com.alab.goexpress.reservation.domain.model.Reservation;
import com.alab.goexpress.reservation.domain.model.ReservationId;
import org.springframework.http.MediaType;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ReservationController.class)
class ReservationControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private ReservationService reservationService;

  @Test
  void list_shouldReturnOk() throws Exception {
    when(reservationService.listAllInOne(anyInt(), anyInt(), anyString()))
      .thenReturn(ReservationListView.empty(0, 20, 0, "/api/reservations"));

    mockMvc
      .perform(get("/api/reservations"))
      .andExpect(status().isOk());
  }

  @Test
  void get_shouldReturnNotFound_whenMissing() throws Exception {
    when(reservationService.findItemViewById(anyInt())).thenReturn(Optional.empty());

    mockMvc
      .perform(get("/api/reservations/1"))
      .andExpect(status().isNotFound());
  }

  @Test
  void create_shouldReturnCreated_andLocationHeader() throws Exception {
    // Given: service returns created view with id=123
    ReservationListItemView view = new ReservationListItemView(
      123,
      false,
      java.time.LocalDate.parse("2025-01-01"),
      java.time.LocalDateTime.parse("2025-01-01T10:00:00"),
      "Taro",
      "taro@example.com",
      java.util.List.of(),
      new LinksView("/api/reservations/123", "/api/reservations/123/tickets")
    );
    when(reservationService.createReservationWithTicketAndSeat(org.mockito.ArgumentMatchers.any()))
      .thenReturn(view);

    String json = """
      {
        "trainCd": "A001",
        "departureDate": "2025-01-01",
        "departureStationCd": "01",
        "arrivalStationCd": "05"
      }
      """;

    // When/Then
    mockMvc
      .perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON).content(json))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", endsWith("/api/reservations/123")));
  }
}
