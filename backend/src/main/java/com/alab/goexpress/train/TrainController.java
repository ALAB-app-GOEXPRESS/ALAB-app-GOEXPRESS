package com.alab.goexpress.train;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

  private final TrainService service;

  @GetMapping
  public List<TrainResponse> get(
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd
  ) {
    return service.find(fromStationCd, toStationCd);
  }

  /**
   * 列車詳細情報を取得するAPIエンドポイント
   * 例: GET /api/trains/2026-02-24/T0001/detail?from=S01&to=S02
   *
   * @param date 出発日 (パス変数)
   * @param trainCd 列車コード (パス変数)
   * @param fromStationCd 出発駅コード (クエリパラメータ)
   * @param toStationCd 到着駅コード (クエリパラメータ)
   * @return 列車詳細情報
   */
  @GetMapping("/{date}/{trainCd}/detail")
  public ResponseEntity<TrainDetailResponse> getTrainDetail(
    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
    @PathVariable String trainCd,
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd
  ) {
    TrainDetailResponse response = service.getTrainDetail(date, trainCd, fromStationCd, toStationCd);

    return ResponseEntity.ok(response);
  }
}
