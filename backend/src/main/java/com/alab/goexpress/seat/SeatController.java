package com.alab.goexpress.seat;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {
  private final SeatService service;

  @GetMapping
  public List<SeatResponse> get(
    @RequestParam("train_cd") String trainCd,
    @RequestParam("departure_date") LocalDate departureDate
  ) {
    return service.find(trainCd, departureDate);
  }
}
