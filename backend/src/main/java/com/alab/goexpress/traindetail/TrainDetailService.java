package com.alab.goexpress.traindetail;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.master.MasterRepositoryPort;
import com.alab.goexpress.master.SeatTypeInfoDTO;
import com.alab.goexpress.master.TrainInfoDTO;
import com.alab.goexpress.model.response.TrainDetailResponse;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainDetailService {

  private final MasterRepositoryPort masterRepositoryPort;

  /**
   * 列車詳細情報を取得するビジネスロジック
   *
   * @param date 出発日
   * @param trainCd 列車コード
   * @param fromStationCd 出発駅コード
   * @param toStationCd 到着駅コード
   * @return 画面表示用の列車詳細情報
   */
  @Transactional(readOnly = true)
  public TrainDetailResponse getTrainDetail(LocalDate date, String trainCd, String fromStationCd, String toStationCd) {
    TrainInfoDTO trainInfo = masterRepositoryPort.getTrainInfo(trainCd);
    if (trainInfo == null) {
      throw new RuntimeException("Train not found: " + trainCd);
    }

    DepartureInfo departureInfo = masterRepositoryPort.getDepartureInfo(trainCd, fromStationCd);
    if (departureInfo == null) {
      throw new RuntimeException("Departure info not found");
    }

    LocalTime arrivalTime = masterRepositoryPort.getArrivalTime(trainCd, toStationCd);
    if (arrivalTime == null) {
      throw new RuntimeException("Arrival time not found");
    }

    List<SeatTypeInfoDTO> seatTypes = masterRepositoryPort.getSeatTypesForTrain(trainCd);

    List<TrainDetailResponse.SeatClassInfo> seatClassInfos = seatTypes
      .stream()
      .map(seatType -> {
        String trainTypeCd = masterRepositoryPort.getTrainTypeCd(trainCd);
        int charge = masterRepositoryPort.getCharge(fromStationCd, toStationCd, trainTypeCd, seatType.getSeatTypeCd());

        Long maxSeats = masterRepositoryPort.sumMaxSeatNumber(trainCd, seatType.getSeatTypeCd());
        if (maxSeats == null) {
          maxSeats = 0L;
        }

        long reservedSeats = masterRepositoryPort.countReservedSeatsBySeatType(trainCd, date, seatType.getSeatTypeCd());

        int remainingSeats = (int) (maxSeats - reservedSeats);

        return new TrainDetailResponse.SeatClassInfo(
          seatType.getSeatTypeCd(),
          seatType.getSeatTypeName(),
          charge,
          remainingSeats
        );
      })
      .collect(Collectors.toList());

    return new TrainDetailResponse(
      trainCd,
      trainInfo.getTrainTypeName(),
      trainInfo.getTrainNumber(),
      fromStationCd,
      toStationCd,
      departureInfo.departureTime(),
      arrivalTime,
      departureInfo.trackNumber(),
      seatClassInfos
    );
  }
}
