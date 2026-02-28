package com.alab.goexpress.traindetail;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.model.dto.SeatTypeInfoDTO;
import com.alab.goexpress.model.dto.TrainInfoDTO;
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

  private final TrainDetailMapper trainDetailMapper;

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
    TrainInfoDTO trainInfo = trainDetailMapper.findTrainInfo(trainCd);
    if (trainInfo == null) {
      throw new RuntimeException("Train not found: " + trainCd);
    }

    DepartureInfo departureInfo = trainDetailMapper.findDepartureInfo(trainCd, fromStationCd);
    if (departureInfo == null) {
      throw new RuntimeException("Departure info not found");
    }

    LocalTime arrivalTime = trainDetailMapper.findArrivalTime(trainCd, toStationCd);
    if (arrivalTime == null) {
      throw new RuntimeException("Arrival time not found");
    }

    List<SeatTypeInfoDTO> seatTypes = trainDetailMapper.findSeatTypesForTrain(trainCd);

    List<TrainDetailResponse.SeatClassInfo> seatClassInfos = seatTypes
      .stream()
      .map(seatType -> {
        String trainTypeCd = trainDetailMapper.findTrainTypeCd(trainCd);

        Integer chargeResult = trainDetailMapper.findCharge(
          fromStationCd,
          toStationCd,
          trainTypeCd,
          seatType.getSeatTypeCd()
        );
        int charge = (chargeResult != null) ? chargeResult : 0;

        Long maxSeats = trainDetailMapper.sumMaxSeatNumber(trainCd, seatType.getSeatTypeCd());
        if (maxSeats == null) {
          maxSeats = 0L;
        }

        long reservedSeats = trainDetailMapper.countReservedSeatsBySeatType(trainCd, date, seatType.getSeatTypeCd());

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
