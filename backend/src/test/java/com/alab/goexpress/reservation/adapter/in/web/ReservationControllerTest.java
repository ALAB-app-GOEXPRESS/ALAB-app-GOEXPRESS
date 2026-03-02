package com.alab.goexpress.reservation.adapter.in.web;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.hamcrest.Matchers.endsWith;

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
    when(reservationService.findById(anyInt())).thenReturn(Optional.empty());

    mockMvc
      .perform(get("/api/reservations/1"))
      .andExpect(status().isNotFound());
  }

  @Test
  void create_shouldReturnCreated_andLocationHeader() throws Exception {
    // Given
    Reservation saved = new Reservation();
    saved.setReservationId(new ReservationId(123));
    when(reservationService.save(org.mockito.ArgumentMatchers.any(Reservation.class)))
      .thenReturn(saved);

    String json = """
      {
        "invalidFlg": false,
        "accountId": 1,
        "departureDate": "2025-01-01",
        "buyDatetime": "2025-01-01T10:00:00",
        "buyerName": "Taro",
        "emailAddress": "taro@example.com",
        "cardNumber": "4111111111111111",
        "expirationDate": "2026-12-31"
      }
      """;

    // When/Then
    mockMvc
      .perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON).content(json))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", endsWith("/api/reservations/123")));
  }
}
