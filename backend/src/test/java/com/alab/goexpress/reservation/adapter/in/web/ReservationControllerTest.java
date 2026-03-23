package com.alab.goexpress.reservation.adapter.in.web;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.alab.goexpress.reservation.application.query.ReservationListView;
import com.alab.goexpress.reservation.application.service.ReservationService;
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
    when(reservationService.listAllInOne(anyInt(), anyInt(), anyString(), anyString())).thenReturn(
      ReservationListView.empty(0, 20, 0, "/api/reservations")
    );

    mockMvc.perform(get("/api/reservations")).andExpect(status().isOk());
  }

  @Test
  void get_shouldReturnNotFound_whenMissing() throws Exception {
    when(reservationService.findItemViewById(anyInt())).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/reservations/1")).andExpect(status().isNotFound());
  }
}
