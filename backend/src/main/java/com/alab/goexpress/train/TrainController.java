package com.alab.goexpress.train;

import com.alab.goexpress.train.dto.TrainDetailResponse;
import com.alab.goexpress.train.dto.TrainDto;
import java.time.LocalDate;
import java.time.LocalTime;
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
  public List<TrainDto> get(
    @RequestParam("from") String fromStationCd,
    @RequestParam("to") String toStationCd,
    @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
    @RequestParam("time") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {
    return service.find(fromStationCd, toStationCd,date,time);
  }

  /**
   * 列車詳細情報を取得するAPIエンドポイント
   * 例: GET /api/trains/2026-02-24/T0001/detail?from=S01&to=S02
   *
   * @param trainCd 列車コード (パス変数)
   * @param fromStationCd 出発駅コード (クエリパラメータ)
   * @param toStationCd 到着駅コード (クエリパラメータ)
   * @param date 出発日 (クエリパラメータ)
   * @param time 出発時刻 (クエリパラメータ)
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
