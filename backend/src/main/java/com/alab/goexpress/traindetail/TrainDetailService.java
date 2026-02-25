package com.alab.goexpress.traindetail;

import com.alab.goexpress.model.response.TrainDetailResponse;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/train-detail") // フロントの呼び出しパス /api/trains に合わせます
@RequiredArgsConstructor
public class TrainDetailController {

  private final TrainDetailService trainDetailService;

  @GetMapping("/train-detail")
  public ResponseEntity<TrainDetailResponse> getTrainDetail(
    @RequestParam String trainCd,
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
  ) {
    TrainDetailResponse response = trainDetailService.getTrainDetail(trainCd, fromStationCd, toStationCd, date);

    return ResponseEntity.ok(response);
  }
}
