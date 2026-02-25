package com.alab.goexpress.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainDetailResponse {

  private String trainCd;
  private String trainTypeName;
  private String trainNumber;
  private String fromStationCd;
  private String toStationCd;

  @JsonFormat(pattern = "HH:mm") // フロントが "06:32" 形式を期待しているのでフォーマットを指定
  private LocalTime departureTime;

  @JsonFormat(pattern = "HH:mm") // こちらも同様
  private LocalTime arrivalTime;

  private String trackNumber;
  private List<SeatClassInfo> seatClasses;

  /**
   * 座席クラスごとの詳細情報を格納する内部クラス
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class SeatClassInfo {

    private String seatTypeCd;
    private String seatTypeName;
    private int charge;
    private int remainingSeats;
  }
}
