package com.alab.goexpress.plan;

import com.alab.goexpress.model.dto.TrainBetweenStationsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainSearchController {

  private final TrainSearchService service;

  @GetMapping("/between")
  public List<TrainBetweenStationsDto> between(
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd
  ) {
    return service.findBetween(fromStationCd, toStationCd);
  }
}
