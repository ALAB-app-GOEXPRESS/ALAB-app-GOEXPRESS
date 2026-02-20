package com.alab.goexpress.plan;

import com.alab.goexpress.model.entity.master.Plan;
import com.alab.goexpress.model.entity.master.PlanId;
import com.alab.goexpress.model.request.PlanCreateRequest;
import com.alab.goexpress.model.request.PlanUpdateRequest;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

  private final PlanService planService;

  @PostMapping
  public ResponseEntity<Plan> create(@RequestBody PlanCreateRequest req) {
    Plan plan = Plan.builder()
      .trainCd(req.getTrainCd())
      .arrivalStationCd(req.getArrivalStationCd())
      .arrivalTime(req.getArrivalTime())
      .departureTime(req.getDepartureTime())
      .trackNumber(req.getTrackNumber())
      .build();

    Plan created = planService.create(plan);

    URI location = URI.create(String.format("/api/plans/%s/%s", created.getTrainCd(), created.getArrivalStationCd()));

    return ResponseEntity.created(location).body(created);
  }

  @GetMapping("/{trainCd}/{arrivalStationCd}")
  public Plan get(@PathVariable String trainCd, @PathVariable String arrivalStationCd) {
    return planService.get(new PlanId(trainCd, arrivalStationCd));
  }

  @PutMapping("/{trainCd}/{arrivalStationCd}")
  public Plan update(
    @PathVariable String trainCd,
    @PathVariable String arrivalStationCd,
    @RequestBody PlanUpdateRequest req
  ) {
    PlanId id = new PlanId(trainCd, arrivalStationCd);

    Plan values = Plan.builder()
      .trainCd(trainCd)
      .arrivalStationCd(arrivalStationCd)
      .arrivalTime(req.getArrivalTime())
      .departureTime(req.getDepartureTime())
      .trackNumber(req.getTrackNumber())
      .build();

    return planService.update(id, values);
  }

  @DeleteMapping("/{trainCd}/{arrivalStationCd}")
  public ResponseEntity<Void> delete(@PathVariable String trainCd, @PathVariable String arrivalStationCd) {
    planService.delete(new PlanId(trainCd, arrivalStationCd));
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public List<Plan> list(@RequestParam String trainCd) {
    return planService.listByTrainCd(trainCd);
  }
}
