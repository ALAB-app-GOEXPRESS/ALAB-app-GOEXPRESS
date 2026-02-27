package com.alab.goexpress.traindetail;

import com.alab.goexpress.model.response.TrainDetailResponse;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainDetailController {

  private final TrainDetailService trainDetailService;

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
    TrainDetailResponse response = trainDetailService.getTrainDetail(date, trainCd, fromStationCd, toStationCd);

    return ResponseEntity.ok(response);
  }
}
