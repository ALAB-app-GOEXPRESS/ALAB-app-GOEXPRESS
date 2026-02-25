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

  /**
   * 列車詳細情報を取得するAPIエンドポイント
   * GET /api/trains/detail?trainCd=...&from=...&to=...&date=...
   */
  @GetMapping("/train-detail")
  public ResponseEntity<TrainDetailResponse> getTrainDetail(
    @RequestParam String trainCd,
    @RequestParam("from") String fromStationCd, // フロントのパラメータ名 'from' に合わせる
    @RequestParam("to") String toStationCd, // フロントのパラメータ名 'to' に合わせる
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
  ) {
    // Serviceを呼び出してビジネスロジックを実行
    TrainDetailResponse response = trainDetailService.getTrainDetail(trainCd, fromStationCd, toStationCd, date);

    // 結果をOKステータスで返す
    return ResponseEntity.ok(response);
  }
}
