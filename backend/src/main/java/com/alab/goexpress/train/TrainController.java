package com.alab.goexpress.train;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

  private final TrainService service;

  @GetMapping
  public List<TrainBetweenStationsDto> between(
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd
  ) {
    return service.findBetween(fromStationCd, toStationCd);
  }
}
